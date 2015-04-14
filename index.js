var server=require('./PpNodeServer');
server.start((process.argv.length>2?parseInt(process.argv[2]):8080), './content/');

