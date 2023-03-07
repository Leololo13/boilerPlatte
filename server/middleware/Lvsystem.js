const { User } = require('../model/User');

const lvSystem = function (req, res, next) {};

module.exports = { Lvsystem };
function levelSystem(exp, lv) {
  let needExp = 0;
  for (let i = lv; i < 99; i++) {
    needExp += 10 * (2 * i);
    if (needExp >= exp) {
      lv = i;
      exp = exp - needExp + 10 * (2 * i);
      needExp = 10 * (2 * i);
      break;
    }
  }
  return [lv, exp, needExp];
}
