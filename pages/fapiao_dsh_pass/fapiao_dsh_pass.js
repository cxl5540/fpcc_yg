import util from '../../utils/util.js'
import http from '../../utils/api'
const app = getApp()
Page({
  data: {
      info:'',
  },
  onLoad: function (options) {
    this.getdata(options.year,options.invoice_id)
  },
  getdata(year,invoice_id){
    http.verify_see({
      data:{
        year:year,
        invoice_id:invoice_id
      },
      success:res=>{
        if(res.code==200){
          this.setData({
            info:res.data
          })
        }
      }
    })
  }
})