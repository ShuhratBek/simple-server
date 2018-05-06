const { createServer } = require('http');
const { parse } = require('url');
const { join, extname } = require('path');
const { lstatSync, createReadStream } = require('fs');

const mimeTypes = {
	html: 'text/html',
	jpeg: 'image/jpeg',
	jpg: 'image/jpg',
	png: 'image/png',
	js: 'text/javascript',
	css: 'text/css'
};
const host = process.env.HOST || '127.0.0.1';
const port = process.env.PORT || 3000;

createServer((req, res) => {
  let stats;
	const uri = parse(req.url).pathname;
	const fileName = join(process.cwd(), decodeURI(uri));
	console.log('Loading '+ uri);

	try{
		stats = lstatSync(fileName);
	} catch(e){
		res.writeHead(404, {'Content-type': 'text/plain'});
		res.write('404 Not Found\n');
		res.end();
		return;
	}

	if(stats.isFile()){
		const mimeType = mimeTypes[extname(fileName).split('.').reverse()[0]] || 'text/plain';
		res.writeHead(200, { 'Content-type': mimeType });

		const fileStream = createReadStream(fileName);
		fileStream.pipe(res);
	} else if(stats.isDirectory()) {
		res.writeHead(302, { 'Location': 'index.html' });
		res.end();
	} else {
		res.writeHead(500, { 'Content-type': 'text/plain' });
		res.write('500 Internal Error\n');
		res.end();
	}
}).listen(port, host, () => {
    console.info(`App listening on ${host}:${port}!`);
});
