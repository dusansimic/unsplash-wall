var wallpaper = require('wallpaper');
var fs = require('fs'),
    request = require('request');

var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var main = function() {
  wallSource = "random";
  wallRes = "1920x1080";
  // get command line args
  if (process.argv.length > 2) {
    if (process.argv[2] === "-s") {
      wallSource = process.argv[3];
    } else if (process.argv[2] === "-d") {
      wallRes = process.argv[3];
    }

    if (process.argv[4] === "-d") {
      wallRes = process.argv[5];
    }
  }
  // start the download
  download('https://source.unsplash.com/' + wallSource + '/' + wallRes, 'wall.jpg', function(){
    console.log('download ... done');
    // after download is done set the wallpaper
    wallpaper.set('wall.jpg').then(console.log('setting ... done'));
  });
}

main();
