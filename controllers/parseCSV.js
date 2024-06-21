var fs = require('fs');
const parse = require('csv-parse');
parseCSV = module.exports ={};

parseCSV.parse= function (file,rowIsHeading,cb){
  fs.readFile(file, 'utf8' , (err, data) => {
    if (err) {
      console.error(err)
      return
    }
    if(rowIsHeading){
      parse(data, {
        to_line:1
      }, function(err, output){
        var columns=output[0].map(a => a.toLowerCase());
        parse(data, {
          'columns':columns,
          'from':2
        }, function(err, output){
          cb(err,output);
        })
      })
    }
    else{
      parse(data, {
        'columns':false
      }, function(err, output){
        cb(err,output);
      })
    }
    fs.unlinkSync(file);
  })
}
