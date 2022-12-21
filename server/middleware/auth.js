const { User } = require('../model/User');

let auth = function (req, res, next) {
  const acc_token = req.cookies.accessToken;
  const ref_token = req.cookies.refreshToken;
  const token = { acc_token, ref_token };
  User.findByToken(token, function (err, user) {
    if (err) throw err;
    if (!user) return res.json({ isAuth: false, error: true });
    ///findbytoken에서 _id랑token으로 db에서 정보를 찾아서 userdata를 가져온것임
    req.access_token = user.access_token;
    req.user = user;
    next();
  });
};

module.exports = { auth };
