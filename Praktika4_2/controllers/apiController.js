var config = require('../config');
var pgp = require('pg-promise')();
var db = pgp(config.getDbConnectionString());
module.exports = function(app) {
	//a. näidata kõiki riike

	app.get('/api/continents', function(req, res) {
		db
			.any('SELECT DISTINCT continent FROM country')
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch((err) => {
				res.json({
					description: 'Can’t find any continent',
					error: err
				});
			});
	});

	//b. näidata kõiki määratud mandri riike (riigi nimi, pealinn)

	app.get('/api/continent/:cont/countries', function(req, res) {
		db
			.any(
				"SELECT Co.name AS Riik, Ci.name AS Linn FROM country AS Co INNER JOIN city AS Ci ON Co.capital=Ci.id WHERE continent ='" +
					req.params.cont +
					"' ORDER BY Co.name"
			)
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch((err) => {
				res.json({
					description: 'Can’t find any continent',
					error: err
				});
			});
	});

	//c. näidata täielikku teavet määratud linna kohta (2 GET - päringut: linnakoodi ja nime järgi)

	app.get('/api/:city/info_id', function(req, res) {
		db
			.any('SELECT * FROM city WHERE city.id =' + req.params.city)
			//db.any("SELECT * FROM city" + "WHERE city.id =" +req.params.city + ":: varchar")
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch((err) => {
				res.json({
					description: 'Can’t find any city',
					error: err
				});
			});
	});

	app.get('/api/:city/info_name', function(req, res) {
		db
			.any("SELECT * FROM city WHERE city.name ='" + req.params.city + "'")
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch((err) => {
				res.json({
					description: 'Can’t find any city',
					error: err
				});
			});
	});

	//Tegin lisaks
	//Kõik linnad
	app.get('/api/cities', function(req, res) {
		db
			.any('SELECT * FROM city')
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch((err) => {
				res.json({
					description: 'Can’t find any city',
					error: err
				});
			});
	});

	//d. näidata täielikku teavet määratud riigi kohta (teave riigi ja linnade kohta).
	//Andmete lugemiseks looge ka 2 päringut: riigi koodi ja nime järgi.

	app.get('/api/code2/:country/info', function(req, res) {
		db
			.any(
				"SELECT co.*, ci.* FROM country AS co INNER JOIN city AS ci ON co.code = ci.countrycode WHERE co.code2 ='" +
					req.params.country +
					"'"
			)
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch((err) => {
				res.json({
					description: 'Can’t find any country',
					error: err
				});
			});
	});

	app.get('/api/name/:country/info', function(req, res) {
		db
			.any(
				"SELECT co.*, ci.* FROM country AS co INNER JOIN city AS ci ON co.code = ci.countrycode WHERE co.name ='" +
					req.params.country +
					"'"
			)
			.then(function(data) {
				res.json({
					status: 'success',
					data: data
				});
			})
			.catch((err) => {
				res.json({
					description: 'Can’t find any country',
					error: err
				});
			});
	});
};
