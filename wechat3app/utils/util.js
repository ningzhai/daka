function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}


function getHumanTypeTime(time) {
  var timespan = new Date() - new Date(time).getTime();
  var days = parseInt(timespan / (24 * 60 * 60 * 1000));
  var hours = parseInt(timespan / (60 * 60 * 1000)) % 24;
  var min = parseInt(timespan / (60 * 1000)) % 60;
  if (days > 0) {
    return days + "天前";
  }
  if (hours > 0) {
    return hours + "小时前";
  }
  return (min == 0 ? "1" : min) + "分钟前";
}

function count(obj) {
  if (obj == null) { return 0; }
  var i = 0;
  for (var x in obj) {
    if (obj[x] == null) { continue; }
    i++;
  }
  return i;
}

function getAllKeys(obj) {
  var arr = [];
  for (var x in obj) {
    arr.push(x);
  }
  return arr;
}
//加法  
function floatAdd(arg1, arg2) {
  var r1, r2, m;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  return (arg1 * m + arg2 * m) / m;
}

//减法  
function floatSub(arg1, arg2) {
  var r1, r2, m, n;
  try { r1 = arg1.toString().split(".")[1].length } catch (e) { r1 = 0 }
  try { r2 = arg2.toString().split(".")[1].length } catch (e) { r2 = 0 }
  m = Math.pow(10, Math.max(r1, r2));
  //动态控制精度长度  
  n = (r1 >= r2) ? r1 : r2;
  return ((arg1 * m - arg2 * m) / m).toFixed(n);
}

//乘法  
function floatMul(arg1, arg2) {
  var m = 0, s1 = arg1.toString(), s2 = arg2.toString();
  try { m += s1.split(".")[1].length } catch (e) { }
  try { m += s2.split(".")[1].length } catch (e) { }
  return Number(s1.replace(".", "")) * Number(s2.replace(".", "")) / Math.pow(10, m);
}


//除法  
/*
function floatDiv(arg1, arg2) {
  var t1 = 0, t2 = 0, r1, r2;
  try { t1 = arg1.toString().split(".")[1].length } catch (e) { }
  try { t2 = arg2.toString().split(".")[1].length } catch (e) { }
  with (Math) {
    r1 = Number(arg1.toString().replace(".", ""));

    r2 = Number(arg2.toString().replace(".", ""));
    return (r1 / r2) * pow(10, t2 - t1);
  }
}  
*/
module.exports = {
  formatTime: formatTime,
  getHumanTypeTime: getHumanTypeTime,
  count: count,
  getAllKeys: getAllKeys,
  floatAdd: floatAdd,
  floatSub: floatSub,
  floatMul: floatMul
}
