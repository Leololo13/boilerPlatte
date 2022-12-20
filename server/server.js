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
const multer = require('multer');
const path = require('path');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(express.static(path.join(__dirname + '/public')));

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
          .json({ loginSuccess: true, userID: userData.id, _id: userData._id });
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
    // console.log(data[17]);
    if (err) return res.json(err);
    return res.json({ data });
  });
});

app.get('/api/list/post/:id', (req, res) => {
  let id = req.params.id;
  List.findById(id)
    .populate('writer', { id: 1 })
    .then((err, data) => {
      if (err) return res.json(err);
      return res.json({ data });
    });
});

/////이미지 업로드, multer,quill이용하기
///multer설정하기
// multer 설정
const upload = multer({
  storage: multer.diskStorage({
    // 저장할 장소
    destination(req, file, cb) {
      cb(null, 'public/uploads');
    },
    // 저장할 이미지의 파일명
    filename(req, file, cb) {
      const ext = path.extname(file.originalname); // 파일의 확장자
      console.log('file.originalname', file.originalname);
      // 파일명이 절대 겹치지 않도록 해줘야한다.
      // 파일이름 + 현재시간밀리초 + 파일확장자명
      cb(null, path.basename(file.originalname, ext) + Date.now() + ext);
    },
  }),
  /// limits: { fileSize: 5 * 1024 * 1024 }, // 파일 크기 제한
});
// 하나의 이미지 파일만 가져온다.
app.post('/api/list/upload_img', upload.single('img'), (req, res) => {
  // 해당 라우터가 정상적으로 작동하면 public/uploads에 이미지가 업로드된다.
  // 업로드된 이미지의 URL 경로를 프론트엔드로 반환한다.
  console.log('전달받은 파일', req.file);
  console.log('저장된 파일의 이름', req.file.filename);

  // 파일이 저장된 경로를 클라이언트에게 반환해준다.
  const IMG_URL = `http://localhost:8080/uploads/${req.file.filename}`;
  console.log(IMG_URL);
  res.json({ url: IMG_URL });
});
//db서버 접속
app.listen(process.env.PORT, () => {
  console.log(`connected to port ${process.env.PORT}`);
});
