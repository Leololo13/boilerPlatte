const { User } = require('../model/User');

let auth = function (req, res, next) {
  let token = req.cookies.accessToken;

  User.findByToken(token, function (err, user) {
    if (err) return res.json(err);
    if (!user) return res.json({ isAuth: false, error: true });
    ///findbytoken에서 _id랑token으로 db에서 정보를 찾아서 userdata를 가져온것임
    req.access_token = token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
