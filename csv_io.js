const fs = require('fs');
const csv = require('csv');
const csvparse = require('csv/node_modules/csv-parse/lib/sync');

//CSVに1行追加して出力
exports.pushAndOutputCSV = function(header, outrow, outpath){
    //出力用データ
    let newData = [];
    //ファイルが存在するとき、最後に1行追加
    if(fs.existsSync(outpath)){
      //CSVファイル読込（同期）
      const file = fs.readFileSync(outpath);
      newData = csvparse(file, {columns: false, skip_empty_lines: true})
      newData.push(outrow);
    }
    //ファイルが存在しないとき、ヘッダと1行を追加
    else{
      newData.push(header)
      newData.push(outrow)
    }
    //加工後のCSVファイルを出力
    csv.stringify(newData, (error,output)=>{
      fs.writeFile(outpath, output, (error)=>{
        console.log('処理データをCSV出力しました。');
      })
    })
  }