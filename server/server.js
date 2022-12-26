const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { urlencoded } = require('express');
require('dotenv').config();
const { User } = require('./model/User');
const cookieParser = require('cookie-parser');
const { auth } = require('./middleware/auth');
const { List } = require('./model/List');
const multer = require('multer');
const path = require('path');
const { Postnum, Commentnum } = require('./model/Postnum');
const { Comment } = require('./model/Comment');

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
//////스새틱페이지 사용ㅇ해서 multer저장하기 그냥 연습용
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
    if (err) return res.json({ RegisterSuccess: false, err });
    return res.status(200).json({ RegisterSuccess: true });
  });
});

////login=====================
app.post('/api/user/login', (req, res) => {
  User.findOne({ email: req.body.email }, (err, userData) => {
    /////db에 이메일이 있는지?
    let { password, ...others } = userData;
    if (!userData)
      return res.json({ LoginSuccess: false, message: 'no email' });
    ///db에 이메일이 있으면 비번비교해서 통과시키키
    userData.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({ LoginSuccess: false, message: 'password is wrong' });
      userData.genToken((err, userData) => {
        if (err) return res.status(400).send(err);
        res
          .cookie('accessToken', userData.access_token)
          .cookie('refreshToken', userData.refresh_token)
          .status(200)
          .json({
            LoginSuccess: true,
            userID: userData.id,
            email: userData.email,
          });
      });
    });
    ///그리고 token만들어서 주기
  });
});
///인증하기
app.get('/api/user/auth', auth, (req, res) => {
  res
    .status(200)
    .cookie('accessToken', req.user.access_token)
    .json({
      id: req.user.id,
      isAdmin: req.user.role == 0 ? false : true,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      role: req.user.role,
      image: req.user.image,
      _id: req.user._id,
    });
});

///로그아웃하기
app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate(
    { id: req.user.id },
    { access_token: '' },
    (err, user) => {
      console.log('logout');
      if (err) return res.json({ success: false, err });
      res.cookie('accessToken', '').status(200).send({ success: true });
    }
  );
});
///////////////////////write==============================

app.post('/api/list/write', auth, (req, res) => {
  Postnum.findOneAndUpdate(
    { name: 'totalpost' },
    { $inc: { totalpost: 1 } }
  ).then((data) => {
    req.body.postnum = data.totalpost + 1;
    const list = new List(req.body);
    list.save((err, data) => {
      if (err) return res.json({ Writesuccess: false, err });
      return res.status(200).json({ Writesuccess: true });
    });
  });
});
////delete=============
app.post('/api/post/delete/:id', auth, (req, res) => {
  let id = req.params.id;
  console.log('딜리트욧청들어옴');
  List.findOneAndDelete({ postnum: id }, (err, docs) => {
    if (err) return res.json(err);
    return res.json({ DeleteSuccess: true });
  });
});
////comment달기
app.post('/api/post/comment', auth, (req, res) => {
  Commentnum.findOneAndUpdate(
    { name: 'totalcomment' },
    { $inc: { totalcomment: 1 } }
  ).then((data) => {
    console.log(data);
    req.body.commentnum = data.totalcomment + 1;
    const comment = new Comment(req.body);
    comment.save((err, data) => {
      if (err) return res.json({ CommentSuccess: false, err });
      return res.status(200).json({ CommentSuccess: true, data });
    });
  });
});
///comment가져오기 postnum으로 가져옴 모든 comment
app.get('/api/post/:id/comment', (req, res) => {
  let id = req.params.id;
  Comment.find(
    { postnum: id },

    (err, data) => {
      if (err) return res.json(err);
      return res.json({ data });
    }
  );
});
///////list 가져오기
app.get('/api/list', (req, res) => {
  List.find((err, data) => {
    if (err) return res.json(err);
    return res.json({ data });
  });
});

///////////list 개별항목 불러오기

app.get('/api/list/post/:id', (req, res) => {
  let id = req.params.id;
  List.findOne({ postnum: id })
    .populate('writer', { nickname: 1, _id: 2 })
    .then((err, data) => {
      if (err) return res.json(err);
      return res.json({ data });
    });
});
////mypage
app.get('/api/user/mypage', auth, (req, res) => {
  let id = req.user._id;
  User.findById(id)
    .populate('posts')
    .then((err, data) => {
      if (err) return res.json(err);
      return res.json({ data });
    });
});

/// =-===========reactquill 사용을 위한 multer설정 및 img 업로드
///multer설정하기
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
    filefilter(req, file, cb) {
      let ext = path.extname(file.originalname);
      if (
        (ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg',
        ext !== '.mp4',
        ext !== '.gif')
      ) {
        return callback(new Error('정해진 형식만 업로드 하세요.'));
      }
      cb(null, true);
    },
  }),
  // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

///img업로드 api만들기
app.post('/api/list/write/upload_img', upload.single('img'), (req, res) => {
  console.log('전달받은파일', req.file);
  console.log('save filename', req.file.filename);

  const IMG_URL = `http://localhost:8080/uploads/${req.file.filename}`;
  console.log(IMG_URL);
  res.json({ url: IMG_URL });
});

//db서버 접속
app.listen(process.env.PORT, () => {
  console.log(`connected to port ${process.env.PORT}`);
});
