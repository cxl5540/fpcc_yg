// index.js
// 获取应用实例
import util from '../../utils/util.js';
import http from '../../utils/api.js';
const app = getApp()
//import util from "../../utils/util"
Page({
  data: {
    info:'',
    uid:'',
    userInfo: {},
    hasUserInfo: false,
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    canIUseGetUserProfile: false,
    canIUseOpenData:  wx.canIUse('open-data.type.userAvatarUrl') && wx.canIUse('open-data.type.userNickName'), // 如需尝试获取用户信息可改为false
    list:[
      {ti:'账号设置',del:'修改我的个人账号信息',img_u:'grzx_icon2@2x.png',url:'/pages/pc_set/pc_set'},
      {ti:'团队绑定管理',del:'加入或修改我的团队绑定信息。',img_u:'grzx_yg2.png',url:'/pages/pc/pc'},
      {ti:'发票数据统计',del:'统计每月发票数量和审核金额',img_u:'gezx_icon4@2x.png',url:'/pages/jingxdk_list/jingxdk_list'},
      {ti:'在线客服',del:'在线解答软件使用问题、意见反馈等。',img_u:'grzx_yg4.png',url:''},     
      {ti:'分享给朋友',del:'将小程序《电子台账助手》分享给朋友',img_u:'grzx_yg5.png',url:''},
      {ti:'切换至会计端',del:'切换至会计端小程序《电子台账助手》',img_u:'gezx_icon9.png',url:''},
      {ti:'清除缓存',del:'清空本地缓存，并重新加载单位和人员数据。',img_u:'grzx_yg6.png',url:''},
    ]
  },
  onLoad() {
    if(wx.getStorageSync('uid')){
      this.setData({
        uid:wx.getStorageSync('uid')
      });
     // this.getinfo(wx.getStorageSync('uid'))
    }
  },
  onShow(){
    if(wx.getStorageSync('uid')){
      this.setData({
        uid:wx.getStorageSync('uid')
      })
       this.getinfo(wx.getStorageSync('uid'))
    } 
    if(wx.getStorageSync('tel')){
      this.setData({
        tel:wx.getStorageSync('tel')
      })
    }
    if(wx.getStorageSync('url')){
      this.getinfo(wx.getStorageSync('uid'));
      wx.removeStorageSync('url')
    }
  },
  editname(){ //编辑名称
    let that=this;    
    wx.showModal({
      title: '编辑',
      placeholderText: '输入个人姓名',
      editable:true,
      success (res) {     
        if (res.confirm) {
          that.submit(res.content)
          that.setData({
            'info.name':res.content,
          })
        } else if (res.cancel) {
    
        }
      }
    })
  },

  submit(name){ //提交个人姓名
      http.user_runedit({
        data:{
          uid:wx.getStorageSync('uid'),
          name:name,
          unit:this.data.info.unit,
          department:this.data.info.department,
        },
        success:res=>{
          if(res.code==200){                 
            wx.showToast({
              title: res.msg,
            })
          }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
          }
        }
      })
  },
  getinfo(uid){//获取个人信息
    http.getuser_info({
      data:{
        uid:uid
      },
      success:res=>{
        this.setData({
          info:res.data.user_info,
          tel:res.data.user_info.tel
        });
        app.globalData.is_perfect=res.data.user_info.is_perfect,
        app.globalData.is_sign_out=res.data.user_info.team.is_sign_out 
        wx.setStorageSync('tel',res.data.user_info.tel);
      }
    })
  },
  navurl(e){ //跳转
    var url=e.currentTarget.dataset.url;
    var index=e.currentTarget.dataset.index; 
    if(index==1&&app.globalData.is_sign_out){
      wx.navigateTo({
        url: '/pages/fp_tt_people/fp_tt_people',
      })
      return false;
    }else if(index==1&&!app.globalData.is_sign_out || index==0&&!app.globalData.is_sign_out){
      wx.navigateTo({
        url: '/pages/pc/pc',
      })
      return false;
    }else if(index==0&&app.globalData.is_perfect==1){
      wx.navigateTo({
        url: '/pages/pc_set/pc_set',
      })
      return false;
    }
   
    if(url){
      wx.navigateTo({
        url: url,
      })
    }
    if(index==6){
      wx.switchTab({
        url: '/pages/index/index',
      })
    }  
    if(index==5){
      wx.navigateToMiniProgram({
        appId: 'wx78cd18d3fd086861', // 要跳转的小程序的appid
        path: 'pages/index/index', // 跳转的目标页面
            extarData: {
              open: 'auth'
            },
            success(res) {
              // 打开成功  
            }
      }) 
    }
  },
  concat(){ //联系客服
    wx.openCustomerServiceChat({
      extInfo: {
        url: 'https://work.weixin.qq.com/kfid/kfc5722870690518a82'
      },
      corpId: 'ww0ca5c38bf1d4d086',
      success(res) {
        console.log(res);
      },
      fail(res) {
        console.log(res);
      }
    })
  },
  add_team(){ //加入其他团队
    if(!this.data.info.team.is_sign_out){
      let that=this;    
      wx.showModal({
        title: '加入团队',
        placeholderText: '请输入邀请码',
        editable:true,
        success (res) {     
          if (res.confirm) {
             that.add_submit(res.content)     
          } else if (res.cancel) {
      
          }
        }
      })
    }
    
  },
  add_submit(invitation_code){ //提交团队
    http.team_add({
      data:{
        uid:wx.getStorageSync('uid'),
        invitation_code:invitation_code
      },
      success:res=>{
        if(res.code==200){
          wx.showToast({
            title: res.msg,
            icon: 'success',
          });
          this.setData({
            'info.team.is_sign_out':true,          
          })
          app.globalData.is_sign_out=true  
        }else{
          wx.showToast({
            title: res.msg,
            icon: 'none',
          });
        }
      }
    })
  },
  team_sign_out(){ //退出团队
      http.team_sign_out({
        data:{
          uid:wx.getStorageSync('uid'),
        },
        success:res=>{       
          wx.showToast({
            title: res.msg,
            icon: 'none',
          });
          this.setData({
            'info.team.is_sign_out':false
          })
          app.globalData.is_perfect=1,
           app.globalData.is_sign_out=false 
        }
      })
  },
  esc_team(){ //退出团队
    let that=this;
    if(this.data.info.team.is_sign_out){
      util.showmodel('提示','确认是否退出团队?').then(function(data){
        if(data){
          that.team_sign_out()
        }
      })
    }
    
  },
  getUserProfile(e){ //授权
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        console.log(res)
        util.login(res.encryptedData,res.iv);
        util.checkLoginReadyCallback = res => {
          this.setData({
            uid: res,
          })
          this.getinfo(res)
        }               
      }
    })
  },
  getPhoneNumber: function (e) {  //电话授权
    var that = this;
    if (e.detail.errMsg == "getPhoneNumber:ok") {
      wx.request({
        url: app.globalData.url,
        data: {
          action: 'Login/empower_mobile',
          encryptedData: e.detail.encryptedData,
          iv: e.detail.iv,
          uid: this.data.uid,
        },
        method: "post",
        success: function (res) {
          if(res.data.code=='200'){
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: 'success',
            });
            wx.setStorageSync('tel', res.data.data.tel);
            console.log(res.data.data.tel)
            that.setData({
              tel:res.data.data.tel,
            })
          }else{
            wx.showToast({
              title: res.data.msg,
              duration: 2000,
              icon: 'none',
            });
          }        
        },
        complete:function(){
          wx.hideLoading();
        }
      })
    }
  },
  cl_fun(){
     util.showmodel('11','333').then(function(data){
       console.log(data)
     })
   
  }
})
