const fs = require('fs');
const { Client } = require('tplink-smarthome-api');
const csvio = require('./csv_io.js');

//デバイス情報を読み込んでCSVに書き込み
exports.sysInfoToCSV = function(ip, masterDate, applianceName, outdir) {
  //Clientインスタンス作成
  const client = new Client();
  //デバイス情報取得
  client.getDevice({ host: ip }).then(device => {
    device.getSysInfo().then(deviceInfo => outputDeviceStatus(deviceInfo, masterDate, applianceName, outdir));
  });
}

//取得したデバイス情報に適用するメソッド
function outputDeviceStatus(deviceInfo, masterDate, applianceName, outdir) {
  //デバイスがスマートプラグだったとき
  if(deviceInfo['type'] == 'IOT.SMARTPLUGSWITCH'){
    var outdic = {}
    outdic['Date_Master'] = masterDate;
    outdic['Date'] = new Date();
    outdic['isOn'] = deviceInfo['relay_state'];
    outdic['onTime'] = deviceInfo['on_time'];
    console.log(outdic)

    const header = ['Date_Master', 'Date', 'isOn', 'onTime'];
    let outrow = [outdic['Date_Master'].toLocaleString(), outdic['Date'].toLocaleString(), outdic['isOn'], outdic['onTime']];
    outputAppData(header, outrow, masterDate, applianceName, outdir)
  }
  //デバイスがスマート電球だったとき
  if(deviceInfo['mic_type'] == 'IOT.SMARTBULB'){
    var outdic = {}
    outdic['Date_Master'] = masterDate;
    outdic['Date'] = new Date();
    outdic['isOn'] = deviceInfo['light_state']['on_off'];
    outdic['color'] = deviceInfo['light_state']['hue'];
    outdic['color_temp'] = deviceInfo['light_state']['color_temp'];
    outdic['brightness'] = deviceInfo['light_state']['brightness'];
    console.log(outdic)

    const header = ['Date_Master', 'Date', 'isOn', 'color', 'color_temp', 'brightness'];
    let outrow = [outdic['Date_Master'].toLocaleString(), outdic['Date'].toLocaleString(), outdic['isOn'], outdic['color'], outdic['color_temp'], outdic['brightness']];
    outputAppData(header, outrow, masterDate, applianceName, outdir)
  }
}

//
function outputAppData(header, outrow, masterDate, applianceName, outdir){
  //出力ファイル直上フォルダ
  const parentdir = `${outdir}/${applianceName}/${masterDate.getFullYear()}`
  //出力CSVファイルのフルパス
  outpath = `${parentdir}/${applianceName}_${masterDate.getFullYear()}${masterDate.getMonth()}.csv`
  //出力
  fs.exists(parentdir, function(exists){
    //上記フォルダがなければ作成
    if (!exists) {
      fs.mkdir(parentdir, { recursive: true }, function(err){
        if (err) {
          console.log(err);
          return 1;
        }
        //フォルダが作成できたらCSV出力
        else {
          csvio.pushAndOutputCSV(header, outrow, outpath);
        }
      })
    }
    //上記フォルダが存在するとき、そのままCSV出力
    else{
      csvio.pushAndOutputCSV(header, outrow, outpath);
    }
  })
}