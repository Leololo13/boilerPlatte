export function levelSystem(exp) {
  let needExp = 0;
  let lv = 0;
  for (let i = 0; i < 99; i++) {
    needExp += 10 * (2 * i);
    if (needExp >= exp) {
      lv = i;
      exp = exp - needExp + 10 * (2 * i);
      needExp = 10 * (2 * i);
      break;
    }
  }
  return { lv: lv, exp: exp, needExp: needExp };
}
