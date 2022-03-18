// pages/kaifapiao/kaifapiao.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list:[{
      title:'某某某某某科技有限公司',
      dm:'000000000000',
      hm:'0000000',
      se:'500.10',
      stutas:1,
      tjr:'张三',
      sj:'2021-11-18',
      yj:1
    },{
      title:'某某某某某科技有限公司',
      dm:'000000000000',
      hm:'0000000',
      se:'500.10',
      stutas:2,
      tjr:'张三',
      sj:'2021-11-18',
      yj:2
    }],
    triggered:false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  kaipiao_list(){ //开票记录
    wx.navigateTo({
      url: '/pages/kaipiao_list/kaipiao_list',
    })
  },
  kaifapiao_edit(){ //编辑开发票
    wx.navigateTo({
      url: '/pages/kaifapiao_edit/kaifapiao_edit',
    })
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

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})