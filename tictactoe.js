'use strict';

var save = function(state) {
  var toSave = [1, 1, 1, 1, 1, 1, 1, 1, 1];
  for (var m = 0; m < state.length; m++) {
    if (state[m].innerHTML.length > 0) {
      toSave[m] = state[m].innerHTML.replace(/"/g, '');
    }
  }
  localStorage.saved = toSave;
};

var resetGame = function() {
  clearLocal();
  location.reload();
  game();
  return;
};

var clearLocal = function() {
  localStorage.saved = [];
};

var StatusReport = function(element) {
  function setText(message) {
    element.innerHTML = message;
  }
  return {sendMessage: setText};
};

var game = (function() {
  var tiles = document.querySelectorAll('#gameboard .tile');
  var players = ['X', 'O'];
  var currentTurn = 0;
  var isOver = false;
  var report = new StatusReport(document.querySelector('#status'));
  tryLoad();

  function isValid(button) {
    return button.innerHTML.length < 1;
  }
  var draw = function(button, letter) {
    button.innerHTML = letter;
  };

  var parseTiles = function(tilesArray) {
    var nodes = [];
    for (var i = 0, n; n = tilesArray[i]; ++i) {
      nodes.push(n);
    }
    return nodes;
  };
  var randomAi = function(tilesArray) {
    var nodes = parseTiles(tilesArray);
    var available = nodes.filter(function(node) {
      return node.innerHTML.length === 0;
    });
    var choice = Math.floor(Math.random() * (available.length));
    draw(available[choice], 'O');
    return;
  };

  var finishGame = function(tilesArray) {
    for (var i = 0; i < tilesArray.length; i++) {
      tilesArray[i].disabled = 'true';
    }
    return;
  };
  function tryLoad() {
    try {
      loadIt();
    } catch (e) {
      return;
    } finally {
      clearLocal();
    }
  }
  function loadIt() {
    var container = localStorage.saved.replace(/,/g, '');
    for (var h = 0; h < container.length; h++) {
      if (container[h] === 'O' || container[h] === 'X') {
        tiles[h].innerHTML = container[h];
      }
    }
  }
  var stateLoop = function() {
    isOver = checkWinner(tiles, players, currentTurn);
    save(tiles);
    checkGameState();
  };

  var isTableFull = function(tilesArray) {
    for (var i = 0; i < tilesArray.length; i++) {
      if (tilesArray[i].innerHTML.length === 0) {
        return false;
      }
    }
    return true;
  };

  var checkGameState = function() {
    if (isOver) {
      clearLocal();
      report.sendMessage('player ' + players[currentTurn] + ' have won');
      finishGame(tiles);
      return;
    }
    if (isTableFull(tiles)) {
      clearLocal();
      report.sendMessage('tied!');
      finishGame(tiles);
      return;
    }
    currentTurn ^= 1;
  };

  var checkWinner = function(tilesArray, playersList, turn) {
    if (tilesArray[0].innerHTML === playersList[turn] &&
      tilesArray[1].innerHTML === playersList[turn] &&
      tilesArray[2].innerHTML === playersList[turn]) {
      return true;
    }
    if (tilesArray[3].innerHTML === playersList[turn] &&
      tilesArray[4].innerHTML === playersList[turn] &&
      tilesArray[5].innerHTML === playersList[turn]) {
      return true;
    }
    if (tilesArray[6].innerHTML === playersList[turn] &&
      tilesArray[7].innerHTML === playersList[turn] &&
      tilesArray[8].innerHTML === playersList[turn]) {
      return true;
    }
    if (tilesArray[0].innerHTML === playersList[turn] &&
      tilesArray[3].innerHTML === playersList[turn] &&
      tilesArray[6].innerHTML === playersList[turn]) {
      return true;
    }
    if (tilesArray[1].innerHTML === playersList[turn] &&
      tilesArray[4].innerHTML === playersList[turn] &&
      tilesArray[7].innerHTML === playersList[turn]) {
      return true;
    }
    if (tilesArray[2].innerHTML === playersList[turn] &&
      tilesArray[5].innerHTML === playersList[turn] &&
      tilesArray[8].innerHTML === playersList[turn]) {
      return true;
    }
    if (tilesArray[0].innerHTML === playersList[turn] &&
      tilesArray[4].innerHTML === playersList[turn] &&
      tilesArray[8].innerHTML === playersList[turn]) {
      return true;
    }
    if (tilesArray[2].innerHTML === playersList[turn] &&
      tilesArray[4].innerHTML === playersList[turn] &&
      tilesArray[6].innerHTML === playersList[turn]) {
      return true;
    }
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
})();
