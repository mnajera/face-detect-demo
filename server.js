/*
 * server.js
 * author: Manny Najera (manny.najera@gmail.com)
 */

var http = require('http');
var url = require('url');
var fs = require('fs');
var request = require('request');
var Ftp = require('jsftp');

var api_key = '__API_KEY__'
var api_secret = '__API_SECRET__';
var image_loc = '__IMAGE_LOC__';

var ftp_host = '__FTP_HOST__';
var ftp_username = '__FTP_USERNAME__';
var ftp_password = '__FTP_PASSWORD__';

http.createServer(function (req, res) {
    
    var url_parts = url.parse(req.url);

    switch (url_parts.pathname) {

        case '/':
            fs.readFile('./index.html', function(error, content) {
                if (error) {
                    res.writeHead(500);
                    res.end();    
                } else {
                    res.writeHead(200, { 'Content-Type': 'text/html' });
                    res.end(content, 'utf-8');
                }
            });        
            break;
			
        case '/postImage':
            handlePostImage(req, res);
            break;

        case '/submitFaceDetectRequest':
            submitFaceDetectRequest(req, res); 
            break;

        default:
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end('Path not recognized.');
            break;
    }

}).listen(8080);

function handlePostImage(req, res) {

    if (req.method == 'POST') {
        var outdata;
        req.on('data', function(data) {
            outdata += data;
        });
        req.on('end', function() {
        	res.writeHead(200, { 'Content-Type': 'text/html' });
            processPostData(outdata, 'test.png', res);
        });
    }
        
};

function processPostData(data, filename, response) {

    var lines = data.split('\n');

    for (var i = 0; i < lines.length; i++) {

        if (lines[i].indexOf('data:image') !== -1) {

            var base64Data = lines[i].replace('data:image/png;base64,', '');
            var binaryData = new Buffer(base64Data, 'base64').toString('binary');

            fs.writeFile(filename, binaryData, 'binary', function(err) {
                if(err) {
                    console.log(err);
                } else {
                    console.log('Saved file: ' + filename);
                }
            });
			
            var ftp = new Ftp({
                host: ftp_host,
                user: ftp_username,
                pass: ftp_password
            });
       
            fs.readFile(filename, 'binary', function(err, data) {
                var buffer = new Buffer(data, 'binary');
                ftp.put(image_loc, buffer, function(err, res) {
                    if (err) {
                        console.log('error uploading file!');
                    } else {
                        console.log('file uploaded successfully!');
                    }	
					response.end('uploaded the file');
                });
            });

            return;
        }
    }

};

function submitFaceDetectRequest(req, res) {

	var imageUrl = 'http://' + image_loc;
	
    var url = 'http://api.skybiometry.com/fc/faces/detect.json?api_key='
    	+ api_key + '&api_secret=' + api_secret + '&urls=' + imageUrl;
		
    request(url, function(error, response, body) {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        if (!error && response.statusCode == 200) {
            res.end(body);
        } else {
            res.end(body);
        }
    });
}

/* EOF */
