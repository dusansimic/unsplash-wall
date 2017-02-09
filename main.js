var wallpaper = require('wallpaper');
var fs = require('fs');
var request = require('request');


// function for downloading photos
var download = function(uri, filename, callback){
  request.head(uri, function(err, res, body){
    console.log('content-type:', res.headers['content-type']);
    console.log('content-length:', res.headers['content-length']);

    request(uri).pipe(fs.createWriteStream(filename)).on('close', callback);
  });
};

var printHelp = function() {
  console.log();
  console.log("   -h                  | print help");
  console.log("   -c <category>       | enter wallpaper category");
  categories.forEach(function(category) {
    console.log('      ', category);
  });
  console.log("   -r <width>x<height> | enter wallpaper resolution");
  console.log();
}

var categories = [ 'buildings', 'food', 'nature', 'people', 'technology', 'objects' ];

var main = function() {
  var category = "random";
  var resolution = "1920x1080";
  var user = '';
  var allowDownload = false;
  var useCategory = true;
  // get command line args
  if (process.argv.length > 1) {
    for (var i = 2; i <= process.argv.length; i++) {
      if (process.argv[i] === "-h") {
        printHelp();
        process.exit();
      }
      if (process.argv[i] === "-c") {
        i++;
        if (process.argv[i] !== undefined) {
          category = 'category/' + process.argv[i];
          console.log('Category:', process.argv[i]);
          allowDownload = true;
        } else {
          console.error('you did not enter category after -c flag');
        }
      }
      if (process.argv[i] === "-u") {
        i++;
        if (process.argv[i] !== undefined) {
          user = 'user/' + process.argv[i];
          console.log('User:', process.argv[i]);
          allowDownload = true;
        }
      }
      if (process.argv[i] === "-r") {
        i++;
        if (process.argv[i] !== undefined) {
          resolution = process.argv[i];
          console.log('Resolution:', process.argv[i]);
          allowDownload = true;
        } else {
          console.error('you did not enter resolution after -r flag');
        }
      }
      if (process.argv[i] === "--use-default") {
        allowDownload = true;
      }
    }
  }



  // start the download
  if (allowDownload) {
    var wallpaperURL = 'https://source.unsplash.com/';

    if (useCategory) {
      wallpaperURL += category;
    } else {
      wallpaperURL += ('user/' + user);
    }

    wallpaperURL += ('/' + resolution);
    console.log(wallpaperURL);
    download(wallpaperURL, '/tmp/wall.jpg', function(){
      console.log('download ... done');
      // after download is done set the wallpaper
      wallpaper.set('/tmp/wall.jpg').then(function() {
        console.log('setting ... done');
        // in the end remove downloaded jpg file
        /*
        fs.unlink('/tmp/wall.jpg', (err) => {
          if (err) throw err;
          console.log('removing downloaded jpg ... done');
        });
        */
      });

    });
  } else {
    console.log('if you want to use default settings please use --use-default flag');
  }
}

main();
