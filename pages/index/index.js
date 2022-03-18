// index.js
// 获取应用实例
import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    imgList:[
     {url:"sy_banner@2x.png",id:1},
    ],
    numList:[
      {title:'待审核发票',num:0,url:'/pages/fapiao_dsh/fapiao_dsh'},
      {title:'待处理发票',num:0,url:'/pages/fapiao_dbj/fapiao_dbj'},
    ],
    path:'',
    filename:'',
    show:false,
    result:'',
    uid:'',
    tel:'',
    is_sign_out:'',
    is_perfect:'',
    is_photograph:'',
    user_info:''
  },
  // 事件处理函数
  bindViewTap() {
 
  },
  onLoad() {
    if(wx.getStorageSync('uid')){
      this.setData({
        uid:wx.getStorageSync('uid')
      });
    //  this.getinfo(wx.getStorageSync('uid'))
    }
  },
  onShow() {
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
  },
  getinfo(uid){//获取个人信息
    http.getuser_info({
      data:{
        uid:uid
      },
      success:res=>{
        this.setData({
          user_info:res.data.user_info,
          tel:res.data.user_info.tel,
          is_photograph:res.data.user_info.team.is_photograph,
          'numList[0].num':res.data.user_info.team.examine_count,
          'numList[1].num':res.data.user_info.team.handle_count,
        }); 
        app.globalData.is_perfect=res.data.user_info.is_perfect,
        app.globalData.is_sign_out=res.data.user_info.team.is_sign_out    
        wx.setStorageSync('tel',res.data.user_info.tel);
      }
    })
  },
 check(){
  if(!this.data.user_info.team.is_sign_out){
    wx.navigateTo({
      url: '/pages/pc/pc',
    })
    return false;
  }else if(this.data.user_info.is_perfect==1){
    wx.setStorageSync('url','index');
    wx.navigateTo({
      url: '/pages/pc_set/pc_set',
    })
    return false;
   }else{
     return true
   }
 },
  chooseInvoice(){ //卡包    
    if(this.check()){
      let that=this;
      wx.chooseInvoice({
        success(res){
          var invoiceInfo=JSON.parse(res.invoiceInfo)
          if(invoiceInfo.length>1){
            wx.showToast({
              title: '只能导入一张发票',
              icon:'none'
            })
          }else{
            console.log(invoiceInfo)
            var card_id=invoiceInfo[0].card_id;
            var encrypt_code=invoiceInfo[0].encrypt_code;
            if(card_id&&encrypt_code){
             // that.getdata(access_token,card_id,encrypt_code)
              http.invoice_card_bag_import({
                data:{
                  card_id:card_id,
                  encrypt_code:encrypt_code
                },
                success:res0=>{
                  if(res0.code==200){
                    var data_k=res0.data;               
                    http.invoice_check_duplicate({
                      data:{
                        type:3,
                        invoice_code:res0.data.user_info.billing_no,
                        invoice_num:res0.data.user_info.billing_code,
                        uid:wx.getStorageSync('uid')     
                       },
                       success:res1=>{
                        that.setData({
                          show:false
                        })
                         if(res1.data.check_status==true){
                           wx.navigateTo({
                             url: '/pages/repeat/repeat?type=3'+'&invoice_code='+res1.data.invoice_info.invoice_code+'&invoice_num='+res1.data.invoice_info.invoice_num,
                           })
                         }else{
                          wx.navigateTo({
                            url: "/pages/shoug_lr/shoug_lr?kabao="+encodeURIComponent(JSON.stringify(data_k)),
                          })
                         }
                       }
                    })
                  }
                }
              })
  
            }
          }              
        }
      })
    }
    
  },
  uploadpdf(){  //上传原件pdf  
      let that=this;
      wx.chooseMessageFile({
        count:1,  //能选择文件的数量
        type: 'file', //能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
        extension: ['pdf','ofd'],
        success(res) { 
        var path = res.tempFiles[0].path; 
        wx.navigateTo({
          url: '/pages/shoug_lr/shoug_lr?pdf='+path,
        })       
        }
       }) 
  },

  shoug_lr(){ //手工录入   
    if(this.check()){
      wx.navigateTo({
        url: '/pages/shoug_lr/shoug_lr',
      })
    }
    
  },
  getScancode: function () { //扫码
    if( this.check()){
      var _this = this; 
      wx.scanCode({
        success: (res) => {
          var result = res.result;
          _this.invoice_check_duplicate(result)
          _this.setData({
            result: result,
          })
        }
      })
    }
    
  },
  invoice_check_duplicate(qr_code_str){ //发票查重
    http.invoice_check_duplicate({
      data:{
        type:1,
        qr_code_str:qr_code_str,
        uid:wx.getStorageSync('uid')     
       },
       success:res=>{
         if(res.data.check_status==true){
           wx.navigateTo({
             url: '/pages/repeat/repeat?qr_code_str='+qr_code_str+'&type='+1,
           })
         }else{
          wx.navigateTo({
            url: '/pages/shoug_lr/shoug_lr?ewm='+qr_code_str,
          })
         }
       }
    })    
  },
  camera(){ //发票识别   
  if( this.check()){
    if(this.data.is_photograph==2){
      var operation_type=1;
      this.operation_verify(1)
    }else{
      wx.showToast({
        title: '管理员暂未开放权限',
        icon:'none'
      })
    }
  } 
  },
  operation_verify(operation_type){ //权限设置
    if(this.check()){
    http.operation_verify({
      data:{
        uid:wx.getStorageSync('uid'),
        operation_type:operation_type==1?1:2
      },
      success:res=>{
        if(res.code==200){
          if(operation_type==1){
            this.camera_sbmit(); //发票识别
          }else{
            this.uploadpdf(); //导入pdf
          }
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          })
          return false;
        }
      }
    })
  }
  },
  camera_sbmit(){  //发票识别
    let _this=this;
    wx.showActionSheet({
      itemList: ['拍照', '从相册中选择'],
      success (res) {
        if (res.tapIndex == 0) {
          util.chooseWxImage('camera')
            util.checkRes=res=>{
              console.log(res)
              _this.setData({
                src:res,
              })
              _this.uploadpic(res[0])
            }
          } else if (res.tapIndex == 1) {
            util.chooseWxImage('album');
            util.checkRes=res=>{
              _this.setData({
                src:res,
              })
              _this.uploadpic(res[0])
            }
          }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  uploadpic(src){ //上传文件
    wx.showLoading({
      title: '加载中...',
      mask:true
    });
    var that = this;
    wx.uploadFile({
      url: app.globalData.urlupload+'/Invoice/upload', //仅为示例，非真实的接口地址
      filePath:src,
      name: 'pic',//示例，使用顺序给文件命名
      success:function(e){
        var res=JSON.parse(e.data);  
        if(res.code==200){ 
          
          wx.navigateTo({
            url: '/pages/shoug_lr/shoug_lr?pic='+res.data+'&src='+src,
          })
          //  that.invoice_identification(res.data)          
        }else{
          wx.showToast({
            title: res.msg,
            icon:'none'
          }) 
        }  
      },
      fail:function(e){     
      },
      complete:function(e){     
      }
    })
},
  getUserProfile(e){ //授权
    console.log(e)
    wx.getUserProfile({
      desc: '用于完善会员资料', // 声明获取用户个人信息后的用途，后续会展示在弹窗中，请谨慎填写
      success: (res) => {
        util.login(res.encryptedData,res.iv)
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

})
