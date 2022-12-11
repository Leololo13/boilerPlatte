const express = require('express');
const app = express();
const mongoose = require('mongoose');
const { User } = require('./model/User');
const bodyParser = require('body-parser');
require('dotenv').config();
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

//몽구스 접속.  mongoose.connect(url).then().catch(err)
mongoose
  .connect(process.env.DB_URL)
  .then(() => {
    console.log('mongodb connected');
  })
  .catch((err) => console.log(err));

///첫화면 만들기=================================================
app.get('/', (req, res) => {
  res.send('hello world');
});

///register function 만들기=====================================
app.post('/api/user/register', (req, res) => {
  let user = new User(req.body);
  user.save((err, data) => {
    if (err) return res.json({ success: false, message: err });
    return res.status(200).json({ success: true });
  });
});

app.post('/api/user/login', (req, res) => {
  //email 혹은 id를 비교해서 찾는다==============================
  User.findOne({ email: req.body.email }, (err, userInfo) => {
    if (!userInfo) {
      return res.json({ LoginSuccess: false, message: 'Email not Found' });
    }
    /////////email or ID가 있다면? 비밀번호가 맞는지 확인하기//methods로 만들어서 함수끌어와서 user.js에서 마무리해버리기
    userInfo.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ LoginSuccess: false, message: 'password is wrong' });
      else {
        userInfo.genToken((err, user) => {
          if (err) return res.status(400).json(err);
          //////token을 저장을해줘야함. 어디에? 쿠키든 세션이든 자기맘임
          res.cookie('accessToken', user.access_token, {
            secure: false,
            httpOnly: true,
          });
          res.cookie('refreshToken', user.refresh_token, {
            secure: false,
            httpOnly: true,
          });
          res.json({ LoginSuccess: true, message: 'login Success' });
        });
      }
    });

    //////jwt이용해서 토큰을 이용하기======================================
    ///gentoken에서 마지막user.save(user에서 나온게 여기 user로 나옴)
  });
});

///auth만들기
//
app.get('/api/user/auth', auth, (req, res) => {
  //token을 이미 비교해서 맞다라는 결과가 나온상태임 그리고
  res.cookie('accessToken', req.token, {
    secure: false,
    httpOnly: true,
  });

  res.status(200).json({
    _id: req.user._id,
    isAdmin: req.user.role === 0 ? true : false,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
    id: req.user.id,
  });
  ///auth에서 req.user랑 req.token을 받았음
});

/////로그아웃하기
app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { token: '' }, (err, user) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).send({
      success: true,
    });
  });
});

////서버생성. 몽고디비랑 서버를 연결
app.listen(process.env.PORT, () => {
  console.log(`listening on port ${process.env.PORT}!!`);
});

app.get('*', function (req, res) {
  res.status(404).json('Page not Found');
});
