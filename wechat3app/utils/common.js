var v = "v6";
var baseUrl = "https://wechat.dakaqingdan.com/dakaqingdan";
// var baseUrl = "https://wechat3.dakaqingdan.com/dakaqingdan";

var my_debug = 1;
///私有方法开

function isLogin() {
  if (getCookie()) {
    if (getUserInfo()) {
      return true;
    }
  }
  return false;
}
function setCookie(data) {
  wx.setStorageSync("cookie", data);
}
function getCookie() {
  return wx.getStorageSync("cookie");
}
function setUserInfo(data) {
  wx.setStorageSync("userInfo", data);
}
function getUserInfo() {
  return wx.getStorageSync("userInfo");
}

function setVs(vs) {
  wx.setStorageSync("vs", vs);
}
function getVs() {
  return wx.getStorageSync("vs");
}

function req(url, data, success, fail) {
  wx.request({
    url: baseUrl + url,
    method: "POST",
    data: data == null ? null : JSON.stringify(data),
    dataType: "json",
    header: getCookie() == null ? { cookie: "null" } : getCookie(),
    success: function (r) {
      if (r.statusCode == 401) {
        setCookie(null);
        wx.showToast({
          title: '登录信息失效，请刷新页面',
          icon: "loading"
        })
        return;
      }
      if (r.statusCode == 200) {
        if (success) {
          if (r.data) {
            success(r.data);
          } else {
            success(r)
          }
          return
        }
      }
      if (fail) {
        fail(r);
      } else {
        wx.redirectTo({ url: "/pages/Index/Index" })
      }
      return;
    },
    fail(r) {
      if (fail) {
        fail(r)
      } else {
        wx.redirectTo({ url: "/pages/Index/Index" })
      }
    }
  })
}

///私有方法结束

//api 开始
function login(cb) {
  if (isLogin()) {
    typeof cb == "function" && cb(getUserInfo());
    return;
  }
  wx.login({
    success: function (res) {
      if (res.code) {
        wx.getUserInfo({
          withCredentials: true,
          success: function (userRes) {
            var r = userRes;
            r.code = res.code;
            r.v = v;
            r.encryptedData="";
            var userInfo = userRes.userInfo;
            req("/api/user/login.do", r, function (d) {
              var data = d.data;
              setCookie({ cookie: data.cookieName + "=" + data.sessionKey });
              if (data.vs === 'false') {
                setVs(false);
              } else {
                setVs(true);
              }
              setCookie({ cookie: "JSESSIONID=" + data.sessionKey });
              userInfo.OpenId = data.OpenId;
              userInfo.AvatarUrl = data.AvatarUrl;
              userInfo.number_of_users = data.number_of_users;
              setUserInfo(userInfo);
              typeof cb == "function" && cb(userInfo);
              return;
            });
          },
          fail: function (r) {
            wx.showModal({
              title: '提示',
              content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
              success: function (res) {
                if (res.confirm) {
                  wx.navigateTo({
                    url: '/pages/tologin/tologin',
                  })
                }
              }
            })
          }
        })
      } else {
        console.log('获取用户登录态失败！' + res.errMsg)
      }
    }
  });
}

function uploadImage(temppath, cb, onProgressUpdate) {
  var articleID = wx.getStorageSync('articleID');
  var myfilenameid = wx.getStorageSync('myfilenameid');
  var myfilename = "file" + myfilenameid;
  myfilenameid++;
  wx.setStorageSync("myfilenameid", myfilenameid);
  var task = wx.uploadFile({
    url: baseUrl + '/api/user/uploadArticleImages.do',
    filePath: temppath,
    name: myfilename,
    header: { "Content-Type": "multipart/form-data" },
    formData: {
      'articleID': articleID,
      'myfilename': myfilename,
    },
    complete: function (res) {
      if (res.statusCode == 200) {
        var data = JSON.parse(res.data);
        typeof cb == "function" && cb(data);
      } else {
        cb({ state: 100, message: "上传过程中网络出错" + baseUrl })
      }
    }
  });
  try {
    task.onProgressUpdate(function (res) {
      onProgressUpdate(res);
    });
  } catch (ex) { }

}

function getMyOrders(page, cb) {
  req('/api/order/getMyOrders', page, function (data) {
    typeof cb == "function" && cb(data);
  });
}

function getMyAccount(cb) {
  req('/api/user/getMyAccount.do', null, function (data) {
    typeof cb == "function" && cb(data);
  });
}

function newOrder(data, cb) {
  req('/api/order/newOrder', data, function (d) {
    typeof cb == "function" && cb(d);
  });
}

function getDetail(id, cb) {
  req('/api/order/detail', id, function (d) {
    typeof cb == "function" && cb(d);
  });
}



function report(id, cb) {
  req('/api/order/report', id, function (d) {
    typeof cb == "function" && cb(d);
  });
}

function payOrder(id, cb) {
  req('/api/order/payorder', id, function (d) {
    typeof cb == "function" && cb(d);
  });
}
function cancelOrder(id, cb) {
  req('/api/order/cancelorder', id, function (d) {
    typeof cb == "function" && cb(d);
  });
}

function createDraw(data, cb) {
  req('/api/draw/create', data, function (d) {
    typeof cb == "function" && cb(d);
  });
}

function getMyAccountStatistics(cb) {
  req('/api/user/getmyaccountstatistics.do', null, function (d) {
    typeof cb == "function" && cb(d);
  });
}

function getDrawPage(cb) {
  req('/api/user/getdrawpage.do', null, function (d) {
    typeof cb == "function" && cb(d);
  });
}

function getOrderUsers(data, cb) {
  req('/api/order/getOrderUsers', data, function (d) {
    typeof cb == "function" && cb(d);
  });
}

function getMyWXAcodeUnlimit(cb) {
  req('/api/user/getwxacodeunlimit.do', null, function (data) {
    typeof cb == "function" && cb(data);
  });
}

function getMyWXPaySpecifiedYuan(myPara, cb) {
  req('/api/user/getwxpayspecifiedyuan.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function getMyGuanzhu30Days(myPara, cb) {
  req('/api/user/getwxguanzhu30days.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}function setMyWxSuccessPaySpecifiedYuan(myPara, cb) {
  req('/api/user/setwxsuccesspayspecifiedyuan.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function setMyGuanzhu30Days(myPara, cb) {
  req('/api/user/setguanzhu30days.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function drawMyMoney(data, cb) {
  req('/api/draw/drawmymoney.do', data, function (d) {
    typeof cb == "function" && cb(d);
  });
}
function getHostInfo(myPara, cb) {
  req('/api/user/getwxhostinfo.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}

/*
 *started 20180620
 */
function publishArticle(myPara, cb) {
  req('/api/user/getwxpublisharticle.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function getArticleList(myPara, cb) {
  req('/api/user/getwxarticlelist.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function getArticleListByLongitudeAndLatitude(myPara, cb) {
  req('/api/user/getwxarticlelistbylongitudeandlatitude.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function updateArticleContent(myPara, cb) {
  req('/api/user/updatewxarticlecontent.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function deletemyarticle(myPara, cb) {
  req('/api/user/deletewxarticlefromid.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function tousuArticle(myPara, cb) {
  req('/api/user/tousuwxarticlefromid.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function numberofselfarticles(myPara, cb) {
  req('/api/user/getwxnumberofselfarticles.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}
function getClientArticleCurrentDayNumbers(myPara, cb) {
  req('/api/user/getclientarticlecurrentdaynumbers.do', myPara, function (data) {
    typeof cb == "function" && cb(data);
  });
}

function getShareQrUrl(id) {
  return baseUrl + "/qr/share?id=" + encodeURIComponent(id) + "&name=" + encodeURIComponent(getUserInfo().nickName);
}

module.exports = {
  login: login,
  setCookie: setCookie,
  setUserInfo: setUserInfo,
  getMyOrders: getMyOrders,
  getMyAccount: getMyAccount,
  getDrawPage: getDrawPage,
  newOrder: newOrder,
  uploadImage: uploadImage,
  getDetail: getDetail,
  report: report,
  createDraw: createDraw,
  payOrder: payOrder,
  cancelOrder: cancelOrder,
  getMyAccountStatistics: getMyAccountStatistics,
  getOrderUsers: getOrderUsers,
  getShareQrUrl: getShareQrUrl,
  getVs: getVs,
  setVs: setVs,
  my_debug: my_debug,//documented 20180604
  getMyWXAcodeUnlimit: getMyWXAcodeUnlimit,
  getMyWXPaySpecifiedYuan: getMyWXPaySpecifiedYuan,
  getHostInfo: getHostInfo,
  publishArticle: publishArticle,
  getArticleList: getArticleList,
  getArticleListByLongitudeAndLatitude: getArticleListByLongitudeAndLatitude,
  updateArticleContent: updateArticleContent,
  deletemyarticle: deletemyarticle,
  tousuArticle: tousuArticle,
  numberofselfarticles: numberofselfarticles,
  drawMyMoney:drawMyMoney,
  setMyWxSuccessPaySpecifiedYuan: setMyWxSuccessPaySpecifiedYuan,
  setMyGuanzhu30Days: setMyGuanzhu30Days,
  getMyGuanzhu30Days: getMyGuanzhu30Days,
  baseUrl: baseUrl,
  getClientArticleCurrentDayNumbers: getClientArticleCurrentDayNumbers  
}
