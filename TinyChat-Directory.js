/*jshint esversion: 7 */
'use strict';
const FileSystem = require('fs'),
	Https = require('https'),
	Axios = require('axios'),
	Express = require('express'),
	Favicon = require('serve-favicon'),
	Helmet = require("helmet"),
	Application = Express();

let Directory = {
	List: { error: { code: 404, reason: "Starting Application, Wait a few moments and try again." } },
	CacheAt: 60000 * 2, // Keep cache for x amount of time
	LastCachedAt: new Date(),
	Update: () => {
		Directory.LastCachedAt = new Date();
		Axios.get('http://chit.tinychat.com/rooms/popular?signature=0fcdf9b4928c2b92a5fc5bfde14bbe68').then((resp) => Directory.List = resp.data).catch(() => Directory.List = { error: { code: 404, reason: "Could not load directory. Try again in several minutes." } })
	}
}

Application.set('trust proxy', 1);
Application.set("view engine", "ejs");
Application.use(Helmet({}));
Application.use(Express.static(`${__dirname}/public`, { etag: false, maxAge: '60000' }));
Application.use(Favicon(`${__dirname}/favicon.ico`));
// HTTPS Redirect
// Application.use((req, res, next) => (req.secure) ? next() : res.redirect(`https://${req.headers.host}${req.url}`));

Application.get('/', (req, res) => {
	if (new Date() - Directory.LastCachedAt >= Directory.CacheAt) Directory.Update();
	res.render('index');
});
Application.get('/room/:room', (req, res) => res.send(`<h1>YOU ARE NOW LEAVING ${req.headers.host}.<br><a href="https://tinychat.com/room/${req.params.room}">https://tinychat.com/room/${req.params.room}</a></h1>`));
Application.get('/api/get-rooms', async (req, res) => res.json(Directory.List));
Application.all('*', (req, res) => res.status(404).send());

Directory.Update();

// Default HTTP (however HTTPS is supported)
// Https.createServer({ key: FileSystem.readFileSync(__dirname + '/certificate/your-key.pem'), cert: FileSystem.readFileSync(__dirname + '/certificate/your-cert.pem') }, Application).listen(443);
Application.listen(80);