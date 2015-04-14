function dispatch(req, res, home) {
	console.log('Dispatching request');
	//var parsedUrl=require('url').parse(req.url, true);
	var fs=require('fs');
	var path=require('path');
	var filePath=null;
	if (/^\/home/.test(req.url)) {
		console.log('Serving home.htm');
		res.writeHead(200,{'content-type':'text/html'});
		filePath=path.join(home,'home.htm');
		fs.readFile(filePath, function(err,data) {
			if(err) throw err;
			res.write(data);
			res.end();
		});
		/*var is=fs.createReadStream(filePath);
		is.pipe(res);
		res.end();*/
	} else if (/^\/game/.test(req.url)) {
		console.log('Serving game.htm');
		res.writeHead(200,{'content-type':'text/html'});
		filePath=path.join(home,'game.htm');
		fs.readFile(filePath, function(err,data) {
			if(err) throw err;
			res.write(data);
			res.end();
		});
		//fs.createReadStream(filePath).pipe(res);
	} else if (/^\/help/.test(req.url)) {
		console.log('Serving help.htm');
		res.writeHead(200,{'content-type':'text/html'});
		filePath=path.join(home,'help.htm');
		fs.readFile(filePath, function(err,data) {
			if(err) throw err;
			res.write(data);
			res.end();
		});
	} else if (/^\/scripts/.test(req.url)) {
		console.log('Serving script: ' + req.url);
		res.writeHead(200,{'content-type':'text/javascript'});
		filePath=path.join(home,req.url);
		fs.exists(filePath, function (exists) {
			if(exists) {
				fs.readFile(filePath, function(err,data) {
					if(err) throw err;
					res.write(data);
					res.end();
				});
			} else {
				console.log('File not found: '+req.url);
				res.writeHead(404,{'content-type':'text/html'});
				res.end("Requested content not found on server");
			}
		});
	} else if (/^\/api/.test(req.url)) {
		console.log('API request found');
		var apiResult;
		var requestData='';
		req.on('data', function(data) {
			requestData+=data.toString();
		});
		req.on('end', function() {
			res.writeHead(200,{'content-type':'application/json'});
			var requestBody = JSON.parse(requestData);
			var filePath=path.join(home,'db','savedGame');
			if(requestBody.action=='load') {
				console.log('API request type: load');
				fs.exists(filePath, function (exists) {
					if(exists) {
						fs.readFile(filePath, function(err,data) {
							if(err) {
								console.log('Error reading saved game file');
								apiResult = {status: 'err', msg: 'Error reading saved game file on server'};
							} else {
								apiResult = {
									status: 'success', 
									msg: 'Game loaded successfully',
									content: JSON.parse(data)
								};
							}
							console.log('Returning result: '+JSON.stringify(apiResult));
							res.end(JSON.stringify(apiResult));
						});
					} else {
						console.log('File doesn\'t exist on server');
						apiResult = {status: 'err', msg: 'File doesn\'t exist on server'};
						console.log('Returning result: '+JSON.stringify(apiResult));
						res.end(JSON.stringify(apiResult));
					}
				});
			} else if(requestBody.action=='save') {
				console.log('API request type: save');
				fs.writeFile(filePath, JSON.stringify(requestBody.content), function(err) {
					if(err) {
						console.log('Error while saving game file');
						apiResult = {status: 'err', msg: 'Error while saving game file on server'};
					} else
						apiResult = {status: 'success', msg: 'Game saved successfully'};
					console.log('Returning result: '+JSON.stringify(apiResult));
					res.end(JSON.stringify(apiResult));
				});
			} else {
				apiResult = {status: 'err', msg: 'Invalid API call'};
				console.log('Returning result: '+JSON.stringify(apiResult));
				res.end(JSON.stringify(apiResult));
			}
		});
	} else {
		console.log('Unknown request');
		res.writeHead(404,{'content-type':'text/html'});
		res.end("Requested content not found on server");
	}
}

var PpNodeServer={
	port: null,
	server: null,
	key: null,
	home: null,
	start: function(port, homedir) {
		var http=require('http');
		var path=require('path');
		this.port=port;
		this.key=(new Date()).getTime();
		this.home=(homedir==null?".":homedir);
		
		this.server=http.createServer(function(req, res) {
			var parsedUrl=require('url').parse(req.url, true);
			if (/^\/stop/.test(req.url)) {
				console.log('stop request from client, key: '+parsedUrl.query.key);
				if(parsedUrl.query.key==PpNodeServer.key) {
					console.log('Stopping server');
					//res.writeHead(200,{'content-type':'text/html'});
					//res.end("Stopped connection");
					PpNodeServer.server.close();
					console.log('Stopped server');
				}
			} else {
				console.log('Forwarding request to handler');
				dispatch(req, res, PpNodeServer.home);
			}
		});
		console.log('Started server, key: '+this.key);
		this.server.listen(this.port);
		console.log('Listening on port: '+this.port);
	}
};

module.exports=PpNodeServer;