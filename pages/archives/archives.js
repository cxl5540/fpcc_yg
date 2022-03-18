import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
    active: 0,
    page:1,
    pages:0,
    user_info:'',
    key:'',
    input_time:'',
    type:'全部',
    list:[],
    triggered:false,
    is_data:true,
    tabHeiaght:400
  },
  onLoad: function (options) {
    this.setData({
      tabHeiaght:wx.getSystemInfoSync().windowHeight-111,
      input_time:util.formatTime(new Date()).substring(0,4),
    })
    this.getlist()
  },
  change_type(e){ //切换
    var active=e.currentTarget.dataset.type
        this.setData({
          active:active,
          page:1,
          list:[],
          is_data:true
        });
     this.getlist();   
  },
  choose_date(e){ //选时间
    this.setData({
      input_time:e.detail.value.substring(0,4),
      page:1,
      list:[],
      is_data:true
    })
    this.getlist();
  },
  getlist(){
    http.invoice_list({
      data:{
        page:this.data.page,
        limit:10,
        uid:wx.getStorageSync('uid'),
        status:Number(this.data.active)+2,
        key:this.data.key,
        input_time:this.data.input_time
      },
      success:res=>{
        if(res.code==200){
          var list=this.data.list;
         
          if(this.data.is_data){       
            this.setData({
              list:list.concat(res.data.invoice_list),
              user_info:res.data.user_info
            })
          }
          if(this.data.page>res.data.pages || res.data.pages<=1&&res.data.invoice_list.length<=10){
            this.setData({
              is_data:false
            })
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
 
  onPulling(e){
  
  },
  
  detail(e){ //详情编辑
    var id=e.currentTarget.dataset.id;
    var year=e.currentTarget.dataset.year;
    var active=e.currentTarget.dataset.active;
    if(active==0){
      wx.navigateTo({
        url: '/pages/saoma_del/saoma_del?year='+year+'&id='+id,
      })
    }else if(active==1){
      wx.navigateTo({
        url: '/pages/fapiao_dbj_del/fapiao_dbj_del?year='+year+'&id='+id,
      })
    }else{
      wx.navigateTo({
        url: '/pages/repeat_lr/repeat_lr?year='+year+'&id='+id,
      })
    }
    
  },

  keyval(e){ //关键词删选
    this.setData({
      key:e.detail.value,
    })
  },
  search(){ //搜索
    this.setData({
      page:1,
      is_data:true,
      list:[]
    })
    this.getlist();
  },
 
  scrollToLower(e){ //上拉加载
    if(this.data.is_data){
      this.setData({
        page:this.data.page+1
      })
      this.getlist()
    }
    
  },
  onRefresh() {  //下拉刷新
    if (this._freshing) return
    this._freshing = true
    setTimeout(() => {
      this.setData({
        triggered: false,
        page:1,
        is_data:true,
        key:'',
        list:[],
        input_time:util.formatTime(new Date()).substring(0,4)
      })
      this.getlist();
      this._freshing = false
    }, 2000)
  },
})