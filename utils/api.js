// api.js
// 在这里面定义所有接口，一个文件管理所有接口，易于维护
// 引入刚刚封装好的http模块，import属于ES6的语法，微信开发者工具必须打开ES6转ES5选项
import { http } from './http'; 

// 每一个接口定义一个函数，然后暴露出去，供逻辑代码调用
// 接口请求的路由地址以及请求方法在此处传递
const app = getApp()
function getuser_info(params) {  //获取个人信息
  http(app.globalData.url, 'post', params,'Personal/user_info')
}

function user_info_edit(params) {  //账号设置
  http(app.globalData.url, 'post', params,'Personal/user_info_edit')
}
function team_add(params) {  //加入团队
  http(app.globalData.url, 'post', params,'Personal/team_add') 
}
function team_sign_out(params) {  //退出团队
  http(app.globalData.url, 'post', params,'Personal/team_sign_out') 
}
function user_edit(params) {  //员工设置
  http(app.globalData.url, 'post', params,'Personal/user_edit')
}
function user_runedit(params) {  //员工设置提交
  http(app.globalData.url, 'post', params,'Personal/user_runedit') 
}
function invoice_list(params) {  //支付
  http(app.globalData.url, 'post', params,'Invoice/invoice_list')  
}
function invoice_identification(params) {  //发票识别
  http(app.globalData.url, 'post', params,'Invoice/invoice_identification')  
}

function basic_info(params) {  //手工录入基础信息
  http(app.globalData.url, 'post', params,'Invoice/basic_info')  
}
function invoice_runadd(params) {  //手工录入提交
  http(app.globalData.url, 'post', params,'Invoice/invoice_runadd') 
}
function invoice_import_list(params) {  //导入pdf列表
  http(app.globalData.url, 'post', params,'Invoice/invoice_import_list')
}

function department_list(params) {  //报销部门
  http(app.globalData.url, 'post', params,'Personal/department_list') 
}
function invoice_import_edit(params) {  //发票导入编辑
  http(app.globalData.url, 'post', params,'Invoice/invoice_import_edit') 
}
function invoice_edit(params) {  //我的发票详情初始数据
  http(app.globalData.url, 'post', params,'Invoice/invoice_edit') 
}
function invoice_runedit(params) {  //我的发票详情提交
  http(app.globalData.url, 'post', params,'Invoice/invoice_runedit') 
}
function invoice_del(params) {  //我的发票删除
  http(app.globalData.url, 'post', params,'Invoice/invoice_del') 
}
function verify_see(params) {  //查看发票验真
  http(app.globalData.url, 'post', params,'Invoice/verify_see') 
}
function finance_list(params) {  //会计列表
  http(app.globalData.url, 'post', params,'Personal/finance_list') 
}
function operation_verify(params) {  //会计列表
  http(app.globalData.url, 'post', params,'Personal/operation_verify') 
}
function invoice_card_bag_import(params) {  //发票导入
  http(app.globalData.url, 'POST', params,'Invoice/invoice_card_bag_import') 
}
function invoice_check_duplicate(params) {  //发票查重
  http(app.globalData.url, 'post', params,'Invoice/invoice_check_duplicate') 
}

function invoice_import_runedit(params) {  //编辑录入
  http(app.globalData.url, 'post', params,'Invoice/invoice_import_runedit')  
}

function order_info(params) {  //获取正式版基础信息
  http(app.globalData.url, 'post', params,'Order/order_info') 
}
function rise_list(params) {  //发票抬头管理别表
  http(app.globalData.url, 'post', params,'Personal/rise_list') 
}
function rise_runadd(params) {  //发票抬头新增
  http(app.globalData.url, 'post', params,'Personal/rise_runadd') 
}
function rise_edit(params) {  //编辑发票抬头
  http(app.globalData.url, 'post', params,'Personal/rise_edit') 
}
function rise_runedit(params) {  //编辑发票抬头提交
  http(app.globalData.url, 'post', params,'Personal/rise_runedit') 
}
function department_runadd(params) {  //管理部门新增
  http(app.globalData.url, 'post', params,'Personal/department_runadd') 
}
function department_del(params) {  //管理部门删除
  http(app.globalData.url, 'post', params,'Personal/department_del') 
}
function team_member_list(params) {  //团队成员管理
  http(app.globalData.url, 'post', params,'Personal/team_member_list') 
}
function team_setup(params) {  //团队设置获取数据
  http(app.globalData.url, 'post', params,'Personal/team_setup') 
}










// 暴露接口
export default { 
  getuser_info,
  user_info_edit,
  team_add,
  team_sign_out,
  user_edit,
  user_runedit,
  invoice_list,
  invoice_runadd,
  basic_info,
  invoice_identification,
  invoice_import_list,
  department_list,
  invoice_import_edit,
  invoice_import_runedit,
  invoice_edit,
  invoice_runedit,
  invoice_del,
  verify_see,
  finance_list,
  operation_verify,
  invoice_card_bag_import,
  invoice_check_duplicate,


  order_info,
  rise_list,
  rise_runadd,
  rise_edit,
  rise_runedit,
  department_runadd,
  department_del,
  team_member_list,
  team_setup,
}