// pages/Index/Index.js
var com = require("../../utils/common.js");
var utils = require("../../utils/util.js");

Page({

  /**
   * 页面的初始数据
   */
  data: {
    vs: false,
    changed: false,
    shouquandengluhidden:true,
    content: ""
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var pages=getCurrentPages();
    var url1 = pages[pages.length - 1].route;
    var options1 = pages[pages.length - 1].options;
    console.log("current page url:" + url1);
    console.log(options1);

    var that = this;

    wx.getUserInfo({
      success:function(res1){
        com.login(function (userInfo) {
          com.getClientArticleCurrentDayNumbers({ "hello": "world", "userOpenId": userInfo.OpenId }, function (res) {
            console.log("index hello world2 res:");
            console.log(res);
            var myTIME1 = utils.formatTime(new Date());
            console.log("myTIME1:" + myTIME1);
            if (res.number_of_current_day_self_articles==0){
              wx.redirectTo({ url: "/pages/create/create" });
            }else{
              wx.redirectTo({ url: "/pages/detail/detail" });
            }
            return false;
          });
        });
      },
      fail:function(res1){
        wx.redirectTo({ url: "/pages/create2/create" });
      }
    });
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
  },
  
  getUserInfo:function(res1){
    // console.log("here me res1:");
    // console.log(res1);
    var that=this;
    wx.redirectTo({ url: "/pages/create/create" });
    // wx.getUserInfo({
    //   success:function(res2){
    //     // console.log("res2:");
    //     // console.log(res2);
    //     //20190819将文章发表迁往首页
    //     wx.redirectTo({ url: "/pages/create/create" });

    //     // if (hostOpenId == "all") {
    //     //   // wx.redirectTo({ url: "/pages/article/articleList" });
    //     //   // wx.redirectTo({ url: "/pages/detail/detail?hostOpenId=all" });
    //     // } else {
    //     //   // wx.redirectTo({ url: "/pages/article/payHost" });
    //     // }
    //   },
    //   fail:function(res3){
    //     // console.log("res3:");
    //     // console.log(res3);
    //   }
    // })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

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
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },
  bindInput: function (e) {
    var d = { changed: true };
    d[e.currentTarget.id] = e.detail.value;
    this.setData(d);
  },


  save: function (e) {
    var d = { changed: false };
    this.setData(d);
    wx.setStorage({
      key: 'content',
      data: this.data.content,
      success: function () {
        wx.showToast({
          title: '保存成功',
        })
      }
    })
  },
  gosleep: function (e) {
    wx.showModal({
      confirmText: "我发誓",
      cancelText: "再玩会吧",
      content: "真的要睡觉了么？你敢发誓么？",
      success: function (res) {
        if (res.confirm) {
          wx.showToast({
            title: '晚安',
            icon: 'success',
            duration: 1500,
            complete: function () {
              setTimeout(function () {
                wx.navigateBack({ delta: 1 });
              }, 1500);
            }
          })
        } else if (res.cancel) {
          wx.showToast({
            title: '拜拜',
            icon: 'none',
            duration: 1500,
            complete: function () {
              setTimeout(function () {
                wx.navigateBack({ delta: 1 });
              }, 1500);
            }
          })
        }
      }
    });
  }
})