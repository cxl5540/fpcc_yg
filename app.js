// app.js
App({
  onLaunch() {
    // 展示本地存储能力
   
    // wx.login({
    //   success: res => {     
    //     // 发送 res.code 到后台换取 openId, sessionKey, unionId
    //     if(res.code){
    //       wx.getSetting({
    //         success:res1=> {
    //           if (res1.authSetting['scope.userInfo']){
    //             wx.getUserInfo({ 
    //               success: res2 => { //获取信息                
    //                 wx.request({   //传后台
    //                   url:this.globalData.url,
    //                   method: 'POST',
    //                   header: {
    //                     'content-type': 'application/x-www-form-urlencoded'
    //                   },
    //                   data: {
    //                     action: 'Login/empower_login',
    //                     js_code:res.code,
    //                     encryptedData:res.encryptedData,
    //                     iv:res.iv
    //                   },
    //                   success: res3 =>{
    //                    if(res3.data.code=='200'){
    //                     wx.setStorageSync('uid', res3.data.data.uid);                                     
    //                     if (that.checkLoginReadyCallback){
    //                       that.checkLoginReadyCallback(res3.data.data.uid);
    //                     }
    //                     wx.showToast({
    //                       title: res3.data.msg,
    //                       duration: 2000,
    //                     })
    //                    }else{
    //                     wx.showToast({
    //                       title: res3.data.msg,
    //                       duration: 2000,
    //                       icon: 'none',
    //                     })
    //                    }
    //                   },
    //                   complete:function(){
    //                     wx.hideLoading();
    //                   }
    //                 })
    //               }
    //             })
    //           }
    //         }
    //       })
    //      }
    //   },
    // })
  },
  call(){
    wx.makePhoneCall({
      phoneNumber: '400-009-0352',
      fail:function name(params) {
        
      }
    })
  },
  getwx(params) { //微信客服
    wx.previewImage({
      current:'',
      urls: ['https://tzzs.toommi.com/data/upload/config/tz2.png']
     })
  },
  globalData: {
    is_sign_out:'',
    info:{
      name:'',
      unit:'',
      department:'',
    },
    userInfo:'11',
    url:'https://tzzs.toommi.com/ygapi/Index/apppost',
    urlupload:'https://tzzs.toommi.com/wxapi',
    loadimg:'https://tzzs.toommi.com/'
  //  url:'http://192.168.2.46/invoice/ygapi/Index/apppost', 
  //   loadimg:'http://192.168.2.46/invoice/',
  //   urlupload:'http://192.168.2.46/invoice/wxapi'
  }
})
