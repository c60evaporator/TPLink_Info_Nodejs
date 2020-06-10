const ini = require('ini');
const fs    = require('fs');
const csvparse = require('csv/node_modules/csv-parse/lib/sync');
const tplink = require('./tplink.js');
var async = require('async');

//処理開始時刻(秒を丸める)
var masterDate = new Date()
if(masterDate.getSeconds() >= 30){
    masterDate.setMinutes(masterDate.getMinutes() + 1)
}
masterDate.setSeconds(0)

//設定ファイル読込
const config = ini.parse(fs.readFileSync('./config.ini', 'utf-8'));

//家電リスト読込
const file = fs.readFileSync('ApplianceList.csv');
const data = csvparse(file, {columns: true, skip_empty_lines: true})

//forEachだと非同期でループが勝手に進むので、async.eachで機器を走査
async.each(data, function(appInfo, callback){
    if(appInfo.ApplianceType == 'TPLink_Bulb' || appInfo.ApplianceType == 'TPLink_Plug'){
        tplink.sysInfoToCSV(appInfo.IP, masterDate, appInfo.ApplianceName, config.Path.CSVOutput);
    }
});


