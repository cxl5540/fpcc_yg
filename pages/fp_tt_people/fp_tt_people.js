// index.js
// 获取应用实例
import util from '../../utils/util.js';
import http from '../../utils/api.js';
const app = getApp()
//import util from "../../utils/util"
Page({
  data: {
   list:''
  },
  onLoad() {
    this.getdata()
  },
 getdata(){
   http.finance_list({
     data:{
       uid:wx.getStorageSync('uid')
     },
     success:res=>{
       if(res.code==200){
        this.setData({
          list:res.data.finance_list
        })
       }
       
     }  
   })
 }
})
