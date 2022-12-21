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
    minlength: 5,
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
    unique: 1,
    trim: 1,
  },
  lastname: {
    type: String,
    maxlength: 50,
    unique: 1,
    trim: 1,
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
    default: 1,
  },
  image: {
    type: String,
  },
  posts: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'List',
  },
});

userSchema.pre('save', function (next) {
  let user = this;
  if (user.isModified('password')) {
    bcrypt.genSalt(saltRounds, (err, salt) => {
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

userSchema.methods.comparePassword = function (plainPassword, cb) {
  bcrypt.compare(plainPassword, this.password, (err, isMatch) => {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

userSchema.methods.genToken = function (cb) {
  let user = this;
  let token1 = jwt.sign(
    {
      id: user.id,
      username: user.name,
      email: user.email,
    },
    process.env.ACCESS_TOKEN,
    {
      expiresIn: '10m',
      issuer: 'About Tech',
    }
  );
  let token2 = jwt.sign(
    {
      id: user.id,
      username: user.name,
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

userSchema.statics.findByToken = function (token, cb) {
  let user = this;
  //token decode==token에 어떤것을 넣었는지에 따라 decoded에서 뽑아내야함

  ////일단 acc_token으로 확인해봄
  jwt.verify(token.acc_token, process.env.ACCESS_TOKEN, (err, data) => {
    if (data) {
      user.findOne(
        { id: data.id, access_token: token.acc_token },
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
              { id: data.id, refresh_token: token.ref_token },
              (error, user) => {
                if (err) {
                  return cb(err);
                } else {
                  user.access_token = jwt.sign(
                    {
                      id: user.id,
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
        console.log('중복');
        return cb(err);
      }
    }
  });
};

const User = mongoose.model('User', userSchema);

module.exports = { User };
