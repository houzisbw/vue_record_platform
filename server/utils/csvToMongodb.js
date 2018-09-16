/**
 * Created by Administrator on 2018/2/26.
 */
//读取excel数据到mongodb,首先将excel转为csv，再用csvtojson包执行转换
//注意：每次执行前考虑是否清空数据库，防止重复的数据写入
/*
* 乱码问题: 如果不设置csv的编码格式，保存到数据库中的就是乱码，
* 解决方法: notepad++打开csv，选择编码选项，然后先选择utf-8无bom编码格式，再点击转换为utf-8无bom编码格式，保存即可
*
* */
var mongoose = require('mongoose');
//注意用v1版本，升级后原来的api失效
var csvtojson = require('csvtojson/v1');
var Record = require('../model/record')
//连接mongodb
mongoose.connect('mongodb://127.0.0.1:27017/record_platform')
//监听:成功
mongoose.connection.on("connected",function(){
	console.log('csv mongodb connection success');
})
//监听:失败
mongoose.connection.on("error",function(){
	console.log('csv mongodb connection fail');
});

var csvFilePath = './csv/record.csv';
//trim去掉内容的左右空格，ignoreEmpty忽略空的单元格(important)
//默认csv第一行是表头，不算做数据
var options = {
	trim:true,
	ignoreEmpty:true
};
var resultArray = [];
//这个on('json'),每一行csv执行都会调用一次,done表示全部读取完成
csvtojson(options).fromFile(csvFilePath).on('json',(jsonObj)=>{
  console.log(jsonObj)
	resultArray.push(jsonObj)
}).on('done',()=>{

	//存数据库
	resultArray.forEach(function(value,index){
		let recordObj = new Record({
      workshop:value.workshop,
      //是否重要
      isImportant:value.isImportant,
      //用户名
      username:value.username,
      //类型
      type:value.type,
      //月份
      monthDate:value.monthDate,
      //是否确认
      isConfirm:value.isConfirm,
      //图片链接
      imageUrl:value.imageUrl,
      //错误说明
      error:value.error,
      //记录日期
      date:value.date,
		});
    recordObj.save();
	})
})
