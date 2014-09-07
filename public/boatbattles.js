var map;
var boats;
var xmarks;

function createArray(length) {
	var arr = new Array(length || 0), i = length;

	if (arguments.length > 1) {
		var args = Array.prototype.slice.call(arguments, 1);
		while (i--)
		arr[length - 1 - i] = createArray.apply(this, args);
	}

	return arr;
}

function drawMap(square) {
	//map = createArray(1000 / square, 1000 / square);
	$.getJSON("http://127.0.0.1:80/genmap?square=" + square, function(data) {
		map = data.map;
		map[data.dock.docky][data.dock.dockx] = "docks";
		var boats = [];
		var x;
		for (x in data.boats) {
			boats.push(data.boats[x]);
		}
		var docCanvas = document.getElementById("BattleMap");
		var canvas = docCanvas.getContext("2d");
		canvas.fillStyle = "#0000FF";
		canvas.fillRect(0, 0, 1000, 1000);
		for (var i = 0; i < map.length; i++) {
			for (var j = 0; j < map.length; j++) {
				switch(map[i][j]) {
				case "land":
					canvas.fillStyle = "#00FF00";
					canvas.fillRect(i * square, j * square, square, square);
					break;
				case "water":
					canvas.fillStyle = "#0000FF";
					canvas.fillRect(i * square, j * square, square, square);
					break;
				case "docks":
					canvas.fillStyle = "#FFFFFF";
					canvas.fillRect(i * square, j * square, square, square);
					break;
				default:
					canvas.fillStyle = "#FF0000";
					canvas.fillRect(i * square, j * square, square, square);
					break;
				}
			}
		}
		drawBoats(boats, square);

	}, function(jqXHR, textStatus, errorThrown) {
		alert('error ' + textStatus + " " + errorThrown);
	});

}

function drawGrid(square) {
	var c = document.getElementById("BattleMap");
	var ctx = c.getContext("2d");
	for (var i = 0; i < 1000 / square; i++) {
		ctx.moveTo(i * square, 0);
		ctx.lineTo(i * square, 1000);
		ctx.stroke();
		ctx.moveTo(0, i * square);
		ctx.lineTo(1000, i * square);
		ctx.stroke();
	}
}

function drawCircle(circle, square) {
	var c = document.getElementById("BattleMap");
	var ctx = c.getContext("2d");
	ctx.save();
	ctx.beginPath();
	ctx.fillStyle = circle.color;
	ctx.strokeStyle = "black";
	ctx.lineWidth = 3;
	ctx.arc(circle.bx, circle.by, square / 2, 0, Math.PI * 2, false);
	ctx.closePath();
	ctx.fill();
	ctx.stroke();
	ctx.restore();
}

function drawBoats(boats, square) {
	for (var i = 0; i < boats.length; i++) {
		drawCircle(boats[i], square);
	}
}

function drawMarks(playerID) {
	var c = document.getElementById("BattleMap");
	var ctx = c.getContext("2d");
	var xlocations = createArray(10, 2);
	$.get("playerX", function(data) {
		var list = data.playersx;
		for (x in list) {
			var j = i * 2;
			xlocations[i][0] = list[j];
			xlocations[i][1] = list[j + 1];
		}
	});
	for (var i = 0; i < xlocations.length; i++)
		var mark = new Image();
	mark.onload = function() {
		ctx.drawImage(this, xlocations[i][0] * square + square / 4, xlocations[i][1] * square + square / 4, square / 2, square / 2);
	};
	mark.src = "./images/X_mark.png";

}

function setMap(size) {
	drawMap(size);
	drawBoats(size);
	drawMarks(size);
}
