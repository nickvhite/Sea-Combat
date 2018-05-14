window.onload = function(){	
	var game;
	function Game(type) {
		var GAME_TYPES = ['One Player', 'Two Players'];
		if (GAME_TYPES.indexOf(type) === -1) { throw new Error('Undefined game type'); }
		if (type === 'One Player') {
		this.player = {
				one: new Player('human'),
				two: new Player('computer')
			}
		} else {
			this.player = {
				one: new Player('human'),
				two: new Player('human')
			}
		}
		this.gamer = this.player.one;
		console.clear();
		console.log(this.player.one);
		console.log(this.player.two);
	}

	function Player(type) {
		var PLAYER_TYPES = ['human', 'computer'];
		this.shipTypes = {
			1: { max: 4, count: 0 },
			2: { max: 3, count: 0 },
			3: { max: 2, count: 0 },
			4: { max: 1, count: 0 }
		}
		if (PLAYER_TYPES.indexOf(type) === -1) { throw new Error('Undefined player type'); }
		this.type = type;
		this.fleet = new Fleet(this.shipTypes);
		this.field = new Field();
		this.playField = new PlayField();
		if (this.type === 'computer') {
			this.name('Captain Jack Sparrow');
			// autoCompileShips();
		}
	}
	Player.prototype.name = function(name) {
		this.name = name;
	}
	Player.prototype.addShip = function(id, x, y) {
		var index = 0;
		this.fleet[id].cells = new Array();
		for(var i = y; i < y+this.fleet[id].aliveDeck; i++) {
			this.field[x][i].shipPresent = true;
			this.field[x][i].ship = this.fleet[id];
			this.playField[x][i] = id;
			this.fleet[id].cells[index] = {
				x: x,
				y: i
			}
			index++;
		}
	}

	function Fleet(shipTypes) {
		var fleet = {};
		var shipId = 1;
		for (var key in shipTypes) {
				while (shipTypes[key].count < shipTypes[key].max) {
					fleet[shipId] = new Ship(+key);
					shipId++;
					shipTypes[key].count++;
			}
		}
		return fleet;
	} 

	function PlayField() {
		var FIELD_SIZE = 10;
		function createField() {
			var field = [];
			for (var i = 0; i < FIELD_SIZE; i++) {
				field[i] = [];
				for (var j = 0; j < FIELD_SIZE; j++) {
					field[i][j] = 0;
				}
			}
			return field;
		}
		return createField();
	}

	function Field() {
		var FIELD_SIZE = 10;
		function createField() {
			var field = [];
			for (var i = 0; i < FIELD_SIZE; i++) {
				field[i] = [];
				for (var j = 0; j < FIELD_SIZE; j++) {
					field[i][j] = new Cell();
				}
			}
			return field;
		}
		return createField();
	}

	function Cell() {
		this.opened = false;
		this.shipPresent = false;
		this.ship = null;
	}

	function Ship(size) {
		this.turned = false;
		this.cells = new Array();
		this.aliveDeck = size;
		this.horisontal = true;
		this.shipAlive = true;
	}

	function turnShip(event) {
		var target = event.target;
		if(target.classList.contains('active_ship') && game.gamer.fleet[target.id].turned) {
			var targetData = target.getBoundingClientRect();
			target.style.width = targetData.height + 'px';
			target.style.height = targetData.width + 'px';
			game.gamer.fleet[target.id].horisontal = !game.gamer.fleet[target.id].horisontal;
		}else{
			return;
		}
	}

	function createBackground() {
		var backGround = document.getElementById('background');
		var fragment = document.createDocumentFragment();
		var table = document.createElement('table');
		table.classList.add('background__table');
		fragment.appendChild(table);
		for(var i = 0; i<24; i++) {
			var tr = document.createElement('tr');
			tr.classList.add('background__table__row');
			for(var j = 0; j<36; j++) {
				var td = document.createElement('td');
				td.classList.add('background__table__cell');
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		backGround.appendChild(fragment);
	}

	function createFightField() {
		var field = document.getElementsByClassName('field')[0];
		var fragment = document.createDocumentFragment();
		var table = document.createElement('table');
		table.classList.add('field_table');
		fragment.appendChild(table);
		for(var i = 0; i<10; i++) {
			var tr = document.createElement('tr');
			tr.classList.add('field_table_row');
			for(var j = 0; j<10; j++) {
				var td = document.createElement('td');
				td.classList.add('field_table_cell');
				tr.appendChild(td);
			}
			table.appendChild(tr);
		}
		field.appendChild(fragment);	
	}

	createBackground();
	createFightField();

	var shipData = null;
	var playField = document.getElementsByClassName('field_table')[0];
	var field = document.querySelector('.field');
	var fleet = document.getElementById('fleet');
	var notActiveShip = document.querySelectorAll('.not_active_ship');
	var ship1 = document.getElementById('1');
	var ship2 = document.getElementById('2');
	var ship3 = document.getElementById('3');
	var ship4 = document.getElementById('4');
	var ship5 = document.getElementById('5');
	var ship6 = document.getElementById('6');
	var ship7 = document.getElementById('7');
	var ship8 = document.getElementById('8');
	var ship9 = document.getElementById('9');
	var ship10 = document.getElementById('10');

	var moveShip = function() {
		var ship;
		var playFieldData = null;
		var initialMouseCoords = {
			y: null,
			x: null
		}
		var initialShipCoords = {
			y: null,
			x: null
		}

		function downHandler(event) {
			ship = event.target;
			if(ship.classList.contains('fleet_4_deck_ship')){
				shipData = notActiveShip[0].getBoundingClientRect();
			}else if(ship.classList.contains('fleet_3_deck_ship')){
				shipData = notActiveShip[1].getBoundingClientRect();
			}else if(ship.classList.contains('fleet_2_deck_ship')){
				shipData = notActiveShip[2].getBoundingClientRect();
			}else if(ship.classList.contains('fleet_1_deck_ship')){
				shipData = notActiveShip[3].getBoundingClientRect();
			}
			playFieldData = playField.getBoundingClientRect();
			initialMouseCoords = { y: event.offsetY, x: event.offsetX };
			initialShipCoords = { y: shipData.top, x: shipData.left };
			console.log(ship)
			document.onmousemove = moveHandler;
			document.onmouseup = upHandler;
		}

		function moveHandler(event) {
			ship.style.top = (event.clientY - initialMouseCoords.y) + 'px';
			ship.style.left = (event.clientX - initialMouseCoords.x) + 'px';
		}

		function upHandler(event) {
			if((event.clientY - initialMouseCoords.y)>=playFieldData.top
				&& (event.clientY-initialMouseCoords.y+shipData.height)<=playFieldData.bottom
				&& (event.clientX - initialMouseCoords.x>=playFieldData.left)
				&& (event.clientX-initialMouseCoords.x+shipData.width)<=playFieldData.right) {
				game.gamer.fleet[ship.id].turned = true;
				field.appendChild(ship);
			}else{
				game.gamer.fleet[ship.id].turned = false;
				ship.style.top = initialShipCoords.y + 'px';
				ship.style.left = initialShipCoords.x + 'px';
				fleet.appendChild(ship);
			}
			document.onmousemove = null;
			document.onmouseup = null;
		}

		return {
			bindElement: function(element) {
				element.onmousedown = downHandler;
			}
		}
	}

	moveShip().bindElement(ship1);
	moveShip().bindElement(ship2);
	moveShip().bindElement(ship3);
	moveShip().bindElement(ship4);
	moveShip().bindElement(ship5);
	moveShip().bindElement(ship6);
	moveShip().bindElement(ship7);
	moveShip().bindElement(ship8);
	moveShip().bindElement(ship9);
	moveShip().bindElement(ship10);

	function animationBody(value) {
		var body = document.body.style;
		body.transition = 'opacity 0.3s linear 0s';
		body.webkitTransition = 'opacity 0.3s linear 0s';
		body.oTransition = 'opacity 0.3s linear 0s';
		body.mozTransition = 'opacity 0.3s linear 0s';
		body.opacity = value;
		body.filter = 'alpha(opacity=' + value + ')';
	}
	 
	function animationElement(element, property, duration, timing, delay, newValue) {
		var transitionOptions = property+' '+duration+' '+timing+' '+delay;
		var elem = element.style;
		var prop = cammelCaseProperty(property);
		elem.transition = transitionOptions;
		elem.webkitTransition = transitionOptions;
		elem.oTransition = transitionOptions;
		elem.mozTransition = transitionOptions;
		elem[prop] = newValue;
		if(prop === 'opacity') {
			elem.filter = 'alpha(opacity=' + newValue + ')';
		}
	}

	function cammelCaseProperty(property) {
		var index;
		var validProperty = '';
		for(var i=0; i<property.length; i++) {
			if(property[i] === '-') {
				index = i;
				continue;
			} else {
				if (i === index+1) {
					validProperty += property[i].toUpperCase();
					continue;
				} 
				validProperty += property[i];
			}
		}
		return validProperty;
	}


	function createGame(gameType) {
		game = new Game(gameType);
		var quickStartButton = document.getElementsByClassName('player_form_quick_start')[0].style;
		var playerName = document.getElementsByClassName("player_name")[0];
		if(gameType === 'Two Players') {
			quickStartButton.display = 'inline-block';
			playerName.setAttribute('value', 'Игрок 2');
		} else if(gameType === 'One Player') {
			quickStartButton.display = '';
			playerName.setAttribute('value', 'Игрок 1');
		}
		return game;
	}

	setTimeout(animationBody, 100, 1);

	function gameStart(gameType, hidenPage, showenPage) {
		hidePage(hidenPage);	
		setTimeout(showPage, 350, showenPage);
		createGame(gameType);
	}

	document.getElementsByClassName('game_button_single_player')[0].onclick = function() {
		gameStart('One Player', page_1, page_2);
	};

	document.getElementsByClassName('game_button_two_players')[0].onclick = function() {
		gameStart('Two Players', page_1, page_2);
	};

	function gameBack(hidenPage, showenPage) {
		delete game;
		hidePage(hidenPage);
		setTimeout(showPage, 350, showenPage);
	}

	document.getElementById('option_back').onclick = function() {
		gameBack(page_2, page_1);	
	};

	if (document.documentElement.hidden === undefined) {
	  Object.defineProperty(Element.prototype, "hidden", {
	    set: function(value) {
	      this.setAttribute('hidden', value);
	    },
	    get: function() {
	      return this.getAttribute('hidden');
	    }
	  });
	}

	function hidePage(page) {
		animationBody(0);
		page.hidden = true;
	}

	function showPage(page) {
		animationBody(1);
		page.hidden = false;
		if(page === page_2) {
			document.getElementsByClassName('option_back')[0].style.display = 'inline-block';
		} else {
			document.getElementsByClassName('option_back')[0].style.display = 'none';
		}
	}

	function soundButton() {
		sound_on.hidden = !sound_on.hidden;
		sound_off.hidden = !sound_off.hidden;
	}

	var bgVolume = 0;

	function soundVolume() {
		var audio = document.getElementById('audio');
		var volum = document.getElementsByClassName('option_sound_volume_range')[0].value;
		audio.volume = volum;
		if(volum === '0') {
			sound_on.hidden = true;
			sound_off.hidden = false;
		} else {
			bgVolume = volum;
			sound_on.hidden = false;
			sound_off.hidden = true;
		}
	};

	document.getElementsByClassName('option_sound_volume_range')[0].oninput = soundVolume;

	function bgAudioOnOff() {
		var volum = document.getElementsByClassName('option_sound_volume_range')[0].value;
		if(volum>0) {
			bgVolume = volum;
			sound_on.hidden = !sound_on.hidden;
			sound_off.hidden = !sound_off.hidden;
			document.getElementById('audio').volume = 0;
			document.getElementsByClassName('option_sound_volume_range')[0].value = 0;
		} else if(volum==='0') {
			sound_on.hidden = !sound_on.hidden;
			sound_off.hidden = !sound_off.hidden;
			document.getElementById('audio').volume = bgVolume;
			document.getElementsByClassName('option_sound_volume_range')[0].value = bgVolume;
		}
	}

	document.getElementById('sound_button').onclick = bgAudioOnOff;

	function sel(value) {
		player_name.select();
	}

	document.getElementsByClassName("player_name")[0].onfocus = sel;
}