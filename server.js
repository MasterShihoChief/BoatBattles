var express = require('express');
var jade = require('jade');
var app = express();

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
				map[i].push("water");
			} else {
				map[i].push("land");
			}
		}
	}
	//Sanity Check the map
	for ( i = 0; i < (1000 / square); i++) {
		for ( j = 0; j < (1000 / square); j++) {
			try {
				if (map[i][j] == "water") {
					continue;
				} else {
					if (j > 0 && map[i][j - 1] == "land") {
						continue;
					} else if (i > 0 && map[i - 1][j] == "land") {
						continue;
					} else if (i < (1000 / square) - 1 && map[i + 1][j] == "land") {
						continue;
					} else if (j < (1000 / square) - 1 && map[i][j + 1] == "land") {
						continue;
					} else {
						map[i][j] = "water";
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
		if (dx > 0 && map[dy][dx - 1] == "land") {
			dock = true;
		} else if (dy > 0 && map[dy - 1][dx] == "land") {
			dock = true;
		} else if (dy < (1000 / square) - 1 && map[dy + 1][dx] == "land") {
			dock = true;
		} else if (dx < (1000 / square) - 1 && map[dy][dx + 1] == "land") {
			dock = true;
		}
		if (map[dy][dx] == "land") {
			dock = false;
		}
		
	} while(dock == false);
	var docks = {
		"dockx" : dx,
		"docky" : dy
	};
	var boat1 = {
		"bx" : 4,
		"by" : 3,
		"face": 1,
		"hp" : 3,
		"owner" : "player1"
	};
	var boat2 = {
		"bx" : 12,
		"by" : 5,
		"face": 3,
		"hp" : 3,
		"owner" : "player2"
	};
	var boat3 = {
		"bx" : 13,
		"by" : 3,
		"face": 5,
		"hp" : 13,
		"owner" : "player3"
	};
	var boat4 = {
		"bx" : 1,
		"by" : 10,
		"face": 7,
		"hp" : 3,
		"owner" : "player4"
	};
	var boats = [boat1, boat2, boat3, boat4];
	res.send(JSON.stringify({
		"map" : map,
		"dock" : docks,
		"boats" : boats
	}));
}).post(function(req, res) {
	//New Game Logic Here
});

app.route("/playerX");

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
