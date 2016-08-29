'use strict';

function save(game) {
  var toSave = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  for (var m = 0; m < game.length; m++) {
    if (game[m].innerHTML.length > 0) {
      toSave[m] = game[m].innerHTML.replace(/"/g, '');
    }
  }
  localStorage.saved = toSave;
}

function isValid(button) {
  return button.innerHTML.length < 1;
}

function draw(button, letter) {
  button.innerHTML = letter;
}

function checkWinner(tiles, players, currentTurn) {
  if (tiles[0].innerHTML === players[currentTurn] &&
    tiles[1].innerHTML === players[currentTurn] &&
    tiles[2].innerHTML === players[currentTurn]) {
    return true;
  }
  if (tiles[3].innerHTML === players[currentTurn] &&
    tiles[4].innerHTML === players[currentTurn] &&
    tiles[5].innerHTML === players[currentTurn]) {
    return true;
  }
  if (tiles[6].innerHTML === players[currentTurn] &&
    tiles[7].innerHTML === players[currentTurn] &&
    tiles[8].innerHTML === players[currentTurn]) {
    return true;
  }
  if (tiles[0].innerHTML === players[currentTurn] &&
    tiles[3].innerHTML === players[currentTurn] &&
    tiles[6].innerHTML === players[currentTurn]) {
    return true;
  }
  if (tiles[1].innerHTML === players[currentTurn] &&
    tiles[4].innerHTML === players[currentTurn] &&
    tiles[7].innerHTML === players[currentTurn]) {
    return true;
  }
  if (tiles[2].innerHTML === players[currentTurn] &&
    tiles[5].innerHTML === players[currentTurn] &&
    tiles[8].innerHTML === players[currentTurn]) {
    return true;
  }
  if (tiles[0].innerHTML === players[currentTurn] &&
    tiles[4].innerHTML === players[currentTurn] &&
    tiles[8].innerHTML === players[currentTurn]) {
    return true;
  }
  if (tiles[2].innerHTML === players[currentTurn] &&
    tiles[4].innerHTML === players[currentTurn] &&
    tiles[6].innerHTML === players[currentTurn]) {
    return true;
  }
}

function isTableFull(tiles) {
  for (var i = 0; i < tiles.length; i++) {
    if (tiles[i].innerHTML.length === 0) {
      return false;
    }
  }
  return true;
}

var parseTiles = function(tiles) {
  var nodes = [];
  for (var i = 0, n; n = tiles[i]; ++i) {
    nodes.push(n);
  }
  return nodes;
};

function randomAi(tiles) {
  var nodes = parseTiles(tiles);
  var available = nodes.filter(function(node) {
    return node.innerHTML.length === 0;
  });
  var choice = Math.floor(Math.random() * (available.length));
  draw(available[choice], 'O');
  return;
}

var finishGame = function(tiles) {
  for (var i = 0; i < tiles.length; i++) {
    tiles[i].disabled = 'true';
  }
  return;
};

var resetGame = function() {
  localStorage.saved = [];
  location.reload();
  return;
};

var StatusReport = function(element) {
  function setText(message) {
    element.innerHTML = message;
  }
  return {sendMessage: setText};
};

var game = function() {
  var tiles = document.querySelectorAll('#gameboard .tile');
  tryLoad();
  var players = ['X', 'O'];
  var currentTurn = 0;
  var isOver = false;
  var report = new StatusReport(document.querySelector('#status'));

  var stateLoop = function() {
    isOver = checkWinner(tiles, players, currentTurn);
    checkGameState();
    save(tiles);
  };

  var checkGameState = function() {
    if (isOver) {
      report.sendMessage('player ' + players[currentTurn] + ' have won');
      finishGame(tiles);
      return;
    }
    if (isTableFull(tiles)) {
      report.sendMessage('tied!');
      finishGame(tiles);
      return;
    }
    currentTurn ^= 1;
  };

  report.sendMessage('player ' + players[currentTurn] + "'s turn");

  for (var i = 0; i < tiles.length; i++) {
    tiles[i].addEventListener('click', function() {
      if (!isValid(event.target)) {
        report.sendMessage('Invalid move, the tile is already occupied');
      } else {
        draw(event.target, 'X');
        stateLoop();
        if (!isOver) {
          randomAi(tiles);
          stateLoop();
        }
      }
    });
  }

  function tryLoad() {
    try {
      loadIt();
    } catch (e) {
      return;
    } finally {
      localStorage.saved = [];
    }
  }

  function loadIt() {
    var container = localStorage.saved.replace(/,/g, '');
    for (var h = 0; h < container.length; h++) {
      if (container[h] === 'O' || container[h] === 'X') {
        tiles[h].innerHTML = container[h];
      }
    }
    localStorage.saved = [];
  }
};

window.onload = game();
