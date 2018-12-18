Page({
  data: {
    // text:"这是一个页面"
    data: [],
    booklist: [],
    winHeight: 0,   // 设备高度
    years: [2015,2016,2017],
    index: 2,
    year: 2017,
    // title: "我的首页",

    // 弹窗
    modalHidden: true,
    modalValue: null,

    /**
     * 分享配置
     */
    shareShow: 'none',
    shareOpacity: {},
    shareBottom: {},

  },

  navPage: function (param) {
    console.log('nav page', param);
    let {target} = param || {};
    let {dataset} = target || {};
    let {index=0, title=''} = dataset;
    wx.navigateTo({
      url: '../books/books?index='+index +'&year='+ this.data.year +'&title='+title,
    })
  },

  bindPickerChange: function (e) {
    console.log('picker发送选择改变，携带值为', e.detail.value)
    let i = e.detail.value;
    let y = this.data.years[i];
    this.setData({
      index: i,
      year: y,
    })
    this.loadBooks(y);
  },

  loadBooks: function(year) {
    var that = this
    wx.request({
      url: 'https://book.douban.com/ithil_j/activity/book_annual' + year,
      success: res => {
        console.log('===request console.log');
        console.log(res.data.res.widget_infos);
        let list = res.data.res.widget_infos.map((item, index) => {
          let { id, title } = item;
          return { id, title, index };
        });
        console.log('===book list:', list);
        that.setData({
          booklist: list,
        });
      },
      fail: err => {
        console.log('===request fail===');
        console.log(err);
      },
    })
  },

  onLoad: function (options) {
    // 页面初始化 options 为页面跳转所带来的参数
    var self = this;
    this.loadBooks(this.data.year);
    
    /**
     * 获取系统信息
     */
    wx.getSystemInfo({

      success: function (res) {
        self.setData({
          winWidth: res.windowWidth,
          winHeight: res.windowHeight
        });
      }
    });

  },
  /**
   * 显示分享
   */
  showShare: function (e) {

    // 创建动画
    var animation = wx.createAnimation({
      duration: 100,
      timingFunction: "ease",
    })
    this.animation = animation;

    var that = this;
    that.setData({
      shareShow: "block",
    });

    setTimeout(function () {
      that.animation.bottom(0).step();
      that.setData({
        shareBottom: animation.export()
      });
    }.bind(this), 400);

    // 遮罩层
    setTimeout(function () {
      that.animation.opacity(0.3).step();
      that.setData({
        shareOpacity: animation.export()
      });
    }.bind(this), 400);

  },

  /**
   * 关闭分享
   */
  shareClose: function () {
    // 创建动画
    var animation = wx.createAnimation({
      duration: 0,
      timingFunction: "ease"
    })
    this.animation = animation;

    var that = this;

    setTimeout(function () {
      that.animation.bottom(-210).step();
      that.setData({
        shareBottom: animation.export()
      });
    }.bind(this), 500);

    setTimeout(function () {
      that.animation.opacity(0).step();
      that.setData({
        shareOpacity: animation.export()
      });
    }.bind(this), 500);

    setTimeout(function () {
      that.setData({
        shareShow: "none",
      });
    }.bind(this), 1500);
  },

  /**
   * 关闭弹出层
   */
  modalChange: function (e) {
    var that = this;
    that.setData({
      modalHidden: true
    })
  },

  onReady: function () {
    // 页面渲染完成
    // 修改页面标题
    var  pageTitle = '豆瓣年度书单'
    if(this.data && this.data.data && this.data.data.title){
      pageTitle = this.data.data.title;
    }
    wx.setNavigationBarTitle({
      title: pageTitle
    })


  },
  onShow: function () {
    // 页面显示
  },
  onHide: function () {
    // 页面隐藏
  },
  onUnload: function () {
    // 页面关闭
  }
})