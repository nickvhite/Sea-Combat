function Game() {
	this.ships = {
		desk4: {
			amountPlayer: 1,
			amountOpponent: 1,
			length: 4,
			width: 1
		},
		desk3: {
			amountPlayer: 2,
			amountOpponent: 2,
			length: 3,
			width: 1
		},
		desk2: {
			amountPlayer: 3,
			amountOpponent: 3,
			length: 2,
			width: 1
		},
		desk1: {
			amountPlayer: 4,
			amountOpponent: 4,
			length: 1,
			width: 1
		}
	}
	var field = 'myField';
	var amount = 'amountPlayer';
	var involvedShips = 1;
	var player = 'Player 1';
	var that = this;
	var playerField = 'myField';
	var gameField = 'gameHisField';
	var myShootedShips = 0;
	var hisShootedShips = 0;
	var rand =  function(min, max) {
		return Math.floor(Math.random() * (max - min)) + min;
	};
	var createPlayerMatrix = function(matrixLength, arrLength) {
		var matrix = [];
		for (var i = 0; i < matrixLength; i++) {
			matrix[i] = [];
			for (var j = 0; j < arrLength; j++) {
				matrix[i][j] = 0;
			}
		}
		return matrix;
	};
	var createGameMatrix = function(matrixLength, arrLength) {
		var matrix = [];
		for (var i = 0; i < matrixLength; i++) {
			matrix[i] = [];
			for (var j = 0; j < arrLength; j++) {
				matrix[i][j] = '\"\"\"\"\"';
			}
		}
		return matrix;
	};
	this.myField = createPlayerMatrix(10, 10);
	this.hisField = createPlayerMatrix(10, 10);
	this.gameMyField = createGameMatrix(10,10);
	this.gameHisField = createGameMatrix(10, 10);
	var playField = function() {
		console.clear();
		console.table(that[playerField]);
		// console.table(that.hisField);
		console.table(that.gameHisField);
	};
	var positionValidation = function(i, j, ship) {
		var shipWay = that.ships[ship];
		for(var a = i-1; a < i+shipWay.width+1; a++) {
			for(var b = j-1; b < j+shipWay.length+1; b++) {
				if(a<0 || b<0) {
					continue;
				} else if(a>that[field].length-1 || b>that[field][i].length-1) {
					continue;
				} else if (that[field].length < i+shipWay.width
					|| that[field][i].length < j+shipWay.length
					|| that[field][a][b] === 1) {
					if(player === 'Player 1'
						|| player === 'Player 2') {
						console.log('Так кораблики не ставят!')
					}
					return false;
				}
			}
		}
		return true;
	};
	var addingValidation = function(ship) {
		var shipWay = that.ships[ship];
		if(player === 'Player 1' || player === 'Player 2') {
			if(involvedShips <= 9) {
				console.log(player + ' осталось расставить: ' + (10-involvedShips));
				return true;
			} else if(involvedShips > 9) {
				console.log(player + ' корабли расставленны!');
				player = 'Player 2';
				involvedShips = 0;
				return true;
			} else if(shipWay.amount === 0) {
				console.log('Больше нет кораблей данного класса');
				return false;
			}
		} else {
			return true;
		}
	}
	var shipPosition = function(i, j, ship) {
		var shipWay = that.ships[ship];
		var valid = positionValidation(i, j, ship);
		if(valid === true) {
			var addValid = addingValidation(ship);
			if (addValid) {
				for(var a = i; a < i+shipWay.width; a++) {
					for(var b = j; b < j+shipWay.length; b++) {
						that[field][a][b] = 1;
					}
				}
				shipWay[amount] -= 1;
				involvedShips += 1;
			}	
		}
	};
	this.addedShip = function(i, j, ship, orientation) {
		var shipWay = that.ships[ship];
		if(orientation === 'upright' || orientation === 1 || orientation === 2) {
			var gap = shipWay.length;
			shipWay.length = shipWay.width;
			shipWay.width = gap;
			shipPosition(i, j, ship);
			gap = shipWay.length;
			shipWay.length = shipWay.width;
			shipWay.width = gap;
		} else {
			shipPosition(i, j, ship);
		}
	};
	var autoCompile = function(fieldName, amountName) {
		field = fieldName;
		amount = amountName;
		for(var key in that.ships) {
			while(that.ships[key][amount] > 0) {
				var i = rand(0, 9);
				var j = rand(0, 9);
				var x = rand(0, 2);
				that.addedShip(i, j, key, x);
			}
		}
	};
	var shootValidation = function(i, j, field) {
		if(i>=that[field].length || j>=that[field][i].length) {
			console.log('Залп мимо поля');
			return false;
		} else if(that[field][i][j] === 2 || that[field][i][j] === 3 || that[field][i][j] === 4) {
			console.log('Яцейка уже простреленна');
			console.log(player + ', shoot');
			return false;
		} else {
			return true;
		}
	};
	var shipValidation = function(i, j, field) {
		var arrI = [];
		var arrJ = [];
		for(var a = i; a>=0; a--) {
			if(!that[field][a][j]) {
				break;
			} else if(that[field][a][j] === 3) {
				i = a;
			} else if(that[field][a][j] === 0
				|| that[field][a][j] === 2){
				break;
			} else if (that[field][a][j] === 1) {
				return false;
			}
		};
		for(var a = i; a<i+5; a++) {
			if(a<0) {
				continue;
			} else if(that[field][a][j] === 1) {
				return false;
			} else if(that[field][a][j-1] === 3 || that[field][a][j+1] === 3) {
				for(var b = j; b>=0; b--) {
					if(!that[field][a][b]) {
						break;
					} else if(that[field][a][b] === 3) {
						j = b;
					} else if(that[field][a][b] === 0
						|| that[field][a][b] === 2){
						break;
					} else if (that[field][a][j] === 1) {
						return false;
					}
				}
				for(var b = j; b<j+5; b++) {
					if(b<0) {
						continue;
					} else if(that[field][a][b] === 1) {
						return false;
					} else if(that[field][a][b] === 0
						|| that[field][a][b] === 2
						|| !that[field][a][b]) {
						for(var a=0; a<arrI.length; a++) {
							for(var b=0; b<arrJ.length; b++) {
								if(a===b) {
									that[field][arrI[a]][arrJ[b]] = 4;
									that[gameField][arrI[a]][arrJ[b]] = 'DEAD';
								} else {
									continue;
								}
								for(var c = arrI[0]-1; c<=arrI[arrI.length-1]+1; c++) {
									for(var d = arrJ[0]-1; d<=arrJ[arrJ.length-1]+1; d++ ) {
										if(c<0 || d<0) {
											continue;
										}
										if(that[field][c][d] === 2
											|| that[field][c][d] === 4) {
											continue;
										} else if(that[field][c][d] === 0) {
											that[field][c][d] = 2;
											that[gameField][c][d] = 'O';
										}
									}
								}
							}
						}
						playField();
						gameValidation();
						return true;
					} else if(that[field][a][b] === 3) {
						arrI.push(a);
						arrJ.push(b);
					}
				}
			} else if(that[field][a][j-1] === 1 || that[field][a][j+1] === 1) {
				return false;
			} else if(that[field][a][j] === 0 
				|| that[field][a][j] === 2 
				|| !that[field][a][j]) {
				for(var a=0; a<arrI.length; a++) {
					for(var b=0; b<arrJ.length; b++) {
						if(a===b) {
							that[field][arrI[a]][arrJ[b]] = 4;
							that[gameField][arrI[a]][arrJ[b]] = 'DEAD';
						} else {
							continue;
						}
						for(var c = arrI[0]-1; c<=arrI[arrI.length-1]+1; c++) {
							for(var d = arrJ[0]-1; d<=arrJ[arrJ.length-1]+1; d++ ) {
								if(c<0 || d<0) {
									continue;
								} else if(that[field][c][d] === 2
									|| that[field][c][d] === 4) {
									continue;
								} else if(that[field][c][d] === 0) {
									that[field][c][d] = 2;
									that[gameField][c][d] = 'O';
								}
							}
						}
					}
				}
				playField();
				gameValidation();
				return true; 
			} else if(that[field][a][j] === 3) {
				arrI.push(a);
				arrJ.push(j);
			}
		}
	}
	var gameValidation = function() {
		if(field === 'myField') {
			myShootedShips += 1;
			console.log(myShootedShips);
			if(myShootedShips === 10) {
				console.log(player + 'WIN')
			}
		} else if(field === 'hisField') {
			hisShootedShips += 1;
			console.log(hisShootedShips);
			if(hisShootedShips === 10) {
				console.log(player + 'WIN')
			}
		}
	}
	var playerValidation = function(status) {
		if(status === 'hit') {
			if(gameField === 'gameMyField') {
				player = 'Player 2';
				field = 'myField';
				gameField = 'gameMyField';
				console.log(player + ', shoot');
			} else if(gameField === 'gameHisField') {
				player = 'Player 1';
				field = 'hisField';
				gameField = 'gameHisField';
				console.log(player + ', shoot');
			}
		} else if(status === 'not'){
			if(gameField === 'gameHisField') {
				player = 'Player 2';
				field = 'myField';
				gameField = 'gameMyField';
				console.log(player + ', shoot');
			} else if(gameField === 'gameMyField') {
				player = 'Player 1';
				field = 'hisField';
				gameField = 'gameHisField';
				console.log(player + ', shoot');
			}
		}
	}
	this.shoot = function(i, j, player) {
		var valid = shootValidation(i, j, field);
		if(valid) {
			if(that[field][i][j] === 0) {
				that[field][i][j] = 2;
				that[gameField][i][j] = 'O';
				playField();
				playerValidation('not');
			} else if(that[field][i][j] === 1) {
				that[field][i][j] = 3;
				that[gameField][i][j] = '\"\"X\"\"';
				playField();
				shipValidation(i, j, field);
				playerValidation('hit');
			}
		}
	}
	this.start = function(gameType, compileType) {
		if(gameType === 'vsPC' && compileType === 'auto') {
			player = 'PC';
			autoCompile('myField', 'amountPlayer');
			autoCompile('hisField', 'amountOpponent');
			player = 'Player 1';
		} else if(gameType === 'vsPC' && compileType === 'manual') {
			player = 'Player 1';
			autoCompile('hisField', 'amountOpponent');
		} else if(gameType === 'vsPlayer' && compileType === 'auto') {
			playerField = 'gameMyField';
			player = 'PC';
			autoCompile('myField', 'amountPlayer');
			autoCompile('hisField', 'amountOpponent');
			player = 'Player 1';
		} else if(gameType === 'vsPlayer' && compileType === 'manual') {
			player = 'Player 1';
		}
		playField();
		console.log('Player 1, shoot')
	};
}

var game = new Game();
game.start('vsPlayer', 'auto');
