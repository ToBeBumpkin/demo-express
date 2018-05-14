const mongoose = require('mongoose');
const chalk = require('chalk');
const config = require('config-lite')(__dirname)

mongoose.connect(config.url, {useMongoClient:true});

const mongooseDb = mongoose.connection;

mongooseDb.once('open',() => {
    console.log(
        chalk.green("连接数据库成功")
    )
})
mongooseDb.on('error',(error) => {
    console.log(
        chalk.red("数据库连接错误"+error+",关闭数据库")
    )
    mongoose.disconnect();
})

mongooseDb.on('close',() => {
    console.log(
        chalk.red("断开数据库，重新连接")
    )
    mongoose.connect(config.url, {server:{auto_reconnect:true}});
})


export default mongooseDb