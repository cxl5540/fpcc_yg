// pages/pc_set/pc_set.js
import util from '../../utils/util.js';
import http from '../../utils/api.js';
const app = getApp()
Page({
  data: {
    code:''
  },
  onLoad(){
 
  },
  code(e){
    this.setData({
      code:e.detail.value
    })
  },
  submit(){
    if(this.data.code){
      http.team_add({
        data:{
          uid:wx.getStorageSync('uid'),
          invitation_code:this.data.code
        },
        success:res=>{
          if(res.code==200){
            wx.showToast({
              title: res.msg,
              icon: 'success',
            });
            app.globalData.is_sign_out=true;
            setTimeout(res=>{
              wx.navigateBack()
            },1000)  
          }else{
            wx.showToast({
              title: res.msg,
              icon: 'none',
            });
          }
        }
      })
    }else{
      wx.showToast({
        title:'请输入授权码',
        icon: 'none',
      });
    }
  }
})