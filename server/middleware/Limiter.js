const limit = require('express-rate-limit');

exports.limiter_normal = limit({
  windowMs: 60 * 1000, //60*1000ms = 1분
  max: 1000,
  delayMs: 1000,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message:
        'Too many requests maid from this IP, please try again after an hour',
    });
  },
});

exports.limiter_write = limit({
  windowMs: 60 * 1000, //60*1000ms = 1분
  max: 10,
  delayMs: 1000,
  handler(req, res) {
    res.status(this.statusCode).json({
      code: this.statusCode,
      message:
        'Too many requests maid from this IP, please try again after an hour',
    });
  },
});
