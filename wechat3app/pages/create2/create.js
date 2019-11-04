// create.js
var com = require("../../utils/common.js");
var utils = require("../../utils/util.js");
var isFirst = true;
var fileId = 123;
var isuploading = false;
var hasimg=0;

Page({

  /**
   * 页面的初始数据
   */
  data: {
    userinfo: null,
    account: { balance: 0 },
    statistics: null,
    isAgree: true,
    totailCheckCount: null,
    amount: null,
    useBalance: true,
    balanceAmount: "0.00",
    payAmount: '0.00',
    content: "",
    defaultValue: "",
    fileIds: [],
    files: [],
    vs: true
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    console.log("start in hasimg:" + hasimg);
    hasimg=0;
    try {
      console.log("删除已经设置的articleID");
      wx.removeStorageSync("articleID");
      wx.removeStorageSync("myfilenameid");
    } catch (e) {

    }
    // if (!isFirst) { return; }
    // this.loadData();
    // console.log("hello world, now 编辑文章并上传照片");
    // com.login(function (userInfo) {
    //   console.log("userInfo:");
    //   console.log(userInfo);
    //   com.publishArticle({ "hello": "world", "articleContent": "进入文章界面，就有一个ID号" }, function (res1) {
    //     console.log("res1, here me:");
    //     console.log(res1);
    //     wx.setStorageSync("articleID", res1.Id);
    //     wx.setStorageSync("myfilenameid", 0);
    //   });
    //   // wx.redirectTo({ url: "/pages/article/generateArticle" })
      // wx.redirectTo({ url: "/pages/create/create" })
    // });
},

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  loadData: function () {
    var that = this;
    com.login(function (userInfo) {
      //that.setData({ userInfo: userInfo });
      com.getMyAccount(function (res) {
        com.getMyAccountStatistics(function (statistics) {
          isFirst = false;
          that.setData({
            userInfo: userInfo,
            account: res.data,
            statistics: statistics.data,
            vs: com.getVs()
          });
        })
      })
    });
  },
  resetInfoData: function () {
    this.setData({
      amount: null,
      useBalance: true,
      balanceAmount: "0.00",
      payAmount: '0.00',
      content: "",
      defaultValue: "",
      fileIds: [],
      files: {}
    });
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    if (isFirst) { return; }
    this.loadData();
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
  showTopTips: function () {
    var that = this;
    this.setData({
      showTopTips: true
    });
    setTimeout(function () {
      that.setData({
        showTopTips: false
      });
    }, 3000);
  },
  bindInput: function (e) {
    var d = {};
    d[e.currentTarget.id] = e.detail.value;
    this.setData(d);
    var balance = this.data.account.balance;
    var amount = parseFloat(this.data.amount);
    if (isNaN(amount)) {
      this.setData({ balanceAmount: "0.00", payAmount: "0.00" });
      return;
    }
    var useBalance = this.data.useBalance;
    if (useBalance) {
      if (amount < balance) {
        this.setData({ balanceAmount: amount.toFixed(2), payAmount: "0.00" });
      } else {
        this.setData({ balanceAmount: balance.toFixed(2), payAmount: (amount - balance).toFixed(2) });
      }
    } else {
      this.setData({ balanceAmount: "0.00", payAmount: amount.toFixed(2) });
    }
  },
  chooseImage: function (e) {
    var that = this;
    wx.chooseImage({
      count: 9 - utils.count(this.data.files),
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
        var newFiles = [];
        var ids = [];
        // for (var i = 0; i < res.tempFilePaths.length; i++) {
        for (var i = res.tempFilePaths.length-1; i >=0 ; i--) {
          var path = res.tempFilePaths[i];
          fileId = fileId + 1;
          ids.push("f" + fileId);
          var file = {
            fileId: "f" + fileId,
            temppath: path,
            isupload: false,
            progress: 0,
            realpath: null,
            error: false
          };
          var fileData = {};
          fileData["files." + file.fileId] = file;
          that.setData(fileData);
        }
        var fileIds = that.data.fileIds.concat(ids);
        that.setData({ fileIds: fileIds });
        that.doUpload();
      }
    })
  },
  doUpload: function () {
    if (isuploading) { return; }
    isuploading = true;
    var that = this;
    var currentUploadFile = null;
    var keys = that.data.fileIds;
    for (var i = 0; i < keys.length; i++) {
      var file = that.data.files[keys[i]];
      if (file != null && !file.isupload) {
        currentUploadFile = file;
      }
    }
    if (currentUploadFile == null) {
      isuploading = false;
      return;
    }
    var fileId = currentUploadFile.fileId;
    console.log("fileId:"+fileId);
    com.uploadImage(currentUploadFile.temppath, function (uploaddata) {
      console.log("uploaddata11:\n");
      console.log(uploaddata);
      var files = that.data.files;
      var old = files[fileId];
      var newData = {};
      if (uploaddata.state == 0) {
        newData["files." + fileId + ".isupload"] = true;
        newData["files." + fileId + ".realpath"] = uploaddata.url;
        //old.isupload = true;
        //old.realpath = uploaddata.url;
      } else {
        newData["files." + fileId + ".isupload"] = true;
        newData["files." + fileId + ".error"] = true;
        //old.isupload = true;
        //old.error = true;
        wx.showToast({
          title: uploaddata.message
        })
      }
      that.setData(newData);
      isuploading = false;
      hasimg++;
      that.doUpload();

    }, function (pro) {
      var files = that.data.files;
      var old = files[fileId];
      var setData = {};
      setData["files." + fileId + ".progress"] = pro.progress
      that.setData(setData);
    });
  },
  previewImage: function (e) {
    var urls = [];
    for (var i = 0; i < this.data.fileIds.length; i++) {
      urls.push(this.data.files[this.data.fileIds[i]].temppath);
    }

    wx.previewImage({
      current: this.data.files[e.currentTarget.id].temppath, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  removeImage: function (e) {
    var file = this.data.files[e.currentTarget.id];
    if (file.isupload) {
      var fileIds = this.data.fileIds;
      var index = fileIds.indexOf(e.currentTarget.id)
      fileIds.splice(index, 1);
      this.setData({ fileIds: fileIds });
      var data = {};
      data["files." + e.currentTarget.id] = null;
      this.setData(data);
    }
  },
  //20190819加上三种状态信息
  updatearticle: function (e) {
    console.log("hereme");
        wx.showModal({
          title: '提示',
          content: '尚未进行授权，请点击确定跳转到授权页面进行授权。',
          success: function (res) {
            if (res.confirm) {
              console.log('用户点击确定')
              wx.redirectTo({
                url: '/pages/tologin/tologin',
              })
            }
          }
        })
  },

  //20190819之前更新文章
  // updatearticle:function(){
  //   var that = this;
  //   var d = this.data;
  //   var articleID = wx.getStorageSync('articleID');
  //   console.log("content:"+d.content+", articleID:"+articleID+", hasimg:"+hasimg);
  //   wx.getLocation({
  //     type: 'wgs84',
  //     success: function (res) {
  //     // console.log(res);
  //     var latitude = res.latitude
  //     var longitude = res.longitude
  //     //弹框
  //     // wx.showModal({
  //     //   title: '当前位置',
  //     //   content: "纬度:" + latitude + ",经度:" + longitude,
  //     // })

  //     if(hasimg==0 && d.content==""){
  //       wx.showToast({
  //         title:"内容不能为空",
  //         icon:'loading',
  //         duration:1000,
  //         mask:true
  //       });
  //       return false;
  //     }

  //       com.updateArticleContent({ "articleId": articleID, "articleContent": d.content, "latitude":latitude, "longitude": longitude }, function (res1) {
  //       console.log("res1, here me:");
  //       console.log(res1);
  //       if (res1.errmsg!='ok') {
  //         wx.showToast({
  //           title: "内容含有违法违规内容",
  //           icon: 'loading',
  //           duration: 1000,
  //           mask: true
  //         });
  //         return false;
  //       }
  //       wx.setStorageSync("hostOpenId", "all");
  //       var frominside = wx.getStorageSync('frominside');
  //       frominside=1;
  //       wx.setStorageSync("frominside", frominside);
  //       // // wx.navigateTo({
  //       wx.navigateBack({
  //       });//({ url: "/pages/detail/detail" });
  //       // wx.navigateTo({
  //       //   url: '/pages/Index/Index',
  //       // })
  //     });
  //       }
  //   });
  // },
  save: function () {
    var that = this;
    var d = this.data;
    var urls = [];
    for (var i = 0; i < this.data.fileIds.length; i++) {
      var file = this.data.files[this.data.fileIds[i]];
      if (file.isupload) {
        urls.push(this.data.files[this.data.fileIds[i]].realpath);
      }
    }
    var data = {
      amount: parseInt(d.amount * 100),
      useBalance: d.useBalance,
      balanceAmount: parseInt(utils.floatMul(parseFloat(d.balanceAmount), 100)),
      payAmount: parseInt(utils.floatMul(parseFloat(d.payAmount), 100)),
      content: d.content,
      images: urls,
      totailCheckCount: parseInt(d.totailCheckCount)
    };
    com.newOrder(data, function (d) {
      if (d.error) {
        wx.showToast({
          title: d.error,
          icon: 'success',
          duration: 2000,
          complete: function () {
          }
        })
      } else {
        var data = d.data;
        if (data.isPayed) {
          wx.showToast({
            title: "支付成功",
            icon: 'success',
            duration: 1500,
            complete: function () {
              setTimeout(function () {
                that.resetInfoData();
                wx.navigateTo({
                  url: '/pages/detail/detail?id=' + data.shareId
                })
              }, 2000);
            }
          })
        } else {
          data.success = function () {
            com.payOrder(data.orderId, function (paydata) {
              if (paydata.data) {
                wx.showToast({
                  title: "支付成功",
                  icon: 'success',
                  duration: 3000,
                  complete: function () {
                    setTimeout(function () {
                      that.resetInfoData();
                      wx.navigateTo({
                        url: '/pages/detail/detail?id=' + data.shareId
                      })
                    }, 2000);
                  }
                })
              }
            });
          };
          data.fail = function () {
            com.cancelOrder(data.orderId, function () {

            });
          }
          wx.requestPayment(data);
        }
      }
    });
  },
  bindAgreeChange: function (e) {
    this.setData({ isAgree: e.detail.value == "false" });
  },
  readterms: function (e) {
    this.setData({ isAgree: true });
  },
  bindGetUserInfo: function (e) {
    var that = this;
    //此处授权得到userInfo
    console.log(e.detail.userInfo);
    //接下来写业务代码
    wx.redirectTo({ url: "/pages/Index/Index?scene=all" })
    //最后，记得返回刚才的页面
    // wx.navigateBack({
    //   delta: 1
    // })
  }
})