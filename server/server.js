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
const { isReadable } = require('stream');
const axios = require('axios');
const qs = require('qs');
const session = require('express-session');
const { limiter_normal, limiter_write } = require('./middleware/Limiter');
const { text } = require('body-parser');

///세션생성시 옵션설정 세션을설정할때 쿠키가 생성된다. 어느 라우터든 req session값이 존재하게 된다.
app.use(
  session({
    secret: 'ddosun',
    resave: true,
    secure: false,
    saveUninitialized: false,
  })
);
// app.use('/api/', limiter_normal);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
//////스새틱페이지 사용ㅇ해서 multer저장하기 그냥 연습용
app.use(express.static(path.join(__dirname + '/public')));

///mongoose connect=================================mongooooooooo============
mongoose
  .connect(process.env.DB_URL)
  .then(() => console.log('mongodb connected'))
  .catch((err) => console.log(err));

///user-action============user-action==============================
///user-action============user-action==============================
///////register
app.post('/api/user/checkID', (req, res) => {
  User.findOne({ nickname: req.body.id }, (err, data) => {
    console.log(data);
    if (!data) {
      res.status(200).json({ CheckID: true }); //가입해도된다 중복닉네임없음
    } else {
      res.status(200).json({ CheckID: false });
    }
  });
});
app.post('/api/user/register', (req, res) => {
  console.log(req.body);
  const user = new User(req.body);
  console.log(user);
  User.findOne({ email: req.body.email }, (err, userData) => {
    if (!userData) {
      user.save((err, data) => {
        console.log(data, err.code);
        if (err) return res.json({ RegisterSuccess: false, message: '가입 중 오류가 발생했습니다' });
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
///테스트
//
// app.post('/api/user/checkID', (req, res) => {
//   let { id } = req.body;

//   !id
//     ? res.json({ IDCheck: false, message: '닉네임을 입력하십시오' })
//     : User.findOne({ nickname: id }, (err, data) => {
//         if (err) return res.json({ IDCheck: false, err });
//         if (!data) {
//           return res.json({ IDCheck: true });
//         } else {
//           return res.json({
//             IDCheck: false,
//             message: '중복된 닉네임이있습니다',
//           });
//         }
//       });
// });
//유저 정보 변경하기
app.post('/api/user/infochange', (req, res) => {
  User.findOne({ nickname: req.body.nickname }, (err, data) => {
    if (data) {
      return res.json({
        infoChangeSuccess: false,
        message: '중복되는 닉네임이 이미 있습니다',
      });
    }
    if (err) return res.json({ infoChangeSuccess: false, err });
    User.findOneAndUpdate({ email: req.body.email }, { nickname: req.body.nickname }, (err, data) => {
      if (err) return res.json({ infoChangeSuccess: false, err });
      return res.json({ infoChangeSuccess: true, data });
    });
  });
});

////login=====================
app.post('/api/user/login', (req, res) => {
  console.log(req.body);
  User.findOneAndUpdate({ email: req.body.email }, { date: req.body.date }, (err, userData) => {
    /////db에 이메일이 있는지?

    if (!userData) return res.json({ LoginSuccess: false, message: '이메일이 없습니다' });
    ///db에 이메일이 있으면 비번비교해서 통과시키키
    userData.comparePassword(req.body.password, (err, isMatch) => {
      if (!isMatch)
        return res.json({
          LoginSuccess: false,
          message: 'password is wrong',
        });
      userData.genToken((err, userData) => {
        if (err) return res.status(400).send(err);

        res
          .cookie('accessToken', userData.access_token, {
            httpOnly: true,
            secure: true,
          })
          .cookie('refreshToken', userData.refresh_token, {
            httpOnly: true,
            secure: true,
          })
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

const oAuth2Client = new OAuth2Client(process.env.CLIENT_ID, process.env.CLIENT_SECRET, 'postmessage');
///////////////////////////////////////구글가입?
async function verifyGoogleToken(token) {
  try {
    const ticket = await oAuth2Client.verifyIdToken({
      idToken: token,
    });
    return { payload: ticket.getPayload() };
  } catch (error) {
    return { error: 'invalid user detected. pleas Try Again' };
  }
}
////
app.post('/api/user/googlesignup', async (req, res) => {
  console.log(req.body, '??????????????????????????????????????????');
  try {
    console.log({ verified: verifyGoogleToken(req.body.credential) });
    if (req.body.credential) {
      const verifyRes = await verifyGoogleToken(req.body.credential);
      if (verifyRes.error) {
        return res.status(400).json({
          message: verifyRes.error,
        });
      }
      const profile = verifyRes?.payload;

      console.log(profile, 'google profile');
      ///프로파일 겟함.. 이걸로 가입하자
      const user = new User(profile);
      User.findOne({ email: profile.email }, (err, data) => {
        console.log('오긴한겁니까');
        if (err) return res.json({ RegisterSuccess: false, message: err });
        if (!data) {
          user.save((error, data) => {
            if (error) return res.json({ RegisterSuccess: false, error });
            return res.status(200).json({ RegisterSuccess: true, data });
          });
        } else {
          return res.json({
            RegisterSuccess: false,
            message: '이미 가입하신 이메일이 있습니다',
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred. Registration failed.',
    });
  }
});
///구글로긴
app.post('/api/user/googlesignin', async (req, res) => {
  const date = new Date();
  try {
    console.log({ verified: verifyGoogleToken(req.body.credential) });
    if (req.body.credential) {
      const verifyRes = await verifyGoogleToken(req.body.credential);
      if (verifyRes.error) {
        return res.status(400).json({
          message: verifyRes.error,
        });
      }
      const profile = verifyRes?.payload;

      console.log(profile, 'google profile');
      ///프로파일 겟함.. 이걸로 로그인

      User.findOneAndUpdate({ email: profile.email }, { date: date }, (err, data) => {
        console.log('오긴한겁니까, 로그인');
        if (err) return res.json({ LoginSuccess: false, message: err });
        if (!data) {
          return res.json({
            LoginSuccess: false,
            message: '가입하신 메일이 없습니다. 가입하시겠습니까?',
          });
        } else {
          data.genToken((err, userData) => {
            if (err) return res.status(400).send(err);

            res
              .cookie('accessToken', userData.access_token, {
                httpOnly: true,
                secure: true,
              })
              .cookie('refreshToken', userData.refresh_token, {
                httpOnly: true,
                secure: true,
              })
              .status(200)
              .json({
                message: '로그인 성공',
                LoginSuccess: true,
                userID: userData.id,
                email: userData.email,
              });
          });
        }
      });
    }
  } catch (error) {
    res.status(500).json({
      message: 'An error occurred. login failed.',
    });
  }
});

///카카오관련사항

////카카오로그인 및 가입기능
app.get('/api/user/kakao/:cond', async (req, res) => {
  let code = req.query.code;
  let { cond } = req.params;
  console.log(cond, 'owewwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwwww');
  let payload = qs.stringify({
    grant_type: 'authorization_code',
    client_id: process.env.REST_API_KEY,
    redirect_uri: process.env.REDIRECT_URI + cond,
    code: code,
    client_secret: process.env.CLIENT_SECRET,
  });
  console.log(payload);
  console.log('카카오로그인카로그인카카오로그인카카오로그인카카오로그인카카오로그인');
  try {
    await axios.post(`https://kauth.kakao.com/oauth/token`, payload).then((result) => {
      console.log(result.data);
      if (result.data.access_token) {
        try {
          axios
            .get('https://kapi.kakao.com/v2/user/me', {
              headers: {
                Authorization: `Bearer ${result.data.access_token}`,
              },
            })
            .then(
              (data) => {
                ///////////////////////////여기서부터 가입시작.
                console.log(data.data);
                let userInfo = {
                  id: data.data.id,
                  nickname: data.data.properties.nickname,
                  image: data.data.properties.image,
                  email: data.data.properties.email,
                };
                let user = new User(userInfo);
                User.findOne({ id: userInfo.id }, (err, docs) => {
                  if (err) return res.json(err);
                  if (docs) {
                    return res.json({
                      RegisterSuccess: false,
                      message: '이미 가입하신 ID가 있습니다',
                    });
                  } else {
                    user.save((error, data) => {
                      if (error) return res.json({ RegisterSuccess: false, error });
                      return res.status(200).json({ RegisterSuccess: true, data });
                    });
                  }
                });
              }

              // res.json({ message: '카카오로그인성공', data: data.data })
            );
        } catch (error) {
          console.log(error);
          res.json({ message: '카카오 로그인에 실패했습니다' });
        }
      } else {
        res.json({ message: '토큰을 발급받지 못했습니다' });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ message: err });
  }
});

// ///사실 구글로그인은 auth랑 같다
// app.post('/api/user/googlelogin', async (req, res) => {
//   ///토큰을 받아서 acc,refresh저장해
//   console.log(req.body, 'qwokqwoekqwoekoqwek');
//   const { tokens } = await oAuth2Client.getToken(req.body.code); // exchange code for tokens
//   // const ticket = await oAuth2Client.verifyIdToken({
//   //   idToken: string;
//   // })
//   //userinfo받아서 넣어줘 끝!

//   console.log(tokens, 'hhhgggggggggggggggggggtoken');

//   res
//     .cookie('accessToken', tokens.access_token, {
//       httpOnly: true,
//       secure: true,
//     })
//     .json({ tokens });
// });

// ///구글 등록=====================================googlegleglegleglgllgglgleeeeeee
// app.post('/api/user/googleregister', async (req, res) => {
//   console.log(req.body, '배다뱆다배다뱆답재다뱆답ㅈ대바뱆다뱆다');
//   const user = new User(req.body);
//   User.findOne({ email: req.body.email }, (err, userData) => {
//     if (!userData) {
//       user.save((err, data) => {
//         if (err) return res.json({ RegisterSuccess: false, err });
//         return res.status(200).json({ RegisterSuccess: true, data });
//       });
//     } else {
//       return res.json({
//         RegisterSuccess: false,
//         message: '이미 가입하신 이메일이 있습니다.',
//       });
//     }
//   });
//   ///유져인포를 받음.
//   //유저가 이미 가입했는지 확인
//   // 유저 인포 저장.
//   //그리고 로그인페이지로 보내주기.
// });

///인증하기
app.get('/api/user/auth', auth, (req, res) => {
  res
    .status(200)
    .cookie('accessToken', req.user.access_token, {
      httpOnly: true,
      secure: true,
    })
    .json({
      id: req.user.id,
      ///role=0이면 관리자, 아니면 일반
      isAdmin: req.user.role == 0 ? true : false,
      isAuth: true,
      email: req.user.email,
      name: req.user.name,
      lastname: req.user.lastname,
      image: req.user.image,
      _id: req.user._id,
      nickname: req.user.nickname,
    });
});
///유저정보 변경하기
app.post('/api/user/modify/Userinfo', auth, (req, res) => {
  const modifiedInfo = req.body;

  const { isAdmin, isAuth, _id, email, ...others } = modifiedInfo;
  console.log(others);
  console.log(req.user._id);

  User.findOneAndUpdate({ _id: req.user._id }, others, (err, data) => {
    console.log(data);
    if (err) return res.json(err);
    return res.json(data);
  });
});

///로그아웃하기
app.get('/api/user/logout', auth, (req, res) => {
  User.findOneAndUpdate({ _id: req.user._id }, { access_token: '' }, (err, user) => {
    console.log('logout');
    if (err) return res.json({ success: false, err });
    res.cookie('accessToken', '').status(200).send({ success: true });
  });
});

///////////////////////write,edit,delete==============================
///////////////////////write==============================

app.post('/api/list/write', auth, (req, res) => {
  Postnum.findOneAndUpdate({ name: 'totalpost' }, { $inc: { totalpost: 1 } }).then((data) => {
    req.body.postnum = data.totalpost + 1;

    const list = new List(req.body);
    list.save((err, data) => {
      console.log(data);
      console.log(data?._id, req.user._id, '세이브전에정보확인');
      if (err) return res.json({ Writesuccess: false, err });
      User.findByIdAndUpdate(req.user._id, { $addToSet: { posts: data._id } }, (err, data) => {
        if (err) {
          console.log(err);
        } else {
          console.log(data, '유저정보에 posts_Id입력함');
        }
      });
      return res.status(200).json({ Writesuccess: true, postnum: req.body.postnum });
    });
  });
});
////delete=============
app.post('/api/post/delete/:id', auth, (req, res) => {
  let id = req.params.id;
  console.log('딜리트욧청들어옴');
  List.findOneAndDelete({ postnum: id, writer: req.user._id }, (err, docs) => {
    if (!docs) {
      return res.json({
        DeleteSuccess: false,
        message: '작성자 본인이 아니거나 요청하신 게시글이 없습니다.',
      });
    }
    if (err) return res.json(err);
    return res.json({ DeleteSuccess: true });
  });
});
///수정하기 edit
app.post('/api/post/:id/edit', auth, (req, res) => {
  let id = req.params.id;
  let data = req.body;
  console.log(id, data);
  console.log('edit하기');
  List.findOneAndUpdate({ postnum: id, writer: req.user._id }, data, (err, data) => {
    if (!data) {
      return res.json({
        DeleteSuccess: false,
        message: '작성자 본인이 아니거나 요청하신 게시글이 없습니다.',
      });
    }
    if (err) return res.json(err);
    return res.json({ EditSuccess: true });
  });
});

////comment달기======================comment===============================
////comment달기======================comment===============================
app.post('/api/post/comment', auth, (req, res) => {
  console.log(req.body);
  Commentnum.findOneAndUpdate({ name: 'totalcomment' }, { $inc: { totalcomment: 1 } }).then((data) => {
    req.body.commentnum = data.totalcomment + 1;
    const comment = new Comment(req.body);
    comment.save((err, data) => {
      if (err) return res.json({ CommentSuccess: false, err });
      User.findByIdAndUpdate(req.user._id, { $addToSet: { comments: data._id } }, (err, data) => {
        if (err) throw err;
      });
      return res.status(200).json({ CommentSuccess: true, data });
    });
  });
});
//comment수정하기
app.post('/api/post/comment/:id/edit', auth, (req, res) => {
  let id = req.params.id;
  let data = req.body.content;
  console.log(data, 'reqbodddddddddddddddd');
  Comment.findOneAndUpdate({ commentnum: parseInt(id) }, { content: data }, (err, data) => {
    if (err) res.json({ commentEditSuccess: false, err });
    res.json({ commentEditSuccess: true, data: data });
  });
});
///comment가져오기 postnum으로 가져옴 모든 comment
app.get('/api/post/:id/comment', (req, res) => {
  let id = req.params.id;
  Comment.find({ postnum: id }, (err, data) => {
    let sortedData = [];

    data
      .filter((maincmt) => maincmt.parentcommentnum === 0)
      .map((maincmt) => {
        sortedData.push(maincmt);
        data
          .filter((r) => r.parentcommentnum === maincmt.commentnum)
          .map((rc) => {
            console.log(rc);
            sortedData.push(rc);
          });

        // console.log(maincmt, '메인코멘트');
        // console.log(rcmt, 'qwodkqwodkqowdkowqdk');
      });
    console.log(sortedData, 'sorted data');
    if (err) return res.json(err);
    return res.json({ sortedData });
  });
});
/////comment삭제하기
app.post('/api/comment/delete', auth, (req, res) => {
  let id = req.body.commentnum;
  console.log(req.body);
  console.log(id);
  Comment.find({ parentcommentnum: id }, (err, data) => {
    if (err) res.json(err);
    if (data.length === 0) {
      console.log('대댓글이 없으니 삭제하기');
      Comment.findOneAndDelete({ commentnum: id }, (err, docs) => {
        if (err) return res.json({ CommentdeleteSuccess: false, err });
        return res.json({ CommentdeleteSuccess: true });
      });
    } else {
      console.log('대댓글이 있으니 내용만');
      Comment.findOneAndUpdate({ commentnum: id }, { $set: { content: '삭제된댓글입니다', role: 0 } }, (err, data) => {
        if (err) return res.json({ CommentdeleteSuccess: false, err });
        return res.json({ CommentdeleteSuccess: true, data });
      });
    }
  });

  ////////////////////// Role를 0으로 주고 관리자만 바꿀수있게하자
});

///////list 가져오기=====================list===========================
///////////////공지사항 가져오기.. 어쩔수가 없다 가져와야함
app.get('/api/announce/:cat', (req, res) => {
  let cat = req.params.cat === 'all' ? 'humor' : req.params.cat;

  if (!cat) {
    res.json({ AnnounceCall: false });
  } else {
    List.find({ category: cat, announce: true }, (err, data) => {
      if (err) return res.json({ AnnounceCall: false, err });
      return res.json({ data });
    });
  }
});
///////list 가져오기=====================list===========================
app.get('/api/list', (req, res) => {
  console.log(req.query, 'oqwijdoiqwjdioqwj');

  let { page, limit, category, search, soption } = req.query;
  console.log(soption, typeof soption);
  soption = soption?.split(',');
  console.log(soption);
  const Page = Number(page);
  const topc = req.query.topc ?? 'all';
  const Limit = Number(limit);
  const Offset = (Page - 1) * Limit;
  const Category = search ? 'search' : category === 'search' ? 'all' : category;
  const cat = ['healing', 'humor', 'info', 'enter', 'lunch', 'AI', 'comic'];
  console.log(Category, topc, 'cateeeeeeeeeeeeee');
  const searchCondition =
    soption === ['comment']
      ? [
          {
            $search: {
              index: 'commentSearch',
              text: {
                query: search,
                path: 'content',
              },
            },
          },
        ]
      : [
          {
            $search: {
              index: 'titleSearch',
              text: {
                query: search,

                path: soption?.includes('all') ? { wildcard: '*' } : soption,
              },
            },
          },
          {
            $match: { topcategory: topc },
          },
        ];

  if (!Category) {
    //첫화면에서 랜딩할때 사용
    List.find({ announce: false }, (err, data) => {
      if (err) return res.json(err);
      let lists = cat.map((cats) => {
        return data
          .filter((cat) => cat.category === cats)
          .slice(-15)
          .map((data) => {
            return {
              title: data.title,
              postnum: data.postnum,
              category: data.category,
              _id: data._id,
            };
          });
        // console.log(abb);
      });
      // let humor = data
      //   .filter((cat) => cat.category === 'humor')
      //   .slice(-15)
      //   .map((data) => {
      //     return {
      //       title: data.title,
      //       postnum: data.postnum,
      //       category: data.category,
      //       _id: data._id,
      //     };
      //   });
      // let politic = data
      //   .filter((cat) => cat.category === 'politic')
      //   .slice(-15)
      //   .map((data) => {
      //     return {
      //       title: data.title,
      //       postnum: data.postnum,
      //       category: data.category,
      //       _id: data._id,
      //     };
      //   });
      // let healing = data
      //   .filter((cat) => cat.category === 'healing')
      //   .slice(-15)
      //   .map((data) => {
      //     return {
      //       title: data.title,
      //       postnum: data.postnum,
      //       category: data.category,
      //       _id: data._id,
      //     };
      //   });

      return res.json(lists);
    });
  } else if (Category === 'all') {
    //카테고리가 all일때
    List.find({ announce: false, topcategory: topc }, (err, data) => {
      if (err) return res.json(err);
      let lists = data
        .reverse()
        .slice(Offset < 0 ? 0 : Offset, Offset + Limit)
        .map((data) => data);

      return res.json({ data: lists, total: data.length });
    });
  } ////search 할때 카테고리를 설정해서 뽑아주기
  else if (Category === 'search') {
    console.log('??');
    // List.findOne({ postnum: id })
    //   .populate('writer', { nickname: 1, _id: 2 })
    //   .then((err, data) => {
    //     if (err) return res.json(err);
    //     return res.json({ data });
    //   });
    ///////////////댓글로 post를 찾을때
    if (soption === ['comment']) {
      console.log('코멘트검색', searchCondition);
      Comment.aggregate(searchCondition, (error, data) => {
        if (error) return res.json(error);
        let posts = data.map((d) => d.postnum);
        List.find({ postnum: { $in: posts } }, (err, list) => {
          console.log(posts);
          if (err) return res.json(err);
          let lists = list
            .reverse()
            .slice(Offset < 0 ? 0 : Offset, Offset + Limit)
            .map((data) => data);
          res.json({ data: lists, total: data.length });
        });
      });
    } else {
      List.aggregate(searchCondition, (err, data) => {
        console.log('list검샏', searchCondition[0].$search.text.path);
        if (err) return res.json(err);
        let lists = data
          .reverse()
          .slice(Offset < 0 ? 0 : Offset, Offset + Limit)
          .map((data) => data);
        res.json({ data: lists, total: data.length });
      });
    }
  } else {
    //각자의 카테고리로 갓을떄
    List.find({ category: category, announce: false, topcategory: topc }, (err, data) => {
      if (err) return res.json(err);
      let lists = data
        .reverse()
        .slice(Offset < 0 ? 0 : Offset, Offset + Limit)
        .map((data) => data);

      return res.json({ data: lists, total: data.length });
    });
  }
});

////list에서 보여줄 댓글수를 위해 comment전부가져오기.. 댓글수를 달아야하니까
app.get('/api/comment', (req, res) => {
  Comment.find((err, data) => {
    if (err) return res.json(err);
    return res.json({ data });
  });
});

///////////post 불러오기 개별항목 불러오기===================post관련======
///////////post 불러오기 개별항목 불러오기===================post관련======
app.get('/api/list/post/:id', (req, res) => {
  let id = req.params.id;

  List.findOne({ postnum: id })
    .populate('writer', { nickname: 1, _id: 2 })
    .then((err, data) => {
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
    List.findOneAndUpdate({ postnum: id }, { $pull: { like: userID } }, (err, data) => {
      if (err) return res.json(err);
      return res.json({ data: data.like });
    });
  } else {
    console.log('안들어있다');
    List.findOneAndUpdate({ postnum: id }, { $addToSet: { like: req.body.user.id } }, (err, data) => {
      if (err) return res.json(err);
      return res.json({ data: data.like });
    });
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
    List.findOneAndUpdate({ postnum: id }, { $pull: { hate: userID } }, (err, data) => {
      if (err) return res.json(err);
      return res.json({ data: data.hate });
    });
  } else {
    console.log('안들어있다');
    List.findOneAndUpdate({ postnum: id }, { $addToSet: { hate: req.body.user.id } }, (err, data) => {
      if (err) return res.json(err);
      return res.json({ data: data.hate });
    });
  }
});

////mypage===========================================ㅡmypage=========
////mypage===========================================ㅡmypage=========
app.get('/api/user/mypage', auth, (req, res) => {
  let id = req.user._id;

  User.findById(id)
    .populate('posts', {
      title: 1,
      postnum: 2,
      date: 3,
      like: 4,
      hate: 5,
      category: 6,
    })
    .populate('comments')
    .then((err, data) => {
      if (err) return res.json(err);
      return res.json({ data });
    });

  // List.findOne({ postnum: 123 })
  //   .populate('writer', { nickname: 1, _id: 2 })
  //   .then((err, data) => {
  //     console.log('123');
  //     if (err) return res.json(err);
  //     console.log(data);
  //     return res.json({ data });
  //   });
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
      if ((ext !== '.png' && ext !== '.jpg' && ext !== '.jpeg', ext !== '.mp4', ext !== '.webp', ext !== '.gif')) {
        return callback(new Error('정해진 형식만 업로드 하세요.'));
      }
      cb(null, true);
    },
  }),
  // limits: { fileSize: 5 * 1024 * 1024 } // 파일 크기 제한
});

///img업로드 api만들기
app.post('/api/list/write/upload_img', upload.array('img', 10), (req, res) => {
  console.log('전달받은파일', req.files);
  // console.log('save filename', req.file.filename);
  // console.log('save filename', req.file.mimetype);

  const IMG_URL_FOLDER = req.files.map((file) => {
    let img_url = 'http://localhost:8080/uploads/' + file.filename;
    return img_url;
  });
  res.json({ url: IMG_URL_FOLDER, files: req.files });
});

app.post('/api/list/write/upload_video', upload.single('video'), (req, res) => {
  console.log('전달받은파일', req.file);
  console.log('save filename', req.file.filename);

  const VIDEO_URL = `http://localhost:8080/uploads/${req.file.filename}`;
  console.log(VIDEO_URL);
  res.json({ url: VIDEO_URL });
});

//db서버 접속
app.listen(process.env.PORT, () => {
  console.log(`connected to port ${process.env.PORT}`);
});
