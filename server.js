var express = require('express');
var jade = require('jade');
var app = express();
var sqlite3 = require('sqlite3').verbose();
var db = new sqlite3.Database('battleboats.db');

app.use(express.static(__dirname + '/public'));

app.route("/genmap").get(function(req, res) {
	//Return Map from Game id
	//currently random map always generated.
	var map = [];
	var square = 50;
	//Set the square size
	if (req.query.square != null) {
		square = req.query.square;
		//console.log("Square size: " + square);
	}
	//TODO:Fetch Map right now it just gens a map.
	//var map = gen.generateMap(square);
	for ( i = 0; i < (1000 / square); i++) {
		map.push([]);
		for ( j = 0; j < (1000 / square); j++) {
			if (Math.floor((Math.random() * 10) + 1) < 3 == 0) {
				map[i].push(0);
			} else {
				map[i].push(1);
			}
		}
	}
	//Sanity Check the map
	for ( i = 0; i < (1000 / square); i++) {
		for ( j = 0; j < (1000 / square); j++) {
			try {
				if (map[i][j] == 0) {
					continue;
				} else {
					if (j > 0 && map[i][j - 1] == 1) {
						continue;
					} else if (i > 0 && map[i - 1][j] == 1) {
						continue;
					} else if (i < (1000 / square) - 1 && map[i + 1][j] == 1) {
						continue;
					} else if (j < (1000 / square) - 1 && map[i][j + 1] == 1) {
						continue;
					} else {
						map[i][j] = 0;
					}
				}
			} catch(err) {
				console.log(i + ',' + j + ':\n');
				console.log("location:" + map[i][j]);
				console.log("Right:" + map[i][j + 1]);
				console.log("Left:" + map[i][j - 1]);
				console.log("Up:" + map[i+1][j]);
				console.log("Down:" + map[i+1][j]);
				console.log(err);
				throw err;
			}
		}
	}
	var dock = false;
	var dx = 0;
	var dy = 0;
	do {
		dx = Math.floor((Math.random() * 20) + 1);
		dy = Math.floor((Math.random() * 20) + 1);
		if (dx > 0 && map[dy][dx - 1] == 1) {
			dock = true;
		} else if (dy > 0 && map[dy - 1][dx] == 1) {
			dock = true;
		} else if (dy < (1000 / square) - 1 && map[dy + 1][dx] == 1) {
			dock = true;
		} else if (dx < (1000 / square) - 1 && map[dy][dx + 1] == 1) {
			dock = true;
		}
		if (map[dy][dx] == 1) {
			dock = false;
		}

	} while(dock == false);
	var mapstring = "";
	for ( i = 0; i < (1000 / square); i++) {
		for ( j = 0; j < (1000 / square); j++) {
			mapstring += map[i][j] + ",";
		}
	}
	var querry = "INSERT INTO maps (map,dx,dy,square) VALUES (\"" + mapstring + "\", " + dx + ", " + dy + ", " + square + ")";
	db.run(querry, function(err) {
		if (err != null) {
			console.log(err);
			res.send("Failed to add record to DB!" + '\n' + err + '\n' + querry);
		} else {
			res.send("Sucess!");

		}
	});
}).post(function(req, res) {
	//New Game Logic Here
});

app.route("/playerX");

app.route("/map").get(function(req, res) {
	var mapid = req.query.mapid;
	var querry = "SELECT * FROM maps WHERE mapID = " + mapid;
	db.get(querry, function(err, row) {
		if (row != null) {
			var map = row.map;
			var dx = row.dx;
			var dy = row.dy;
			res.send({
				"square" : row.square,
				"map" : map,
				"dx" : dx,
				"dy" : dy
			});
		} else {
			res.send("0");
		}
	});
});

app.use(function(req, res) {
	res.status(400);
	url = req.url;
	res.render('404.jade', {
		title : '404: File Not Found',
		url : url
	});
});

// Handle 500
app.use(function(error, req, res, next) {
	res.status(500);
	url = req.url;
	res.render('500.jade', {
		title : '500: Internal Server Error',
		error : error,
		url : url
	});
});

var server = app.listen(80, function() {
	console.log('Listening on port %d', server.address().port);
});
