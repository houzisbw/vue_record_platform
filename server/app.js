var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var ejs = require('ejs');
var mongoose = require('mongoose');
var jwt = require('jwt-simple');
var helmet = require('helmet');

//路由
var index = require('./routes/index');
var users = require('./routes/users');
var modifyUser = require('./routes/modifyUser')
var workshop = require('./routes/workshop')
var recordType = require('./routes/record_types')
var record = require('./routes/record')

//util
var util = require('./utils');

var app = express();
//安全中间件
app.use(helmet())
//跨域设置
app.all('*', function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "X-Requested-With");
  res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
  //和客户端对应，必须设置以后，才能接收cookie
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.engine('.html',ejs.__express);
app.set('view engine', 'html');


//连接mongodb,线上部署时记得取消该注释
//mongoose.connect('mongodb://root:Sbw66620116@127.0.0.1:27017/record_platform?authSource=admin')
//连接本地mongodb
mongoose.connect('mongodb://127.0.0.1:27017/record_platform');
//监听:成功
mongoose.connection.on("connected",function(){
  console.log('mongodb connection success');
})
//监听:失败
mongoose.connection.on("error",function(){
  console.log('mongodb connection fail');
})



// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'views')));


//后台统一拦截检查是否登录
let interceptorRequest = util.interceptorRequest;
//首先对所有请求进行登录校验(除去某一些不用进行校验的url，比如/login)
app.use(interceptorRequest);
//各个模块的逻辑
app.use('/', index);
app.use('/users',users);
app.use('/modifyUser',modifyUser);
app.use('/modifyWorkshop',workshop);
app.use('/modifyRecordTypes',recordType)
app.use('/searchRecord',record)

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
