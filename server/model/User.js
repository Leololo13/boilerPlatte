const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = mongoose.Schema({
  id: {
    type: String,
    maxlength: 50,
    required: true,
    trim: 1,
    unique: 1,
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
  },
  name: {
    type: String,
    maxlength: 50,
    required: true,
  },
  lastname: {
    type: String,
    maxlength: 50,
    required: true,
  },
  nickname: {
    type: String,
    trim: 1,
    unique: 1,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    trim: 1,
    unique: 1,
    required: true,
    minlength: 8,
  },
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
  signupDate: {
    type: Date,
    default: new Date(),
  },
  role: {
    type: Number,
    default: 1, // 1은 기본, admin은 0
  },
  image: {
    type: String,
  },
});

///pre는 user스키마가 뭔가를 하기전에 실행됨. 'save'를 하기전에 실행되는 함수!
userSchema.pre('save', function (next) {
  let user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, function (err, salt) {
      if (err) return next(err);
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    next();
  }
});

//userdata.comparePassword(req.body.password,(err,ismatch) 여기서 가져왓기때문에, 비번,콜백함수를 넣어야맞다!
userSchema.methods.comparePassword = function (plainPassword, cb) {
  //plainPassword 는 지금 입력한 바로 그값임. 암호화되기전의 pw! 따라서 db의 암호화된 pw랑 비교하려면 같이 암호화해야함.
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

////jwt를 이용해서 토큰생성해버리기~~~~~~~~~=============================
userSchema.methods.genToken = function (cb) {
  let user = this;
  //jwt이용하기
  let token1 = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: '1m',
      issuer: 'About Tech',
    }
  );
  let token2 = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: '24h',
      issuer: 'About Tech',
    }
  );
  user.access_token = token1;
  user.refresh_token = token2;
  user.save((err, user) => {
    if (err) return cb(err);
    cb(null, user);
  });
};
///refresh token
userSchema.methods.refreshAcToken = function (token, cb) {
  //acc토큰 확인 expire시? 재발행해야함
  let user = this;
  //사용자가 쿠키에 가지고있는 token을 받는다
  //token을 decode한다
  jwt.verify(token, process.env.REFRESH_TOKEN, (err, decode) => {
    //token으로 db에서 사용자 token을 찾아서 비교한다.
    user.findOne({ id: decode.id, token: token }, (err, user) => {
      //틀리면 no
      if (err) return cb(err);
      //맞으면 ok
      cb(null, user);
    });
  });
};
//토큰을 찾아서 비교하기
userSchema.statics.findByACToken = function (token, cb) {
  let user = this;
  const TOKEN_EXPIRED = -3;
  try {
    const data = jwt.verify(token.accToken, process.env.ACCESS_TOKEN);
    const user1 = user.findOne({ id: data.id, token: data.access_token });
  } catch (err) {
    if (err.message === 'jwt expired') {
      console.log('acctoken expired');
      try {
        console.log('reftoken check');
        console.log(token);
        const data = jwt.verify(token.refToken, process.env.REFRESH_TOKEN);
        console.log(data);
        const user2 = user.findOne({ id: data.id, token: data.refresh_token });
        console.log('makenewtoken');
        let token = jwt.sign(
          {
            id: user2.id,
            name: user2.name,
            email: user2.email,
          },
          process.env.ACCESS_TOKEN,
          {
            expiresIn: '3m',
            issuer: 'About Tech',
          }
        );
        console.log('makenewtoken');
        user.access_token = token;
        user.save((err, user) => {
          if (err) return err;
          cb(null, user);
        });
      } catch (err) {
        console.log(err.message, '123213');
        if (err.message === 'jwt expired') {
          console.log('reftoken expired');
          return TOKEN_EXPIRED;
        }
      }
    }
  }
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
