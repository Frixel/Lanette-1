const net = require('net');
const path = require('path');

require(path.join(__dirname, 'create-untracked-files.js'));

module.exports = (async () => {
	await require(path.join(__dirname, 'build.js'))().catch(e => {
		console.log(e);
		process.exit(1);
	});

	require(path.join(__dirname, 'built', 'app.js'))();

	if (Config.repl && Config.repl.enabled) {
		const replPort = Config.repl.port || 3001;
		net.createServer(socket => {
			require(path.join(__dirname, 'built', 'repl.js')).start(socket);
		}).listen(replPort, () => console.log("REPL server listening on port " + replPort));
	}

	process.on('uncaughtException', error => {
		console.log(error);
		Tools.logError(error);
	});

	if (require.main === module) {
		Client.connect();
	}
})();
