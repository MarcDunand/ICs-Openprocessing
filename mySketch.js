let scale = 2;
let arrWidth = 137*scale;  //1741
let arrHeight = 118*scale;   //878
let tile = 4;
let tileArr = [];
let roomArr = [];
let hallArr = [];


function initGridArray(arr, rows, cols, cont) { //makes a 2d array of rows X cols and intializeses each elem to cont
	for(let i = 0; i < rows; i++) {
		arr.push([]);
		for(let j = 0; j < cols; j++) {
			arr[i].push(cont);
		}
	}
}

function drawGrid(x) {  //draws grid of step x
	push();
	stroke(255, 0, 0, 40);
	strokeWeight(1);
	for(let i = 0; i < arrWidth; i += x) {
		line(i, 0, i, arrHeight);
	}
	for(let i = 0; i < arrHeight; i += x) {
		line(0, i, arrWidth, i);
	}
	pop();
}

function binarySplit(x1, w, y1, h) {
	if(w < randomGaussian(15, 30) || h < randomGaussian(25, 40)) {
		var randx = random(w/3);
		var randy = random(h/3);
		roomArr.push([floor(x1 + randx), floor(y1 + randy), floor((w - randx) - random(w/3)), floor((h - randy) - random(h/3))]);
		return;
	}
	else {
		var vSplit = random(w);
		var hSplit = random(h);

		var hMin = min(vSplit, w-vSplit);
		var vMin = min(hSplit, h-hSplit);

		var isHSplit = (vMin <= hMin);

		if(isHSplit) {
			binarySplit(floor(x1), floor(vSplit), floor(y1), floor(h));
			binarySplit(floor(x1 + vSplit), floor((w - vSplit)), floor(y1), floor(h));
		}
		else {
			binarySplit(floor(x1), floor(w), floor(y1), floor(hSplit));
			binarySplit(floor(x1), floor(w), floor(y1 + hSplit), floor((h - hSplit)));
		}
		return;
	}
}

function pseudoRandWalk(x, y, dir, len) {
	var dirMap = [[0, -1], [1, 0], [0, 1], [-1, 0]]; //up, right, down, left
	
	for(var i = 0; i < len; i++) {
		if(random() < 0.05) { //turn right
			dir = (dir + 1) % 4;
		}
		else if(random() > 0.95) { //turn left
			dir -= 1;
			if(dir == -1) { //not using mod because p5.js is stoopid
				dir = 3;
			}
		}
		else {
			//makes sure is in bounds of this chunk, must change later for cross-chunk paths
			if(x >= 0 && y >= 0 && x < arrWidth && y < arrHeight) {
				tileArr[y][x] = false;
			}
			x = x+1*dirMap[dir][0];
			y = y+1*dirMap[dir][1];
		}
	}
}

function setup() {	
	createCanvas(arrWidth*tile, arrHeight*tile);
	background(0);
	fill(255);
	noStroke();
	
	initGridArray(tileArr, int(arrHeight), int(arrWidth), true);
			
	binarySplit(0, arrWidth, 0, arrHeight);
	
				
	for(i = 0; i < roomArr.length; i++) {
		var x = roomArr[i][0];
		var y = roomArr[i][1];
		var w = roomArr[i][2];
		var h = roomArr[i][3];
		
		var circumference = 2*(w+h);
		
		var hallLen = circumference/2;
		var distPHall = 10;
		
		var hallCount = circumference/distPHall;
		var wallPercent = h/(w+h)
		
		for(j = 0; j < hallCount; j++) {
			if(random() < wallPercent) { //start from wall
				if(random() < 0.5) { //start from left wall
					pseudoRandWalk(x, floor(random(y, y+h)), 3, hallLen);
				}
				else { //start from right wall
					pseudoRandWalk(x+w, floor(random(y, y+h)), 1, hallLen);
				}
			}
			else { //start from floor or ceiling
				if(random() < 0.5) { //start from ceiling
					pseudoRandWalk(floor(random(x, x+w)), y, 0, hallLen);
				}
				else { //start from floor
					pseudoRandWalk(floor(random(x, x+w)), y+h, 2, hallLen);
				}
			}
		}
	}
	
	let rmX;
	let rmY;
	let rmW;
	let rmH;
	for(i = 0; i < roomArr.length; i++) {
		rmX = roomArr[i][0];
		rmY = roomArr[i][1];
		rmW = roomArr[i][2];
		rmH = roomArr[i][3];
		for(let row = 0; row < rmW; row++) {
			for(let col = 0; col < rmH; col++) {
				if(row == 0 || col == 0 || row == rmW-1 || col == rmH-1) {
					tileArr[rmY + col][rmX + row] = false;
				}
				else {
					tileArr[rmY + col][rmX + row] = true;
				}
			}
		}
	}

	for(let row = 0; row < tileArr.length; row++) {
		for(let col = 0; col < tileArr[0].length; col++) {
			if(!tileArr[row][col]) {
				square(col*tile, row*tile, tile);
			}
		}
	}
	//drawGrid(tile);
	
	noFill();
	stroke(255);
	strokeWeight(8);
	rect(0, 0, arrWidth*tile, arrHeight*tile)
}
