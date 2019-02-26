let deck = [], dealerDeck = [], playerDeck = [];
let suits = ['s', 'h', 'd', 'c'];
let ranks = ['A', 2, 3, 4, 5, 6, 7, 8, 9, 10, 'J', 'Q', 'K'];

function Card(suit, rank) {
  this.suit = suit;
  this.rank = rank;
  this.getScore = function() {
    if (['J', 'Q', 'K'].includes(this.rank)) {
      return 10;
    } else if (this.rank == 'A') {
      return 11;
    } else {
      return this.rank;
    }
  };
}

function countScore(deck) {
  return deck.reduce(function(sum, card){
    return sum + card.getScore();
  }, 0);
}

function aceScore(deck) {
  let acesRank = [];
  for (let i=0; i<deck.length; i++) {
    acesRank.push(deck[i].getScore());
  }
  while (acesRank.some( function(rank) { return rank == 11; } )
    && acesRank.reduce( function(sum, rank) { return sum + rank; }, 0) > 21) {
    acesRank[acesRank.indexOf(11)] = 1;
  }
  return acesRank.reduce(function(sum, rank) { return sum + rank; }, 0);
}

function score (deck) {
  if ( countScore(deck) > 21
    && deck.some(function(card){ return card.rank == 'A'; }) ) {
    return aceScore(deck);
  } else {
    return countScore(deck);
  }
}

function addResultScores(deck, id) {
  let scr = document.createElement('h3');
  if ( score(deck) == 21 && deck.length == 2 ) {
    scr.style.textShadow = 'rgba(255, 255, 204, 0.4) 0 0 50px';
    scr.innerHTML = 'Black Jack!';
  } else {
    scr.innerHTML = score(deck);
  }
  $(id).append(scr);
}

function pickCard(dest, selector, faceUp) {
  let card = deck.shift();
  dest.push(card);

  let className = 'card ' + card.suit + card.rank;
  if (faceUp)
      className += ' faceUp';
  let div = document.createElement('div');
  div.className = className;
  $(selector).append(div);
}

function faceOn() {
  $('.faceUp').removeClass('faceUp');
}

function dealerPickCards() {
  while (score(dealerDeck) < 17){
    pickCard(dealerDeck, '.dealerCards', true);
    faceOn();
  }
}

function youWin() {
  $('#gameResult').html('You win').addClass('win');
}

function youLose() {
  $('#gameResult').html('You lose').addClass('lose');
}

function draw() {
  $('#gameResult').html('Draw').addClass('draw');
}

function showResult() {
  faceOn();
  dealerPickCards();
  $('#playerButtons').hide();
  $('#playerScores').empty();
  if (score(dealerDeck) < score(playerDeck) || score(dealerDeck) > 21) {
    youWin();
    addResultScores(dealerDeck, '#dealerScores');
    addResultScores(playerDeck, '#playerScores');
  } else if ( score(dealerDeck) == 21 && score(playerDeck) == 21
    && dealerDeck.length == 2 ) {
    youLose();
    addResultScores(dealerDeck, '#dealerScores');
    addResultScores(playerDeck, '#playerScores');
  } else if ( score(dealerDeck) == score(playerDeck) ) {
    draw();
    addResultScores(dealerDeck, '#dealerScores');
    addResultScores(playerDeck, '#playerScores');
  } else {
    youLose();
    addResultScores(dealerDeck, '#dealerScores');
    addResultScores(playerDeck, '#playerScores');
  }
}

function pickNewCard() {
  pickCard(playerDeck, '.playerCards');
  if (score(playerDeck) == 21) {
    showResult();
  } else if (score(playerDeck) > 21) {
    $('#playerButtons').hide();
    $('#playerScores').empty();
    youLose();
    addResultScores(playerDeck, '#playerScores');
  }
}

function newGame() {
  deck = [];
  dealerDeck = [];
  playerDeck = [];

  for (let i = 0; i < suits.length; i++) {
    for (let j = 0; j < ranks.length; j++) {
      deck.push( new Card(suits[i], ranks[j]) );
    }
  }
  deck.sort(function(){ return Math.random()-0.5; });

  // second card remains hidden
  // deck = [new Card('s', 8), new Card('s', 10), new Card('s', 'J'), new Card('s', 'A')];
  // second card opens
  // deck = [new Card('s', 10), new Card('s', 8), new Card('s', 'J'), new Card('s', 'A')];

  $('.dealerCards').empty();
  $('.playerCards').empty();
  $('#dealerScores').empty();
  $('#playerScores').empty();
  $('#gameResult').removeClass('win lose draw').empty();
  $('#playerButtons').hide();

  pickCard(dealerDeck, '.dealerCards');
  pickCard(dealerDeck, '.dealerCards', true);
  pickCard(playerDeck, '.playerCards');
  pickCard(playerDeck, '.playerCards');

  if (score(playerDeck) == 21
    && [10, 'J', 'Q', 'K', 'A'].includes(dealerDeck[0].rank) ) {
    faceOn();
    if ( score(playerDeck) == score(dealerDeck) ) {
      draw();
      addResultScores(dealerDeck, '#dealerScores');
      addResultScores(playerDeck, '#playerScores');
    } else {
      youWin();
      addResultScores(dealerDeck, '#dealerScores');
      addResultScores(playerDeck, '#playerScores');
    }
  } else if (score(playerDeck) == 21) {
    youWin();
    addResultScores(playerDeck, '#playerScores');
  } else {
    $('#playerButtons').show();
  }
}

$('#newGame').click(newGame);
$('#addCard').click(pickNewCard);
$('#endGame').click(showResult);
$(document).keyup(function(event){
  if (event.keyCode==78)
    newGame();
});
