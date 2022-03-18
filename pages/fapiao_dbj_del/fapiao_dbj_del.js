import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    src:[],
    st_date:'',
    date:'',
    file:'',  
    formData:{
      sl:0,dm:'',hm:'',jym:'',je:'',se:'', hj:'',xfmc:'',xfsbh:'',gfmc:'',gfsbh:'',bxry:'',bxgs:'',bxbm:'',
      bxpz:'',zy:'',fylx:'',bz:'',scry:'',lrsj:'',shyj:'',cwry:''
    },
    flag:false,
    info:'',
    infolist:'',
    bxbmlist:'',
    invoice_info:'',
    user_info:'',
    year:'',
    invoice_id:'',
    script_path:''
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
          var invoice_verify_info=res.data.invoice_info;
          invoice_verify_info.tax_rate=invoice_verify_info.tax_rate.substring(0,invoice_verify_info.tax_rate.length - 1);
          this.setData({
            infolist:res.data.basic_info.purchaser_name_list,
            'info.seller_name_list':(res.data.basic_info.seller_name_list||[]).map(a=>{
              return a.name;
            }),
            'info.expense_type_list':(res.data.basic_info.expense_type_list||[]).map(a=>{
              return a.name;
            }),
            'info.reimbursement_personnel_list':(res.data.basic_info.reimbursement_personnel_list||[]).map(a=>{
              return a.name;
            }),
            'info.purchaser_name_list':(res.data.basic_info.purchaser_name_list||[]).map(a=>{
              return a.name;
            }),
            'info.invoice_type_list':res.data.basic_info.invoice_type_list,
            'info.tax_rate_list':res.data.basic_info.tax_rate_list,
              'formData.lx':invoice_verify_info.invoice_type,
              'formData.je':invoice_verify_info.total_amount,
              'formData.se':invoice_verify_info.total_tax,
              'formData.sl':invoice_verify_info.tax_rate,
              'formData.hj':invoice_verify_info.amount_in_figuers,
              'formData.dm':invoice_verify_info.invoice_code,
              'formData.hm':invoice_verify_info.invoice_num,
              'st_date':invoice_verify_info.invoice_date,
              'formData.jym':invoice_verify_info.check_code,
              'formData.xfmc':invoice_verify_info.seller_name,
              'formData.xfsbh':invoice_verify_info.seller_register_num,
              'formData.gfmc':invoice_verify_info.purchaser_name,
              'formData.gfsbh':invoice_verify_info.purchaser_register_num,
              'formData.bxry':invoice_verify_info.reimbursement_people,
              'formData.bxgs':invoice_verify_info.reimbursement_company,
              'formData.bxbm':invoice_verify_info.reimbursement_department,
              'formData.bxpz':invoice_verify_info.reimbursement_voucher,
              'formData.zy':invoice_verify_info.project_summary,
              'formData.fylx':invoice_verify_info.expense_type,
              'formData.lrsj':invoice_verify_info.create_time,
              'formData.cwry':invoice_verify_info.status_people,
              is_verification:invoice_verify_info.is_verification,
              'formData.bz':invoice_verify_info.manual_remarks,
              'formData.shyj':invoice_verify_info.status_str,              
              'formData.scry':invoice_verify_info.reimbursement_people,          
              date:util.changedate(parseInt(invoice_verify_info.invoice_date),2),    
          })
          if(invoice_verify_info.script_path){
            var script_path=res.data.invoice_info.script_path;
            if(script_path.substring(script_path.length - 3)=='pdf'||script_path.substring(script_path.length - 3)=='odf'){
              this.setData({
                script_path:invoice_verify_info.script_path
              })
              console.log(app.globalData.loadimg+res.data.invoice_info.script_path)
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
  camera(){ //拍照
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
                flag:true
              })
            }
          } else if (res.tapIndex == 1) {
            util.chooseWxImage('album');
            util.checkRes=res=>{
              _this.setData({
                src:res,
                flag:true
              })
              console.log(res)
            }
          }
      },
      fail (res) {
        console.log(res.errMsg)
      }
    })
  },
  invoice_del_f(){ //删除发票
    util.showmodel('提示','是否确认删除？').then(res=>{
      if(res){
        http.invoice_del({
          data:{
            year:this.data.year,
            invoice_id:this.data.invoice_id
          },
          success:res=>{
            if(res.code==200){
              wx.showToast({
                title: res.msg,
              })
              setTimeout(res=>{
                wx.navigateBack()
              },1000)
            }else{
              wx.showToast({
                title: res.msg,
                icon:'none'
              })
            }
          }
        })
      }
    })
  },
  uploadpdf(){  //上传原件pdf
    let that=this;
    wx.chooseMessageFile({
      count: 1,  //能选择文件的数量
      type: 'file', //能选择文件的类型,我这里只允许上传文件.还有视频,图片,或者都可以
      extension: ['pdf','ofd'],
      success(res) { 
        console.log(res)
        var files = res.tempFiles[0].path;
        that.setData({
          file:files,
          flag:true
        })      
      }
     })
  },
  uploadOneByOne(invoice_str){ //上传文件
    if(this.data.flag){
    var that = this;
    wx.uploadFile({
      url: app.globalData.urlupload+'/Invoice/invoice_script_upload?invoice_str='+invoice_str+'&uid='+wx.getStorageSync('uid'), //仅为示例，非真实的接口地址
      filePath:this.data.file==''?this.data.src[0]:this.data.file,
      name: 'script',//示例，使用顺序给文件命名
      success:function(e){
        var res=JSON.parse(e.data);  
        if(res.code==200){
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
      },
      fail:function(e){     
      },
      complete:function(e){
     
      }
    })
   }
  },
  cansle(){ //移除
    this.setData({
       file:'',
       src:[],
       script_path:'',
       flag:false
    })
  },
  stdate: function(e) {  //开始时间
    var date= e.detail.value;
    this.setData({
      st_date:date.split('-')[0]+'年'+date.split('-')[1]+'月'+date.split('-')[2]+'日',
      date:date.split('-').join('')
    })
  },
  formatDecimal(num, decimal) { //保留两位小数
    // num = num.toString()
    // let index = num.indexOf('.')
    // if (index !== -1) {
    //     num = num.substring(0, decimal + index + 1)
    // } else {
    //     num = num.substring(0)
    // }
    return parseFloat(num).toFixed(decimal)
 },
 inputWacth(e){
  let formData = this.data.formData;
  let item = e.currentTarget.dataset.model;
  formData[item] = e.detail.value;
  if(formData.je&&item=='je'){
    if(formData.sl){
      formData['se']=this.formatDecimal((Number(formData.je)*Number(formData.sl)/100),2)
    }else{
      formData['se']=this.formatDecimal((Number(formData.je)*0),2)
    } 
   formData['hj']=this.formatDecimal((Number(formData.je)+Number(formData.se)),2)
  }
  this.setData({
  formData
  }); 
   if(this.data.check){
    let that=this;
    wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
      if(!rect.length){
        that.setData({
          img:'yz_zc@2x.png'
        })
      }else{
        that.setData({
          img:'yz_yc@2x.png'
        })
      }
    }).exec()
   }
  
},
  choose_type(e){ //选择类型
    let formData = this.data.formData;
    var info=this.data.info;
    let item = e.currentTarget.dataset.model;
    let type=e.currentTarget.dataset.type;
    formData[item] =info[type][e.detail.value];
    if(formData.sl&&formData.je){
      formData['se']=this.formatDecimal((Number(formData.je)*Number(formData.sl)/100),2);
      formData['hj']=this.formatDecimal((Number(formData.je)+Number(formData.se)),2)
    }
    if(item=='bxgs'){  //报销部门
      var gslist=this.data.infolist;
      for(var i=0;i<gslist.length;i++){
        if(gslist[i].name==formData.bxgs){      
          http.department_list({
            data:{
              unit_id:gslist[i].id
            },
            success:res=>{
              wx.hideLoading()
              if(res.code==200){
                this.setData({
                  'info.bxbmlist':(res.data.department_list||[]).map(a=>{
                    return a.name;
                  })
                })
              }
            }
          })
        }
      }
    }
    this.setData({
    formData:formData
    });
    if(this.data.check){
      let that=this;
      wx.createSelectorQuery().selectAll('.icon').boundingClientRect(function (rect) {
        console.log(rect)
        if(!rect.length){
          that.setData({
            img:'yz_zc@2x.png'
          })
        }else{
          that.setData({
            img:'yz_yc@2x.png'
          })
        }
      }).exec()
    }
  },
  clickImg_yj(){ //查看原件
    let that=this;
    wx.downloadFile({
      url:app.globalData.loadimg+that.data.script_path,
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
  clickImg(){  //预览文件
    if(this.data.src.length){
      wx.previewImage({
        current:this.data.src,
        urls: this.data.src
      })  
    }else{
      wx.openDocument({
        filePath: this.data.file,
        success: function (res) {          
        }
      })
    }
    
    },
    check(){
      let formData=this.data.formData;
      if(!formData.dm){
        this.data.title='请输入发票代码'      
        return false;
      }else if(!formData.hm){
        this.data.title='请输入发票号码';
        return false;
      }else if(!this.data.st_date){
        this.data.title='请选择发票日期';
        return false;
      }else if(!formData.jym){
        this.data.title='请输入效验码后六位';
        return false;
      }else if(!formData.je){
        this.data.title='请输入发票金额';
        return false;
      }else if(!formData.hj){
        this.data.title='税价合计不能为空';
        return false;
      }else{
        return true;
      }
    },
    submit(){  //提交
      if(this.check()){
      let formData=this.data.formData;
      http.invoice_runedit({
        data:{
          uid:wx.getStorageSync('uid'),
          invoice_type:formData.lx,
          invoice_code:formData.dm,
          invoice_num:formData.hm,
          invoice_date:this.data.st_date,
          invoice_time:this.data.date,
          check_code:formData.jym,
          total_amount:formData.je,
          tax_rate:formData.sl+'%',
          total_tax:formData.se,
          amount_in_figuers:formData.hj,
          seller_name:formData.xfmc,
          seller_register_num:formData.xfsbh,
          purchaser_name:formData.gfmc,
          purchaser_register_num:formData.gfsbh,
          reimbursement_people:formData.bxry,
          reimbursement_company:formData.bxgs,
          reimbursement_department:formData.bxbm,
          reimbursement_voucher:formData.bxpz,
          project_summary:formData.zy,
          expense_type:formData.fylx,
          manual_remarks:formData.bz,
          year:this.data.year,
          invoice_id:this.data.invoice_id,
          edit_type:2
        },
        success:res=>{
          if(res.code==200){
            if(res.data.invoice_str&&this.data.flag){
              this.uploadOneByOne(res.data.invoice_str)
            }else{
              wx.showToast({
                title: res.msg,
              })
              setTimeout(res=>{
                wx.navigateBack()
              },1000)
            }        
          }else{
            wx.showToast({
              title: res.msg,
              icon:'none'
            })
          }
        }
      })
    }
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
      wx.navigateBack()
    }
})