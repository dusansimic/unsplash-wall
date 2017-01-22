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

var printHelp = function() {
  console.log();
  console.log("   -h              | print help");
  console.log("   -s <source>     | enter wallpaper source");
  console.log("   -r <resolution> | enter wallpaper resolution");
  console.log();
}

var main = function() {
  var wallSource = "random";
  var wallRes = "1920x1080";
  var allowDownload = false;
  // get command line args
  if (process.argv.length > 1) {
    for (var i = 2; i <= process.argv.length; i++) {
      console.log("entering");
      console.log(process.argv[i]);
      console.log(i);
      if (process.argv[i] === "-h") {
        console.log("help");
        printHelp();
        return;
      }
      if (process.argv[i] === "-s") {
        console.log("source");
        i++;
        wallSource = process.argv[i];
        allowDownload = true;
        return;
      }
      if (process.argv[i] === "-r") {
        console.log("resolution");
        i++;
        wallRes = process.argv[i];
        allowDownload = true;
        return;
      }
      if (process.argv[i] === "--use-default") {
        console.log("use default");
        allowDownload = true;
        return;
      }
      console.log("exiting");
    }
  }
  // start the download
  if (allowDownload) {
    download('https://source.unsplash.com/' + wallSource + '/' + wallRes, 'wall.jpg', function(){
      console.log('download ... done');
      // after download is done set the wallpaper
      wallpaper.set('wall.jpg').then(console.log('setting ... done'));
    });
  }
}

main();
