import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    year:'',
    invoice_id:'',
    user_info:'',
    invoice_info:'',
    script_path:'',
    src:[],
  },
  onLoad: function (options) {
    this.setData({
      year:options.year,
      invoice_id:options.id
    })
    this.getdata();
  },
  getdata(){  //获取数据
    http.invoice_edit({
      data:{
        uid:wx.getStorageSync('uid'),
        year:this.data.year,
        invoice_id:this.data.invoice_id
      },
      success:res=>{
        if(res.code==200){
          var invoice_verify_info=res.data.invoice_info
          this.setData({
            user_info:res.data.user_info,
            invoice_info:res.data.invoice_info
          })
          if(invoice_verify_info.script_path){
            var script_path=invoice_verify_info.script_path;
            if(script_path.substring(script_path.length - 3)=='pdf'||script_path.substring(script_path.length - 3)=='odf'){
              this.setData({
                script_path:invoice_verify_info.script_path
              })
            }else{
              this.setData({
                src:[app.globalData.loadimg+invoice_verify_info.script_path],
              })         
            }
          }
        }else{
          wx.showToast({
            title:res.msg,
            icon:'none'
          })
        }
      }
    })
  },
  verify_see(){ //查看验真
    if(this.data.invoice_info.is_verification!==1){
      wx.navigateTo({
        url: '/pages/fapiao_dsh_pass/fapiao_dsh_pass?year=2022'+'&invoice_id='+this.data.invoice_id,
      })
    }else{
      wx.showToast({
        title: '该发票还未验真',
        icon:'none'
      })
    }
  },
  back(){
    wx.navigateBack();
  },
  clickImg(){  //预览文件
    if(this.data.src.length){
      wx.previewImage({
        current:this.data.src,
        urls: this.data.src
      })  
     }
    },
  clickImg_yj(){
    let that=this;
    wx.downloadFile({
      url:app.globalData.loadimg+that.script_path,
      success: function (res) {
        const filePath = res.tempFilePath
        wx.openDocument({
          filePath: filePath,
          success: function (res) {
            console.log('打开文档成功')
          }
        })
      }
    })
  },
})