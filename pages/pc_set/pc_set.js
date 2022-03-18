// pages/pc_set/pc_set.js
import util from '../../utils/util.js';
import http from '../../utils/api.js';
const app = getApp()
Page({
  data: {
    formData:{
      name:'',tel:'',unit:'',department:''
    },
    unit_list:'',
    unitlist:'',
    bxbmlist:''
  },
  onLoad(options){ 
    this.getdata()
  },
  inputWacth(e){
    let formData = this.data.formData;
    let item = e.currentTarget.dataset.model;
    formData[item] = e.detail.value;
    this.setData({
      formData:formData
    });
  },
  getdata(){
    http.user_edit({
      data:{
        uid:wx.getStorageSync('uid')
      },
      success:res=>{
        if(res.code==200){
            this.setData({
              unit_list:res.data.unit_list,
              unitlist:(res.data.unit_list||[]).map(a=>{
                return a.name;
              }),
              'formData.name':res.data.user_info.name,
              'formData.tel':res.data.user_info.tel,
              'formData.unit':res.data.user_info.unit,
              'formData.department':res.data.user_info.department,
            })    
        }else{
          wx.showToast({
            title: res.msg,
            icon:none
          })
        }
      }
    })
  },
  choose_type(e){
    let formData = this.data.formData;
    let unitlist = this.data.unitlist;
    let unit_list = this.data.unit_list;
    let bxbmlist = this.data.bxbmlist;
    let item = e.currentTarget.dataset.model;
    let type=e.currentTarget.dataset.type;  
    if(item=='unit'){
      formData[item] =unitlist[e.detail.value];
      for(var i=0;i<unit_list.length;i++){
        if(unit_list[i].name==formData.unit){
          http.department_list({
            data:{
              unit_id:unit_list[i].id
            },
            success:res=>{
              wx.hideLoading()
              if(res.code==200){
                this.setData({
                  'bxbmlist':(res.data.department_list||[]).map(a=>{
                    return a.name;
                  })
                })
              }
            }
          })
        }
      }
    }else{
      formData[item] =bxbmlist[e.detail.value];
    }
    this.setData({
      formData:formData
    })
  },
  check(){
    if(!this.data.formData.name){
      this.data.title='请输入个人名字'      
      return false;
    }else if(!this.data.formData.unit){
      this.data.title='请输入所属公司';
      return false;
    }else if(!this.data.formData.department){
      this.data.title='请输入所属部门';
      return false;
    }else{
      return true;
    }
  },
  submit(){ //提交
    if(this.check()){
      http.user_runedit({
        data:{
          uid:wx.getStorageSync('uid'),
          name:this.data.formData.name,
          unit:this.data.formData.unit,
          department:this.data.formData.department,
        },
        success:res=>{
          if(res.code==200){ 
            const pages = getCurrentPages()
            const prevPage = pages[pages.length-2] 
            prevPage.setData({
              'info.name':this.data.formData.name,
              'info.unit':this.data.formData.unit,
              'info.department':this.data.formData.department,
            });                    
            wx.showToast({
              title: res.msg,
              success:function(){
                setTimeout(
                  function(params) {
                    wx.navigateBack()
                },1000)              
              }
            })
          }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
          }
        }
      })
    }else{
      wx.showToast({
        title: this.data.title,
        icon:'none'
      })
    }
  },
})