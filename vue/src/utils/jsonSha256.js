/*!
* gaozh v1
*/
var signRValue = require("./../config/signRValue");
/*
 * sha256 计算 arys 传入的json key 传入的密钥 flag 1:请求报文 2:应答报文 return true or false
 */

var mathJsonSha = function (arys, key, flag) {
  var result = "";
  var arys1 = {};
  var arys2 = {};

  if (null === key || 0 === key.length) {
    return false;
  }
  for (var item in arys) {
    if (item.substring(0, 1) === "Y") {
      arys2[item] = arys[item];
    } else if (item.substring(0, 1) === "R") {
      arys1[item] = arys[item];
    }
  }
  arys2.Key = key;
  result = this.json2sha(arys2, arys1, flag);
  if (1 === flag) {
    arys.Z2 = result;
    // console.log(result);
  }
      // else {
  //   if (result !== arys.Z2) {
  //     return false;
  //   }
  // }

  return result;
};

var json2sha = function (arys, arys1, flag) {
  // 排序，按照字母A-Z,a-z排序
  var jsonObj = this.objKeySort(arys);
  var jsonRObj = this.objKeySort(arys1);
  var jsonstr = "";
  var jsonstrR = "";
  // 拼接字符串
  for (var item in jsonObj) {
    jsonstr += item + "=" + jsonObj[item] + "&";
  }
  for (var i = 0; i < signRValue.R.length; i++) {
    var packR = [];
    // Y051:TxnId
    if (jsonObj.Y051 !== signRValue.R[i].TxnId) {
      continue;
    }
    // console.log(jsonObj.Y051);
    // 找到TxnId相同的
    if (flag === 1 && signRValue.R[i].Req !== undefined) {
      packR = signRValue.R[i].Req;
      // 请求报文需要加密循环域
    } else if (flag === 2 && signRValue.R[i].Res !== undefined) {
      packR = signRValue.R[i].Res;
      // 响应报文需要加密循环域
    } else {
      break;
    }
    var tmpR = this.jsonR2Value(jsonRObj, packR);
    jsonstrR += tmpR;
    break;
  }
  var jsonstr1 = jsonstr.substring(0, jsonstr.length - 1);


  if (jsonstrR.length > 0) {
    var jsonstrR1 = jsonstrR.substring(0, jsonstrR.length - 1);
    jsonstr1 = jsonstr1 + "&&" + jsonstrR1;
  }
  // 去掉尾部的&符号

  // SHA256计算
  // console.log("jsonstr1:" + jsonstr1);
  var jsonstr2 = this.SHA256(jsonstr1);
  return jsonstr2;
};
var jsonR2Value = function (arys1, arys2) {
  var jsonstr = "";
  for (var item in arys1) {
    for (var i = 0; i < arys2.length; i++) {
      if (item !== arys2[i].Val) {
        continue;
      }
      jsonstr += item + "&" + this.jsonR2Unpack(arys1[item]);
    }
  }
  return jsonstr;

};
var jsonR2Unpack = function (arys1) {
  var jsonstr = "";
  for (var i = 0; i < arys1.length; i++) {
    var tmp = arys1[i];
    for (var item in tmp) {
      jsonstr += item + "=" + tmp[item] + "&";
    }
  }
  return jsonstr;
};
var objKeySort = function (arys) {
  // 先用Object内置类的keys方法获取要排序对象的属性名，再利用Array原型上的sort方法对获取的属性名进行排序，newkey是一个数组
  var newkey = Object.keys(arys).sort();
  var newObj = {}; // 创建一个新的对象，用于存放排好序的键值对
  for (var i = 0; i < newkey.length; i++) {
    // 遍历newkey数组
    newObj[newkey[i]] = arys[newkey[i]];
    // 向新创建的对象中按照排好的顺序依次增加键值对

  }
  return newObj; // 返回排好序的新对象
};

var SHA256 = function (s) {

  var chrsz = 8;
  var hexcase = 0;

  function safe_add(x, y) {
    var lsw = (x & 0xFFFF) + (y & 0xFFFF);
    var msw = (x >> 16) + (y >> 16) + (lsw >> 16);
    return (msw << 16) | (lsw & 0xFFFF);
  }

  function S(X, n) {
    return (X >>> n) | (X << (32 - n));
  }
  function R(X, n) {
    return (X >>> n);
  }
  function Ch(x, y, z) {
    return ((x & y) ^ ((~x) & z));
  }
  function Maj(x, y, z) {
    return ((x & y) ^ (x & z) ^ (y & z));
  }
  function Sigma0256(x) {
    return (S(x, 2) ^ S(x, 13) ^ S(x, 22));
  }
  function Sigma1256(x) {
    return (S(x, 6) ^ S(x, 11) ^ S(x, 25));
  }
  function Gamma0256(x) {
    return (S(x, 7) ^ S(x, 18) ^ R(x, 3));
  }
  function Gamma1256(x) {
    return (S(x, 17) ^ S(x, 19) ^ R(x, 10));
  }

  function core_sha256(m, l) {
    var K = new Array(0x428A2F98, 0x71374491, 0xB5C0FBCF, 0xE9B5DBA5, 0x3956C25B, 0x59F111F1, 0x923F82A4, 0xAB1C5ED5, 0xD807AA98, 0x12835B01, 0x243185BE, 0x550C7DC3, 0x72BE5D74, 0x80DEB1FE,
      0x9BDC06A7, 0xC19BF174, 0xE49B69C1, 0xEFBE4786, 0xFC19DC6, 0x240CA1CC, 0x2DE92C6F, 0x4A7484AA, 0x5CB0A9DC, 0x76F988DA, 0x983E5152, 0xA831C66D, 0xB00327C8, 0xBF597FC7, 0xC6E00BF3,
      0xD5A79147, 0x6CA6351, 0x14292967, 0x27B70A85, 0x2E1B2138, 0x4D2C6DFC, 0x53380D13, 0x650A7354, 0x766A0ABB, 0x81C2C92E, 0x92722C85, 0xA2BFE8A1, 0xA81A664B, 0xC24B8B70, 0xC76C51A3,
      0xD192E819, 0xD6990624, 0xF40E3585, 0x106AA070, 0x19A4C116, 0x1E376C08, 0x2748774C, 0x34B0BCB5, 0x391C0CB3, 0x4ED8AA4A, 0x5B9CCA4F, 0x682E6FF3, 0x748F82EE, 0x78A5636F, 0x84C87814,
      0x8CC70208, 0x90BEFFFA, 0xA4506CEB, 0xBEF9A3F7, 0xC67178F2);
    var HASH = new Array(0x6A09E667, 0xBB67AE85, 0x3C6EF372, 0xA54FF53A, 0x510E527F, 0x9B05688C, 0x1F83D9AB, 0x5BE0CD19);
    var W = new Array(64);
    var a, b, c, d, e, f, g, h;
    var T1, T2;

    m[l >> 5] |= 0x80 << (24 - l % 32);
    m[((l + 64 >> 9) << 4) + 15] = l;

    for (var i = 0; i < m.length; i += 16) {
      a = HASH[0];
      b = HASH[1];
      c = HASH[2];
      d = HASH[3];
      e = HASH[4];
      f = HASH[5];
      g = HASH[6];
      h = HASH[7];

      for (var j = 0; j < 64; j++) {
        if (j < 16)
          W[j] = m[j + i];
        else
          W[j] = safe_add(safe_add(safe_add(Gamma1256(W[j - 2]), W[j - 7]), Gamma0256(W[j - 15])), W[j - 16]);

        T1 = safe_add(safe_add(safe_add(safe_add(h, Sigma1256(e)), Ch(e, f, g)), K[j]), W[j]);
        T2 = safe_add(Sigma0256(a), Maj(a, b, c));

        h = g;
        g = f;
        f = e;
        e = safe_add(d, T1);
        d = c;
        c = b;
        b = a;
        a = safe_add(T1, T2);
      }

      HASH[0] = safe_add(a, HASH[0]);
      HASH[1] = safe_add(b, HASH[1]);
      HASH[2] = safe_add(c, HASH[2]);
      HASH[3] = safe_add(d, HASH[3]);
      HASH[4] = safe_add(e, HASH[4]);
      HASH[5] = safe_add(f, HASH[5]);
      HASH[6] = safe_add(g, HASH[6]);
      HASH[7] = safe_add(h, HASH[7]);
    }
    return HASH;
  }

  function str2binb(str) {
    var bin = Array();
    var mask = (1 << chrsz) - 1;
    for (var i = 0; i < str.length * chrsz; i += chrsz) {
      bin[i >> 5] |= (str.charCodeAt(i / chrsz) & mask) << (24 - i % 32);
    }
    return bin;
  }

  function Utf8Encode(string) {
    string = string.replace(/\r\n/g, "\n");
    var utftext = "";

    for (var n = 0; n < string.length; n++) {

      var c = string.charCodeAt(n);

      if (c < 128) {
        utftext += String.fromCharCode(c);
      } else if ((c > 127) && (c < 2048)) {
        utftext += String.fromCharCode((c >> 6) | 192);
        utftext += String.fromCharCode((c & 63) | 128);
      } else {
        utftext += String.fromCharCode((c >> 12) | 224);
        utftext += String.fromCharCode(((c >> 6) & 63) | 128);
        utftext += String.fromCharCode((c & 63) | 128);
      }

    }

    return utftext;
  }

  function binb2hex(binarray) {
    var hex_tab = hexcase ? "0123456789ABCDEF" : "0123456789abcdef";
    var str = "";
    for (var i = 0; i < binarray.length * 4; i++) {
      str += hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8 + 4)) & 0xF) + hex_tab.charAt((binarray[i >> 2] >> ((3 - i % 4) * 8)) & 0xF);
    }
    return str;
  }

  s = Utf8Encode(s);
  return binb2hex(core_sha256(str2binb(s), s.length * chrsz));

};

export{
  mathJsonSha,
  json2sha,
  jsonR2Value,
  jsonR2Unpack,
  objKeySort,
  SHA256
}
