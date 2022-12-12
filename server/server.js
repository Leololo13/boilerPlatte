const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { urlencoded } = require('express');
require('dotenv').config();
let { User } = require('./model/User');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');
const { List } = require('./model/List');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());

///첫페이지
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/write.html');
});

///mongoose connect
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('mongodb connected'))
  .catch((err) => console.log(err));

///////register

app.post('/api/user/register', (req, res) => {
  const user = new User(req.body);
  user.save((err, data) => {
    if (err) return res.json({ success: false, err });
    return res.status(200).json({ success: true });
  });
});

////login=====================
app.post('/api/user/login', (req, res) => {
  console.log('logiin try');
  User.findOne({ email: req.body.email }, (err, userData) => {
    /////db에 이메일이 있는지?
    if (!userData)
      return res.json({ loginSuccess: false, message: 'no email' });
    ///db에 이메일이 있으면 비번비교해서 통과시키키
    userData.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ loginSuccess: false, message: 'password is wrong' });
      userData.genToken((err, userData) => {
        if (err) return res.status(400).send(err);
        res
          .cookie('accessToken', userData.access_token)
          .cookie('refreshToken', userData.access_token)
          .status(200)
          .json({ loginSuccess: true, userID: userData.id });
      });
    });
    ///그리고 token만들어서 주기
  });
});
///인증하기
app.get('/api/user/auth', auth, (req, res) => {
  res.status(200).json({
    id: req.user.id,
    isAdmin: req.user.role == 0 ? false : true,
    isAuth: true,
    email: req.user.email,
    name: req.user.name,
    lastname: req.user.lastname,
    role: req.user.role,
    image: req.user.image,
  });
});

///로그아웃하기
app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { id: req.user.id },
    { access_token: '' },
    (err, user) => {
      if (err) return res.json({ success: false, err });
      return res.status(200).send({ success: true });
    }
  );
});
///////////////////////write==============================

app.post('/api/list/write', auth, (req, res) => {
  const list = new List(req.body);
  list.save((err, data) => {
    if (err) return res.json({ Writesuccess: false, err });
    return res.status(200).json({ Writesuccess: true });
  });
});
app.get('/api/list', (req, res) => {
  List.find((err, data) => {
    if (err) return res.json(err);
    return res.json({ data });
  });
});

//db서버 접속
app.listen(process.env.PORT, () => {
  console.log(`connected to port ${process.env.PORT}`);
});
