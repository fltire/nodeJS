/*! 
* gaozh v1
*/
/**
   @name /util/date
   @class
   @category javascript
   @description 常用的日期操作
 */

/**
   @name /util/date.isLeapYear
   @function  
   @description 判断日期是否是闰年
   @param {Date} date 日期
   @returns {Boolean} 如果是闰年返回true，否则返回false
 */

/**
   @name /util/date.fromString
   @function 
   @description 按照给定的日期格式，把字符串转换成日期对象
   @param {String}  str 字符串
   @param {String} format 日期格式
   @returns {Date} 返回日期
 */

/**
	@name /util/date.DEFAULT_FORMAT_SHOT
	@property
	@type string 
	@description <b>[filed]</b>时间格式常量  = "yyyy/MM/dd"
 */

/**
	@name /util/date.DEFAULT_FORMAT
	@property
	@type string 
	@description <b>[filed]</b>时间格式常量  = "yyyy/MM/dd hh:mm:ss"
 */

/**
	@name /util/date.STANDART_FORMAT_SHOT
	@property
	@type string 
	@description <b>[filed]</b>时间格式常量   = "yyyy-MM-dd"
 */

/**
	@name /util/date.STANDART_FORMAT
	@property
	@type string 
	@description <b>[filed]</b>时间格式常量  = "yyyy-MM-ddThh:mm:ss.fffZ"
 */

/**
   @name /util/date.toString
   @function
   @description 按照给定的日期格式，把日期对象转换成字符串
   @param {Date} dateTime  要处理的日期对象
   @param {String} formatStr  日期格式
   @returns {String} 返回字符串
 */

/**
   @name /util/date.increase
   @function
   @description 根据日期的规则，为给定的日期添加指定的时间量
   @param {Date} datetime  要处理的日期对象
   @param {Number} num  添加的时间量
   @param {String} interval  添加的时间单位，'s'代表秒，'n'代表分钟，'h'代表小时 ，'d'代表天， 'w'代表 周 ，'m'代表月，'q'代表季度，'y'代表年
   @returns {Date} 返回日期
 */

/**
   @name /util/date.decrease
   @function
   @description 根据日期的规则，为给定的日期减去指定的时间量
   @param {Date} datetime  要处理的日期对象
   @param {Number} num  减去的时间量
   @param {String} interval  减去的时间单位，'s'代表秒，'n'代表分钟，'h'代表小时 ，'d'代表天， 'w'代表 周 ，'m'代表月，'q'代表季度，'y'代表年
   @returns {Date} 返回日期
 */

/**
   @name /util/date.diff
   @function
   @description 计算两个日期的差
   @param {Date} start  起始日期
   @param {Date} end  结束日期
   @param {String} interval  时间单位，默认是以天为单位，'s'代表秒，'n'代表分钟，'h'代表小时 ，'d'代表天， 'w'代表 周 ，'m'代表月，'q'代表季度，'y'代表年
   @return {Number} 返回结果，如果起始日期小于结束日期返回正整数，否则返回负整数
 */

/**
   @name /util/date.between
   @function
   @description 计算两个日期相差几天，和diff很相似，返回永远是正整数
   @param {Date} start  起始日期
   @param {Date} end  结束日期
   @return {Number} 返回相差几天
 */

 /**
   @name /util/date.now
   @function
   @description 返回当前时间
   @return {Date} 返回当前时间
 */


var String = require("./string");

var _Date = {};
_Date._msForSecond = 1000;
_Date._msForMinute = 60000;
_Date._msForHour = 3600000;
_Date._msForDay = 86400000;// 24*60*60*1000
_Date._msForWeek = 86400000 * 7;

_Date.isLeapYear = function (date) {
  var y = date instanceof Date ? date.getFullYear() : date;
  return (0 === y % 4 && ((y % 100 !== 0) || (y % 400 === 0)));
};

var _full = function (str, ch, count, isLeft) {
  while (str.length < count)
    if (isLeft)
      str = ch + str;
    else
      str = str + ch;
  return str;
};

_Date.fromString = function (str, format) {
  if (str instanceof Date) return str;
  var pattern = format.replace(/(yyyy)/g, "([0-9]{4})").replace(/(yy)|(MM)|(dd)|(hh)|(mm)|(ss)/g, "([0-9]{2})").replace(/[Mdhms]/g, "([0-9]{1,2})")
    .replace(/(fff)/g, "([0-9]{1,3})");

  var getIndex = function (expr1, expr2) {
    var index = format.indexOf(expr1);
    if (index == -1)
      index = format.indexOf(expr2);
    return index;
  };

  var today = new Date();
  var returnDate;
  if (new RegExp(pattern).test(str)) {
    var yPos = getIndex("yyyy", "yy");
    var mPos = getIndex("MM", "M");
    var dPos = getIndex("dd", "d");
    var hPos = getIndex("hh", "h");
    var miPos = getIndex("mm", "m");
    var sPos = getIndex("ss", "s");
    var fPos = getIndex("fff");
    var data = {
      y: 0,
      m: 0,
      d: 0,
      h: 0,
      mi: 0,
      s: 0,
      f: 0
    };

    var pos = new Array(yPos + ",y", mPos + ",m", dPos + ",d", hPos + ",h", miPos + ",mi", sPos + ",s", fPos + ",f").sort(function (a, b) {
      a = parseInt(a.split(",")[0], 10);
      b = parseInt(b.split(",")[0], 10);
      return a == b ? 0 : (a > b ? 1 : -1);
    });

    var tmpIndex = 0;
    var newPos = [];
    for (var i = 0; i < pos.length; i++) {
      if (parseInt(pos[i].split(",")[0], 10) != -1) {
        newPos[tmpIndex] = pos[i];
        tmpIndex++;
      }
    }

    var m = str.match(pattern);
    for (i = 1; i < m.length; i++) {
      if (i === 0)
        return;
      var flag = newPos[i - 1].split(',')[1];
      data[flag] = m[i];
    }

    data.y = data.y || today.getFullYear();
    data.d = data.d || today.getDate();
    if (data.f !== 0)
      data.f = _full(data.f, "0", 3, false);

    if (data.y.toString().length == 2)
      data.y = parseInt("20" + data.y, 10);
    data.m -= 1;
    returnDate = new Date(data.y, data.m, data.d, data.h, data.mi, data.s, data.f);
  }

  return returnDate;
};

_Date.DEFAULT_FORMAT_SHOT = "yyyy/MM/dd";
_Date.DEFAULT_FORMAT = "yyyy/MM/dd hh:mm:ss";
_Date.STANDART_FORMAT_SHOT = "yyyy-MM-dd";
_Date.STANDART_FORMAT = "yyyy-MM-ddThh:mm:ss.fffZ";
_Date.STANDART_TIME_FORMAT = "hh:mm:ss.fff";

_Date.toString = function (dateTime, formatStr) {
  formatStr = formatStr ? formatStr : this.DEFAULT_FORMAT;
  var year = dateTime.getFullYear();
  var month = dateTime.getMonth() + 1;
  var date = dateTime.getDate();
  var houres = dateTime.getHours();
  var minutes = dateTime.getMinutes();
  var seconds = dateTime.getSeconds();
  var milliseconds = dateTime.getMilliseconds();
  milliseconds = _full(milliseconds + "", "0", 3, true);
  return formatStr.replace(/yyyy|YYYY/, year).replace(/yy|YY/, (year % 100) > 9 ? (year % 100).toString() : ('0' + (year % 100))).replace(/MM/,
    month > 9 ? month.toString() : '0' + month).replace(/M/g, month).replace(/dd|DD/, date > 9 ? date.toString() : '0' + date).replace(
    /d|D/g, date).replace(/hh|HH/, houres > 9 ? houres.toString() : '0' + houres).replace(/h|H/g, houres).replace(/mm/,
    minutes > 9 ? minutes.toString() : '0' + minutes).replace(/m/g, minutes).replace(/ss|SS/,
    seconds > 9 ? seconds.toString() : '0' + seconds).replace(/s|S/g, seconds).replace(/fff/g, milliseconds);
};

_Date.increase = function (datetime, num, interval) {
  datetime = (typeof datetime == 'string') ? this.fromString(datetime) : datetime;
  interval = (typeof interval == 'undefined') ? 'd' : interval;
  switch (interval) {
    case 's':
      return new Date(Date.parse(datetime) + (this._msForSecond * num));
    case 'n':
      return new Date(Date.parse(datetime) + (this._msForMinute * num));
    case 'h':
      return new Date(Date.parse(datetime) + (this._msForHour * num));
    case 'd':
      return new Date(Date.parse(datetime) + (this._msForDay * num));
    case 'w':
      return new Date(Date.parse(datetime) + (this._msForWeek * num));
    case 'm':
      return new Date(datetime.getFullYear(), (datetime.getMonth()) + num, datetime.getDate(), datetime.getHours(), datetime.getMinutes(),
        datetime.getSeconds());
    case 'q':
      return new Date(datetime.getFullYear(), (datetime.getMonth()) + num * 3, datetime.getDate(), datetime.getHours(), datetime.getMinutes(),
        datetime.getSeconds());
    case 'y':
      return new Date((datetime.getFullYear() + num), datetime.getMonth(), datetime.getDate(), datetime.getHours(), datetime.getMinutes(),
        datetime.getSeconds());
  }
};

_Date.decrease = function (datetime, num, interval) {
  datetime = (typeof datetime == 'string') ? this.fromString(datetime) : datetime;
  interval = (typeof interval == 'undefined') ? 'd' : interval;
  switch (interval) {
    case 's':
      return new Date(Date.parse(datetime) - (this._msForSecond * num));
    case 'n':
      return new Date(Date.parse(datetime) - (this._msForMinute * num));
    case 'h':
      return new Date(Date.parse(datetime) - (this._msForHour * num));
    case 'd':
      return new Date(Date.parse(datetime) - (this._msForDay * num));
    case 'w':
      return new Date(Date.parse(datetime) - (this._msForWeek * num));
    case 'm':
      return new Date(datetime.getFullYear(), (datetime.getMonth()) - num, datetime.getDate(), datetime.getHours(), datetime.getMinutes(),
        datetime.getSeconds());
    case 'q':
      return new Date(datetime.getFullYear(), (datetime.getMonth()) - num * 3, datetime.getDate(), datetime.getHours(), datetime.getMinutes(),
        datetime.getSeconds());
    case 'y':
      return new Date((datetime.getFullYear() - num), datetime.getMonth(), datetime.getDate(), datetime.getHours(), datetime.getMinutes(),
        datetime.getSeconds());
  }
};

_Date.diff = function (start, end, interval) {
  start = (typeof start == 'string') ? this.fromString(start) : start;
  end = (typeof end == 'string') ? this.fromString(end) : end;
  interval = (typeof interval == 'undefined') ? 'd' : interval;
  switch (interval) {
    case 's':
      return parseInt((end - start) / this._msForSecond, 10);
    case 'n':
      return parseInt((end - start) / this._msForMinute, 10);
    case 'h':
      return parseInt((end - start) / this._msForHour, 10);
    case 'd':
      return parseInt((end - start) / this._msForDay, 10);
    case 'w':
      return parseInt((end - start) / this._msForWeek, 10);
    case 'm':
      return (end.getMonth() + 1) + ((end.getFullYear() - start.getFullYear()) * 12) - (start.getMonth() + 1);
    case 'y':
      return end.getFullYear() - start.getFullYear();
  }
};

_Date.between = function (date1, date2) {
  return Math.abs(this.diff(date1, date2));
};

// todo: md 需要重构
// 如果格式满足YYYY-(/)MM-(/)DD或YYYY-(/)M-(/)DD或YYYY-(/)M-(/)D或YYYY-(/)MM-(/)D就替换为''
// 数据库中，合法日期可以是:YYYY-MM/DD(2003-3/21),数据库会自动转换为YYYY-MM-DD格式
_Date.isValid = function (str) {
  str = String.trim(str);  // 去空格
  if (str === '')
    return false;
  var reg = /[\d]{ 4,4 }[\-\/]{ 1 }[\d]{ 1,2 }[\-\/]{ 1 }[\d]{ 1,2 }/g;
  if (str.replace(reg, '') === '') {
    var t = new Date(str.replace(/\-/g, '/'));
    var ar = str.split(new RegExp("[-/:]"));
    return (ar[0] != t.getYear() || ar[1] != t.getMonth() + 1 || ar[2] != t.getDate()) ? false : true;
  }
  return false;
};

_Date.MaxDay = function (year, month) {
  if (month == 1 || month == 3 || month == 5 || month == 7 || month == 8 || month == 10 || month == 12) {
    return 31;
  } else if (month == 4 || month == 6 || month == 9 || month == 11) {
    return 30;
  } else if (this.isLeapYear(year)) {
    return 29;
  } else {
    return 28;
  }
};

_Date.now = function () {
  return new Date();
};

_Date.getFirstDay = function (date) {
  if (!date)
    date = new Date();
  if ("string" == typeof (date)) {
    date = Date.fromString(date, Date.STANDART_FORMAT_SHOT);
  }
  date.setDate(1);
  return Date.toString(date, Date.STANDART_FORMAT_SHOT);
};

_Date.getLastDay = function (date) {
  if (!date)
    date = new Date();
  if ("string" == typeof (date)) {
    date = Date.fromString(date, Date.STANDART_FORMAT_SHOT);
  }
  date = Date.increase(date, 1, 'm');
  date.setDate(1);
  date = Date.decrease(date, 1, 'd');
  return Date.toString(date, Date.STANDART_FORMAT_SHOT) + " 23:59:59";
};

module.exports = _Date
