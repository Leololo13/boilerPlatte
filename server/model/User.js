const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const saltRounds = 10;
const jwt = require('jsonwebtoken');
require('dotenv').config();

const userSchema = mongoose.Schema({
  id: {
    type: String,
    maxlength: 50,
    unique: 1,
    trim: 1,
  },
  password: {
    type: String,
    minlength: 7,
  },
  nickname: {
    type: String,
    maxlength: 50,
    unique: 1,
    trim: 1,
  },
  name: {
    type: String,
    maxlength: 50,
  },
  lastname: {
    type: String,
    maxlength: 50,
  },
  email: {
    type: String,
    unique: 1,
    trim: 1,
  },
  access_token: {
    type: String,
  },
  refresh_token: {
    type: String,
  },
  role: {
    type: Number,
    default: 1, ///1은 일반인, 0은 관리자,2는 외부로 가입한사람,.. 3은.. 블록?된사람?
  },
  image: {
    type: String,
  },
  posts: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    },
  ],
  scrap: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'List',
    },
  ],
  comments: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Comment',
    },
  ],
  signupDate: {
    type: Date,
    default: Date.now,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  exp: {
    type: Number,
    default: 0,
  },
});
///되나
userSchema.pre('save', function (next) {
  let user = this;
  console.log('세이브할떄마다 이게되는것인가?');
  if (user.isModified('password')) {
    console.log('여기로 와야하는데');
    bcrypt.genSalt(saltRounds, (err, salt) => {
      bcrypt.hash(user.password, salt, (err, hash) => {
        if (err) return next(err);
        user.password = hash;
        next();
      });
    });
  } else {
    console.log('비번안바꾸면여기로옴');
    next();
  }
});
userSchema.methods.chagePassword = function (newPW, cb) {
  let user = this;
  console.log('비번변경은 여기로', user.password, newPW);
  user.password = newPW;
  user.save((err, user) => {
    console.log('비번 변경후 저장');
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.methods.comparePassword = function (plainPassword, cb) {
  console.log(plainPassword, this.password);
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    console.log(isMatch);
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.genToken = function (cb) {
  let user = this;
  let token1 = jwt.sign(
    {
      _id: user._id,
      username: user.nickname,
      email: user.email,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: '10m',
      issuer: 'About Tech',
      algorithm: 'HS256',
    }
  );
  let token2 = jwt.sign(
    {
      _id: user._id,
      username: user.nickname,
      email: user.email,
    },
    process.env.REFRESH_TOKEN,
    {
      expiresIn: '24h',
      algorithm: 'HS256',
      issuer: 'About Tech',
    }
  );

  user.access_token = token1;
  user.refresh_token = token2;
  user.save((err, user) => {
    console.log('젠토큰 후 저장');
    if (err) return cb(err);
    cb(null, user);
  });
};

userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  //token decode==token에 어떤것을 넣었는지에 따라 decoded에서 뽑아내야함

  ////일단 acc_token으로 확인해봄

  jwt.verify(token.acc_token, process.env.ACCESS_TOKEN, (err, data) => {
    if (data) {
      user.findOne(
        { _id: data._id, access_token: token.acc_token },
        (error, user) => {
          if (err) {
            return cb(err);
          }
          return cb(null, user);
        }
      );
    } else {
      if (err.message === 'jwt expired') {
        console.log('jwt expireddddddddd');
        jwt.verify(token.ref_token, process.env.REFRESH_TOKEN, (err, data) => {
          if (data) {
            user.findOne(
              { _id: data._id, refresh_token: token.ref_token },
              (error, user) => {
                if (err) {
                  return cb(err);
                } else {
                  user.access_token = jwt.sign(
                    {
                      _id: user._id,
                      username: user.name,
                      email: user.email,
                    },
                    process.env.ACCESS_TOKEN,
                    {
                      expiresIn: '10m',
                      issuer: 'About Tech',
                    }
                  );
                  console.log('jwt expired and renew acctoken');
                  user.save((err, user) => {
                    if (err) return cb(err);
                    cb(null, user);
                  });
                }
              }
            );
          } else {
            console.log('refresh토큰 expired or 삭제, 재로그인 필요');
            return cb(err);
          }
        });
      } else {
        console.log('not expired==notlogin maybe');

        return cb(err);
      }
    }
  });
};
//a
const User = mongoose.model('User', userSchema);

module.exports = { User };
