var excelToJson = require('excel');

excelToJson('excel.xlsx', function(err, data) {
  if(err) throw err;
  console.log(data);
});


