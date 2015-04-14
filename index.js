var port=8080, home='./content/', mode='default';
if(process.argv.length>2) {
	for(var i=2; i<process.argv.length; i++) {
		if(/^port/.test(process.argv[i])) {
			port=parseInt(process.argv[i].split('=')[1]);
		} else if(/^home/.test(process.argv[i])) {
			home=process.argv[i].split('=')[1];
		} else if(/^mode/.test(process.argv[i])) {
			mode=process.argv[i].split('=')[1];
		} else {
			console.log("Invalid argument: "+ process.argv[i]);
			console.log("Usage: node index.js [port=<port>] [home=<dirname>] [mode=<default|admin>]");
			return;
		}
	}
}
console.log('Invoking server start script, port:'+port+', mode:'+mode+', home:'+home);
require('./PpNodeServer').start(port,home,mode);
