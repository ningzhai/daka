// detail.js
var com = require("../../utils/common.js");
var util = require("../../utils/util.js");
// 当前页数
var scrollTop = 0;
var scrollHeight = 0;
var isScrollRunning=false;
var shuaxinhidden=false;
var comefromotherpage=0;
var hostOpenId = 0;
var allowtopshuaxin=false;
var timestr1 =null;
var reader_latitude = null;
var reader_longitude = null;
var selfcontentNumber=0;

// 加载数据
var loadMsgData = function (that) {
  that.setData({
    hidden: true
  });
  // console.log("here me first!\n");
  var pageNum=that.data.pageNum;
  var orderPageNum = pageNum;
  console.log("pageNum:" + pageNum);
  console.log("timestr1:" + timestr1);
  console.log("reader_latitude:" + reader_latitude);
  console.log("reader_longitude:" + reader_longitude);
  // console.log("hostOpenId:" + hostOpenId);
  // console.log("that.data.hidden:" + that.data.hidden);
  // console.log("pageSize:" + pageSize);
  var allMsg = that.data.order;
  wx.getLocation({
    type: 'wgs84',
    success: function (res) {
      // console.log(res);
      // var reader_latitude = res.latitude
      // var reader_longitude = res.longitude
      if(pageNum==1){
        reader_latitude = res.latitude
        reader_longitude = res.longitude
      }
      // //弹框
      // wx.showModal({
      //   title: '当前位置',
      //   content: "纬度:" + reader_latitude + ",经度:" + reader_longitude,
      // })

  com.getArticleListByLongitudeAndLatitude({
    "page": pageNum, "pageSize": 6, "timestr1": timestr1, "reader_longitude": reader_longitude, "reader_latitude": reader_latitude }, function (res1) {
    // console.log("pageNum:"+pageNum);
    // console.log("res1:");
    // console.log(res1);
    if (typeof (res1.data) == "undefined") {
      // console.log("正常语句");
    } else if (res1.data.status === 'loginSessionLost') {
      console.log(res1.data.status);
      try {
        wx.removeStorageSync("userInfo");
        wx.removeStorageSync("cookie");
      } catch (e) {

      }
      com.login(function (userInfo) {
        console.log("here me001");
        wx.redirectTo({ url: "/pages/detail/detail?hostOpenId" + hostOpenId });
        // return false;
      });
    }

    var orderOld1 = that.data.order;
    if (pageNum == 1 && res1.length >= 1) {
      // console.log("here 1");
      timestr1 = res1[0].accessTime;
      reader_longitude = res1[0].accessreader_longitude;
      reader_latitude = res1[0].accessreader_latitude;
      // timestr1 = res1[0].publishDate1;
      // console.log("that:");
      // console.log(that);
      // console.log("orderOld1:");
      // console.log(orderOld1);
      // console.log("res1:");
      // console.log(res1);
      if (typeof (orderOld1) != 'undefined' && orderOld1.length > 0 && orderOld1[0].Id != res1[0].Id) {
        // console.log("here 2");
        allMsg = [];
        that.setData({
          order: [],
          pageNum: 2
        });
      } else if (typeof (orderOld1) != 'undefined' && orderOld1.length > 0 && orderOld1[0].Id == res1[0].Id) {
        // console.log("here 3");
        pageNum = that.data.oldPageNum2;
        that.setData({ pageNum: pageNum });
        wx.hideNavigationBarLoading() //完成停止加载
        wx.stopPullDownRefresh();
        isScrollRunning = false;
        wx.hideLoading();
        return false;
      } else {
        // console.log("here 4");
      }
    } else if (res1.length == 0) {
      pageNum--;
      that.setData({ pageNum: pageNum });
    }
    // console.log("here 5");
    for (var i = 0; i < res1.length; i++) {
      // console.log("res1[" + i + "]");
      // console.log(res1[i].publishDate);
      // console.log(res1[i].publishDate.indexOf("-"));
      // console.log(res1[i].publishDate.substr(res1[i].publishDate.indexOf("-")+1));
      // console.log(res1[i]);
      res1[i].publishDate = res1[i].publishDate.substr(res1[i].publishDate.indexOf("-") + 1);
      allMsg.push(res1[i]);
    }
    // console.log("here 6");
    that.setData({
      order: allMsg
    });
    // that.setData({ "tophiddenstatus1": true });
    // that.setData({
    //   hidden: true
    // });
    // console.log("Page:");
    // console.log(that);
    // console.log("allMsg:");
    // console.log(allMsg);
    // console.log("that.data.hostall:" + that.data.hostall);
    // console.log("that.data.nothostall:" + that.data.nothostall);
    // console.log("that.data.order:");
    // console.log(that.data.order);
    pageNum++;
    that.setData({ pageNum: pageNum });
    wx.hideNavigationBarLoading() //完成停止加载
    wx.stopPullDownRefresh()
    isScrollRunning = false;
    wx.hideLoading();
  });
    }
  });

//20190728 以下内容是扫码关注时候的逻辑
  // com.getArticleList({ "page": pageNum, "pageSize": 6, "timestr1":timestr1, "hostOpenId": hostOpenId }, function (res1) {
  //   // console.log("pageNum:"+pageNum);
  //   // console.log("res1:");
  //   // console.log(res1);
  //   if (typeof(res1.data)=="undefined"){
  //     // console.log("正常语句");
  //   }else if(res1.data.status==='loginSessionLost'){
  //     console.log(res1.data.status);
  //     try{
  //       wx.removeStorageSync("userInfo");
  //       wx.removeStorageSync("cookie");
  //     }catch(e){

  //     }
  //     com.login(function (userInfo) {
  //       console.log("here me001");
  //       wx.redirectTo({ url: "/pages/detail/detail?hostOpenId" + hostOpenId });
  //       // return false;
  //     });
  //   }

  //   var orderOld1=that.data.order;
  //   if(pageNum==1 && res1.length>=1){
  //     // console.log("here 1");
  //     timestr1=res1[0].publishDate1;
  //     // console.log("that:");
  //     // console.log(that);
  //     // console.log("orderOld1:");
  //     // console.log(orderOld1);
  //     // console.log("res1:");
  //     // console.log(res1);
  //     if(typeof(orderOld1)!='undefined' && orderOld1.length>0 && orderOld1[0].Id!=res1[0].Id){
  //       // console.log("here 2");
  //       allMsg=[];
  //       that.setData({
  //         order: [],
  //         pageNum:2
  //       });
  //     } else if (typeof (orderOld1) != 'undefined' && orderOld1.length > 0 && orderOld1[0].Id == res1[0].Id){
  //       // console.log("here 3");
  //       pageNum = that.data.oldPageNum2;
  //       that.setData({pageNum:pageNum});
  //       wx.hideNavigationBarLoading() //完成停止加载
  //       wx.stopPullDownRefresh();
  //       isScrollRunning = false;
  //       wx.hideLoading();
  //       return false;
  //     }else{
  //       // console.log("here 4");
  //     }
  //   } else if (res1.length==0){
  //     pageNum--;
  //     that.setData({ pageNum: pageNum });
  //   }
  //   // console.log("here 5");
  //   for (var i = 0; i < res1.length; i++) {
  //     // console.log("res1[" + i + "]");
  //     // console.log(res1[i].publishDate);
  //     // console.log(res1[i].publishDate.indexOf("-"));
  //     // console.log(res1[i].publishDate.substr(res1[i].publishDate.indexOf("-")+1));
  //     // console.log(res1[i]);
  //     res1[i].publishDate=res1[i].publishDate.substr(res1[i].publishDate.indexOf("-") + 1);
  //     allMsg.push(res1[i]);
  //   }
  //   // console.log("here 6");
  //   that.setData({
  //     order: allMsg
  //   });
  //   // that.setData({ "tophiddenstatus1": true });
  //   // that.setData({
  //   //   hidden: true
  //   // });
  //   // console.log("Page:");
  //   // console.log(that);
  //   // console.log("allMsg:");
  //   // console.log(allMsg);
  //   // console.log("that.data.hostall:" + that.data.hostall);
  //   // console.log("that.data.nothostall:" + that.data.nothostall);
  //   // console.log("that.data.order:");
  //   // console.log(that.data.order);
  //   pageNum++;
  //   that.setData({pageNum:pageNum});
  //   wx.hideNavigationBarLoading() //完成停止加载
  //   wx.stopPullDownRefresh()
  //   isScrollRunning=false;
  //   wx.hideLoading();
  // });
}

Page({

  /**
   * 页面的初始数据
   */
  data: {
    id: "",
    userInfo: null,
    // order: null,
    order: [],
    qrurl: "/images/ds.png",
    pageNum:1,
    oldPageNum2:1,
    showUsers: true,
    users: null,
    time: "",
    selfcontentNumber:false,
    showShare: false,
    shareIng: false,
    headheight: 200,
    marginbottom: 30,
    actionSheetHidden:true,
    actionRenewSheetHidden:true,
    tophiddenstatus1:true,//顶端刷新控制
    nothostall:false,
    hostOpenId:"all",
    hostall: true,
    yonghushu:0,
    xufeiSign1:0,
    actionSheetItems: ['提现', '生成自己的二维码', '扫图片二维码'],
    showModal: false,
    showDeleteModal: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (e) {
    wx.hideShareMenu();
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    var that = this;
    wx.getSystemInfo({
      success: function (res) {
        that.setData({
          windowHeight: res.windowHeight,
          windowWidth: res.windowWidth
        })
      }
    });
    // console.log("hostOpenId1:" + hostOpenId);
    hostOpenId = e.hostOpenId;
    // console.log("hostOpenId2:" + hostOpenId);
    if(hostOpenId=='all'){
      that.setData({
        nothostall: true,
        hostall: false
      });
    }else{
      wx.hideShareMenu();
      that.setData({
        nothostall: false,
        hostall: true
      });
    }

    // return false;
    com.login(function (userInfo) {
      // console.log("userInfo");
      // console.log(userInfo);
      that.setData({ pageNum:1});
      timestr1 = null;
      loadMsgData(that);
      that.setData({ userInfo: userInfo});
    });

  },

  // 下拉刷新数据
  pullDownRefresh: function () {
  },

  // // 上拉加载数据 上拉动态效果不明显有待改善
  pullUpLoad: function () {
  },

  // 定位数据
  scroll: function (event) {
    // console.log("event:");
    // console.log(event);
    var that = this;
    that.setData({
      scrollTop: event.detail.scrollTop
    });
  },

  showUsers: function () {
    this.setData({ showUsers: !this.data.showUsers });
    this.changeUsers();
  },
  changeUsers: function () {
    var that = this;
    var pageIndex = 1;
    var users = that.data.users
    if (users != null) {
      var pageCount = parseInt((users.totalCount + users.pageSize - 1) / users.pageSize);
      if (pageCount == 1) { return; }
      pageIndex = users.pageIndex + 1 > pageCount ? 1 : users.pageIndex + 1;
    }
    com.getOrderUsers({ shareId: that.data.id, pageIndex: pageIndex }, function (data) {
      that.setData({ users: data.data, totalCount: data.data.totalCount });
    });
  },
  previewImage: function (e) {
    // console.log("e:");
    // console.log(e);
    // console.log(e.currentTarget.dataset.id_in_array);
    // console.log("order:");
    // console.log(this.data.order);
    wx.previewImage({
      current: e.currentTarget.id, // 当前显示图片的http链接
      urls: this.data.order[e.currentTarget.dataset.id_in_array].imageUrls // 需要预览的图片http链接列表
    })
  },
  create: function () {
    wx.navigateTo({
      url: '/pages/create/create'
    })
  },
  showShare: function () {
    wx.previewImage({ urls: [com.getShareQrUrl(this.data.id)] });
    return;

    this.setData({ showShare: true, qrurl: com.getShareQrUrl(this.data.id) });
  },
  hideShare: function () {
    this.setData({ showShare: false });
  },
  doShare: function () {
    wx.showShareMenu({ withShareTicket: true });
  },
  report: function () {
    var that = this;
    var itemList = ['色情内容', '政治谣言', '常识性谣言', '诱导分享', '恶意营销', '其它侵权类(冒名、诽谤、抄袭)']
    wx.showActionSheet({
      itemList: itemList,
      success: function (res) {
        if (!res.cancel) {
          var data = { orderId: that.data.order.orderId, content: itemList[res.tapIndex] }
          com.report(data, function (d) {
            wx.showToast({
              title: "提交成功"
            })
          })
        }
      }
    });
  },
  createqr: function () {
    this.setData({ qrurl: "http://localhost/qr/order?id=123" });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    var pages = getCurrentPages();
    // console.log("on show pages:");
    // console.log(pages);
    // var prevPage = pages[pages.length - 2];
    // prevPage.setData({ mydata: { a: 1, b: 2 } });
    // comefromotherpage++;
    // console.log("comefromotherpage:" + comefromotherpage);
    var frominside = wx.getStorageSync('frominside');
    // console.log("01frominside:" + frominside);
    // console.log("hostOpenId:" + hostOpenId);
    // pages[0].setData({'hostOpenId':"all"});
    if(pages.length==1){
      hostOpenId="all";
    }

    var shanchusign1 = wx.getStorageSync("shanchusign1");
    if (shanchusign1 == 1) {
      wx.removeStorageSync("shanchusign1");
      // wx.redirectTo({
      //   url: '/pages/Index/Index?scene=all',
      // })
    }

    var xufeisign1 = wx.getStorageSync("xufeisign1");
    if (xufeisign1 == 1) {
      wx.removeStorageSync("xufeisign1");
      wx.redirectTo({
        url: '/pages/Index/Index?scene=all',
      })
    }

    if(frominside==1){
      // console.log("发文章回来，清空整个列表和时间戳，以page=1进行加载数据");
      // wx.showNavigationBarLoading();
      // var that = this;
      // if (isScrollRunning == false) {
      //   isScrollRunning = true;
      //   // orderPageNum = pageNum;
      //   // pageNum = 1;
      //   that.setData({pageNum:1});
      //   timestr1 = null;
      //   loadMsgData(that);
      // }
      wx.removeStorageSync("frominside");
      wx.redirectTo({
        url: '/pages/Index/Index?scene=all',
      })
    }
// this.onLoad();
  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },
  /**
   * 点击自己图像，弹出授权/提现/扫一扫/小程序码/我的关注/我的用户等子菜单
   */
  listenerButton:function(){
    // console.log("here me");
    this.setData({
      //取反
      actionSheetHidden: !this.data.actionSheetHidden
    });
  },
  listenerActionSheet: function () {
    this.setData({
      actionSheetHidden: !this.data.actionSheetHidden
    })
  },

  /**
   * 点击文章主人图像，弹出 续费/查看 子菜单
   */
  listenerRenewMoney: function (event) {
    // console.log(event);
    // console.log("here me" + event.currentTarget.dataset.article_host);
    wx.setStorageSync("article_host_OpenId", event.currentTarget.dataset.article_host);
    this.setData({
      //取反
      actionRenewSheetHidden: !this.data.actionRenewSheetHidden
    });
  },
  listenerRenewMoneyActionSheet: function () {
    this.setData({
      actionRenewSheetHidden: !this.data.actionRenewSheetHidden
    })
  },
  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {
    wx.showLoading({
      title: '加载中',
      mask:true,
    })
    console.log("以当前的时间戳，清空整个列表和时间戳，以page=1进行加载数据");
    wx.showNavigationBarLoading();
    var that = this;
    if (isScrollRunning == false) {
      isScrollRunning = true;
      // orderPageNum = pageNum;
      // pageNum = 1;
      var pageNum=that.data.pageNum;
      console.log("pageNum 1:"+pageNum);
      that.setData({oldPageNum2:pageNum});
      that.setData({pageNum:1});
      timestr1 = null;
      loadMsgData(that);
    }
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {
    wx.showLoading({
      title: '加载中',
      mask: true,
    })
    console.log("以当前的时间戳，加载更在的数据，放在列表的后面");
    var that = this;
    var pageNum =that.data.pageNum;
    console.log("pageNum:");
    console.log(pageNum);
    if (isScrollRunning == false) {
      isScrollRunning = true;
      loadMsgData(that);
    }
  },
  /*
  *点击进入提现界面
  *
  */
  enterDrawerPage: function () {
    console.log("hello world, now 进入提现界面");
    com.login(function (userInfo) {
      console.log("userInfo:");
      console.log(userInfo);
      wx.navigateTo({ url: "/pages/draw/draw" })
    });
  },
  /*
  *点击进入文章发表界面
  *
  */
  enterCreaterPage: function () {
    console.log("hello world, now 进入文章发表");
    com.login(function (userInfo) {
      console.log("userInfo:");
      console.log(userInfo);
      wx.navigateTo({ url: "/pages/create/create" })
    });
  },
/**
 * 删除指定ID的文章
 * */  
  // deleteArticle:function(e){
  //   // console.log("delete Article e:");
  //   // console.log(e);
  //   // wx.setStorageSync("shanchusign1", 0);
  //   var orderId = e.currentTarget.dataset.orderId;
  //   var articleID = e.currentTarget.dataset.articleId;
  //   var that=this;
  //   com.deletemyarticle({ "articleId": articleID}, function (res1) {
  //     // console.log("res1:");
  //     // console.log(res1);
  //     var orderOld1=that.data.order;
  //     var allMsg = that.data.order;
  //     allMsg[orderId].articleshowhiddensign=true;
  //     that.setData({ order: allMsg});
  //     // wx.setStorageSync("shanchusign1", 1);
  //   });
  // },
  /**
   * 吐嘈指定ID的文章
   * */
  onDeleteCancel: function () {
    this.hideDeleteModal();
  },
  onDeleteConfirm: function () {
    this.hideDeleteModal();
    var orderId = wx.getStorageSync('orderId');
    var articleID = wx.getStorageSync('articleID');
    wx.setStorageSync("shanchu1", 0);
    var that = this;
    com.login(function (userInfo) {
      console.log("userInfo");
      console.log(userInfo);
      console.log("articleID:" + articleID);

      com.deletemyarticle({ "articleId": articleID }, function (res1) {
        // console.log("res1:");
        // console.log(res1);
        var orderOld1 = that.data.order;
        var allMsg = that.data.order;
        allMsg[orderId].articleshowhiddensign = true;
        that.setData({ order: allMsg });
        // wx.setStorageSync("shanchusign1", 1);
      });
    });
  },
  hideDeleteModal: function () {
    this.setData({
      showDeleteModal: false
    });
  },
  deleteArticle: function (e) {
    console.log("删除 Article e:");
    console.log(e);
    var orderId = e.currentTarget.dataset.orderId;
    var articleID = e.currentTarget.dataset.articleId;
    console.log("orderId:" + orderId + ", articleId:" + articleID);
    wx.setStorageSync("orderId", orderId);
    wx.setStorageSync("articleID", articleID);
    this.setData({
      showDeleteModal: true
    })
    return false;
  },
  
    /**
   * 吐嘈指定ID的文章
   * */
  onCancel: function () {
    this.hideModal();
  },
  onConfirm: function () {
    this.hideModal();
    var orderId = wx.getStorageSync('orderId');
    var articleID = wx.getStorageSync('articleID');
    wx.setStorageSync("tousu1", 0);
    var that = this;
    com.login(function (userInfo) {
      console.log("userInfo");
      console.log(userInfo);
      console.log("articleID:" + articleID);
      com.tousuArticle({ "articleId": articleID, "openId": userInfo.OpenId }, function (res1) {
        // console.log("res1:");
        // console.log(res1);
        var orderOld1 = that.data.order;
        var allMsg = that.data.order;
        allMsg[orderId].tousu = false;
        that.setData({ order: allMsg });
        // wx.setStorageSync("shanchusign1", 1);
      });
    });
  },
  hideModal: function () {
    this.setData({
      showModal: false
    });
  },
  touSuHost: function (e) {
    console.log("吐嘈 Article e:");
    console.log(e);
    var orderId = e.currentTarget.dataset.orderId;
    var articleID = e.currentTarget.dataset.articleId;
    console.log("orderId:"+orderId+", articleId:"+articleID);
    wx.setStorageSync("orderId", orderId);
    wx.setStorageSync("articleID", articleID);
    this.setData({
      showModal: true
    })
    return false;
  },

  /*
  *点击生成自己的二维码，产生属于自己的二维码
  *
  */
  generateSelfErWeiMarker: function () {
    // console.log("hello world, now I need background to generate 二维码图片，带参数哦:-)是我这个js吧");
    com.login(function (userInfo) {
      // console.log("userInfo:");
      // console.log(userInfo);
      com.getMyWXAcodeUnlimit(function (res) {
        // console.log("res:");
        // console.log(res.data);
        wx.setStorageSync("qrCodeUrl", res.data.qrCodeUrl);
        wx.navigateTo({ url: "/pages/article/generateSelfMarker" })
      });
    });
  },

  /*
  *模拟二维码的扫码功能
  *
  */
  scanHostErWeiMa: function () {
    console.log("现在模拟二维码的扫码功能");
    var pages=getCurrentPages();
    var url1=pages[pages.length-1].route;
    var options1 = pages[pages.length - 1].options;
    console.log("current page url:" + url1);
    // console.log(options1);
    wx.scanCode({
      success: (res) => {
        // console.log("res:");
        // console.log(res);
        var url2=res.path;
        wx.redirectTo({
          url: "/" + res.path,
        });
        console.log("扫码成功后，将去往页面：");
        console.log("url2:" + url2);
      }
    });
  },

  OnlySearchArticleHost:function(){
    // that=this;
    // console.log("page:");
    // console.log(page);
    // var frominside = wx.getStorageSync('frominside');
    // hostOpenId = wx.getStorageSync('article_host_OpenId');
    // console.log("hostOpenId:" + hostOpenId);
    com.login(function (userInfo) {
      console.log("userInfo:");
      console.log(userInfo);
      com.numberofselfarticles({ "hello": "world", "OpenId": userInfo.OpenId }, function (res1) {
        console.log("res1.number_of_self_articles:");
        console.log(res1.number_of_self_articles);
        if (res1.number_of_self_articles==0){
          var pages = getCurrentPages();
          console.log(pages[0]);
          pages[0].setData({
            actionSheetHidden: !pages[0].data.actionSheetHidden
          })
          console.log("hereme");
          wx.navigateTo({
            url: '/pages/create/create'
          })
          // wx.showToast({
          //   title: '个人文章列表为空',
          //   icon: 'success',
          //   duration: 2000,
          //   success:function(){
          //   }
          // });
          return false;
        }
        else{
          console.log("res1.number_of_self_articles1:");
          console.log(res1.number_of_self_articles);
          wx.navigateTo({
            url: '/pages/detail/detail?hostOpenId=' + userInfo.OpenId
          })
        }
      });
    });
  },
  xuFeiHost: function (e) {
    // console.log("hello world, 现在我把金额传递到后台，进行微信支付吧");
    that=this;
    console.log("e:");
    console.log(e);
    // return false;
    var that = this;
    com.login(function (userInfo) {
      console.log("userInfo:");
      console.log(userInfo);
      hostOpenId = e.currentTarget.dataset.secondhostopenid;
      wx.setStorageSync("hostOpenId", hostOpenId);
      wx.navigateTo({
        url: '/pages/article/xuHost?hostOpenId=' + hostOpenId
      })
      
      return false;
        com.getMyWXPaySpecifiedYuan({ "hello": "world", "hostOpenId": hostOpenId }, function (res1) {
        console.log("res1, here me:");
        console.log(res1);
        var datestr1 = res1.datestr1;
        wx.requestPayment({
          timeStamp: res1.timeStamp,
          nonceStr: res1.nonceStr,
          package: res1.package,
          signType: "MD5",
          paySign: res1.paySign,
          success: function (event) {
            com.setMyWxSuccessPaySpecifiedYuan({ "hello": "world", "hostOpenId": hostOpenId, "datestr1": datestr1 }, function (res2) {
              console.log("后台设置完成，续费成功");
            });
            console.log(event);
            console.log("支付成功");
            wx.showToast({
              title: '支付成功',
              icon: 'success',
              duration: 2000
            });
            e.hidden=true;
          },
          fail: function (error) {
            console.log("支付失败");
            console.log(error);
          },
          complete: function () {
            console.log("支付完成");
          },
        })
      });
    });
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function (data) {
  //   var that = this;
  //   that.setData({ showShare: false, shareIng: false });

  //   var now = new Date();
  //   var exitTime = now.getTime() + 100;
  //   while (true) {
  //     now = new Date();
  //     if (now.getTime() > exitTime)
  //       break;
  //   }

  //   return {
  //     complete: function (res) {
  //       that.setData({ shareIng: false })
  //     }
  //   }
  }
})