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
const { OAuth2Client } = require('google-auth-library');
const { Commentnum, Postnum } = require('./model/Postnum');
const { Comment } = require('./model/Comment');
const { title } = require('process');

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
  User.findOne({ email: req.body.email }, (err, userData) => {
    if (!userData) {
      user.save((err, data) => {
        if (err) return res.json({ RegisterSuccess: false, err });
        return res.status(200).json({ RegisterSuccess: true });
      });
    } else {
      return res.json({
        RegisterSuccess: false,
        message: '이미 가입하신 이메일이 있습니다.',
      });
    }
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
////구글 로그인하기====================================googlegleglegleglgllgglgleeeeeee

const oAuth2Client = new OAuth2Client(
  process.env.CLIENT_ID,
  process.env.CLIENT_SECRET,
  'postmessage'
);
///사실 구글로그인은 auth랑 같다
app.post('/api/user/googlelogin', async (req, res) => {
  ///토큰을 받아서 acc,refresh저장해
  console.log(req.body, 'qwokqwoekqwoekoqwek');
  const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens

  //userinfo받아서 넣어줘 끝!

  console.log(tokens);

  res.cookie('accessToken', tokens.access_token).json({ tokens });
});

///구글 등록=====================================googlegleglegleglgllgglgleeeeeee
app.post('/api/user/googleregister', async (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  User.findOne({ email: req.body.email }, (err, userData) => {
    if (!userData) {
      user.save((err, data) => {
        if (err) return res.json({ RegisterSuccess: false, err });
        return res.status(200).json({ RegisterSuccess: true, data });
      });
    } else {
      return res.json({
        RegisterSuccess: false,
        message: '이미 가입하신 이메일이 있습니다.',
      });
    }
  });
  ///유져인포를 받음.
  //유저가 이미 가입했는지 확인
  // 유저 인포 저장.
  //그리고 로그인페이지로 보내주기.
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
      nickname: req.user.nickname,
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
///수정하기 edit
app.post('/api/post/:id/edit', auth, (req, res) => {
  let id = req.params.id;
  let data = req.body;
  console.log('edit하기');
  List.findOneAndUpdate(
    { postnum: id },
    { title: data.title, content: data.content },
    (err, data) => {
      if (err) return res.json(err);
      return res.json({ EditSuccess: true });
    }
  );
});

////comment달기
app.post('/api/post/comment', auth, (req, res) => {
  console.log(req.body);
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
  Comment.find({ postnum: id }, (err, data) => {
    if (err) return res.json(err);
    return res.json({ data });
  });
});
///////list 가져오기
app.get('/api/list', (req, res) => {
  console.log(req.query);
  const { page, limit, offset, category } = req.query;
  const Page = Number(page);
  const Limit = Number(limit);
  const Offset = Number(offset);
  if (!category) {
    List.find((err, data) => {
      if (err) return res.json(err);
      let humor = data
        .filter((cat) => cat.category === 'humor')
        .slice(-15)
        .map((data) => {
          return {
            title: data.title,
            postnum: data.postnum,
            category: data.category,
          };
        });
      let politic = data
        .filter((cat) => cat.category === 'politic')
        .slice(-15)
        .map((data) => {
          return {
            title: data.title,
            postnum: data.postnum,
            category: data.category,
          };
        });
      let healing = data
        .filter((cat) => cat.category === 'healing')
        .slice(-15)
        .map((data) => {
          return {
            title: data.title,
            postnum: data.postnum,
            category: data.category,
          };
        });

      return res.json([humor, politic, healing]);
    });
  } else if (category === 'all') {
    List.find((err, data) => {
      if (err) return res.json(err);

      let lists = data
        .reverse()
        .slice(Offset < 0 ? 0 : Offset, Offset + Limit)
        .map((data) => data);

      return res.json({ data: lists, total: data.length });
    });
  } else {
    List.find({ category: category }, (err, data) => {
      if (err) return res.json(err);
      let lists = data
        .reverse()
        .slice(Offset < 0 ? 0 : Offset, Offset + Limit)
        .map((data) => data);

      return res.json({ data: lists, total: data.length });
    });
  }
});
/////comment삭제하기
app.post('/api/comment/delete', (req, res) => {
  let id = req.body.id;

  ////////////////////// Role를 0으로 주고 관리자만 바꿀수있게하자
  Comment.findOneAndUpdate(
    { commentnum: id },
    { $set: { content: '삭제된댓글입니다', role: 0 } },
    (err, data) => {
      if (err) return res.json(err);
      return res.json(data);
    }
  );
});

////comment전부가져오기.. 댓글수를 달아야하니까
app.get('/api/comment', (req, res) => {
  Comment.find((err, data) => {
    if (err) return res.json(err);
    return res.json({ data });
  });
});

////post에 like하기 hate하기 가자아아아아
app.post('/api/post/like/:id', (req, res) => {
  let id = req.params.id;
  console.log(req.body, 'req.body');
  let userID = req.body.user?.id;
  let likeList = req.body.like;

  if (!req.body.user) {
    console.log('유저로그인안함');
    return res.json({
      likeSuccess: false,
      message: '로그인이 필요한 기능입니다',
    });
  }

  if (likeList.includes(userID)) {
    console.log('들어있따');
    List.findOneAndUpdate(
      { postnum: id },
      { $pull: { like: userID } },
      (err, data) => {
        if (err) return res.json(err);
        return res.json({ data: data.like });
      }
    );
  } else {
    console.log('안들어있다');
    List.findOneAndUpdate(
      { postnum: id },
      { $addToSet: { like: req.body.user.id } },
      (err, data) => {
        if (err) return res.json(err);
        return res.json({ data: data.like });
      }
    );
  }
});
/////hate하기
app.post('/api/post/hate/:id', (req, res) => {
  let id = req.params.id;
  let userID = req.body.user?.id;
  let likeList = req.body.hate;

  if (!req.body.user) {
    console.log('유저로그인안함');
    return res.json({
      hateSuccess: false,
      message: '로그인이 필요한 기능입니다',
    });
  }

  if (likeList.includes(userID)) {
    console.log('들어있따');
    List.findOneAndUpdate(
      { postnum: id },
      { $pull: { hate: userID } },
      (err, data) => {
        if (err) return res.json(err);
        return res.json({ data: data.hate });
      }
    );
  } else {
    console.log('안들어있다');
    List.findOneAndUpdate(
      { postnum: id },
      { $addToSet: { hate: req.body.user.id } },
      (err, data) => {
        if (err) return res.json(err);
        return res.json({ data: data.hate });
      }
    );
  }
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
