Page({
  data: {
    title: '书单',
    bg: null,
    desc: '',
    subject: null,
    content: null,
    subjects: [],
  },


  onLoad: function (options) {
    console.log('books options', options);
    let index = options.index || 0;
    let title = options.title || '书单';
    let year = options.year || 2017;
    let baseUrl = "https://book.douban.com/ithil_j/activity/book_annual" + year + "/widget/";
    let url = baseUrl + index;
    wx.setNavigationBarTitle({ title });
    console.log("==url==", url);

    var that = this
    wx.request({
      url,
      success: res => {
        console.log('===request console.log');
        console.log(res);
        if(res.statusCode == 200){
          let { payload, subject, subjects } = res.data.res;
          let { mobile_background_img, description, title, content } = payload;
          console.log('playload, subject, subjects', payload, subject, subjects);
          that.setData({
            bg: mobile_background_img || '',
            desc: description || '',
            content: content || null,
            title: title || '书单',
            subject: subject || null,
            subjects: subjects || [],
          })
          if (title) {
            wx.setNavigationBarTitle({ title });
          }
        }
      },
      fail: err => {
        console.log('===request fail===');
        console.log(err);
      },
    })
  }
})