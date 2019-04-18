// /*Create a list that holds all of your cards*/
let count = 0 ;
let stars = document.querySelectorAll(".fa-star");
let overlayAll = document.getElementById("popupID");
const star = stars.firstElementChild;
const cardDeck = document.getElementById("deckID");
let restart = document.getElementsByClassName("restart");
const closeVar = document.getElementById("closeID");

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

var cards = ['fa-diamond','fa-diamond',
            'fa-paper-plane-o','fa-paper-plane-o',
            'fa-anchor','fa-anchor',
            'fa-bolt','fa-bolt',
            'fa-cube','fa-cube',
            'fa-leaf','fa-leaf',
            'fa-bomb','fa-bomb',
            'fa-bicycle','fa-bicycle'];


function cardList(card){
  return `<li class="card"><i class="fa ${card}"></i></li>`;
};

//INSERT ALL CARDS IN DECK//
function fullList(){
  //var deck = document.querySelector('.deck');
  var cardListHTML = shuffle(cards).map(function(card){
    return cardList(card);
  });
  cardDeck.innerHTML = cardListHTML.join('');
};

fullList();

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
  var currentIndex = array.length, temporaryValue, randomIndex;

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex -= 1;
    temporaryValue = array[currentIndex];
    array[currentIndex] = array[randomIndex];
    array[randomIndex] = temporaryValue;
  }
  return array;
}

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

//DEFINE VARIABLES//
let cardsAll = document.getElementsByClassName("card");
let cardsArray = [...cardsAll];
let openCards = [];
let matchedCards = [];

//DISABLE CARDS
function disable(){
  for (var i= 0; i < cardsArray.length; i++){
      cardsArray[i].classList.add('disabled');
  };
};

//ENABLE CARDS
function undoDisable() {
  for (var i= 0; i < cardsArray.length; i++){
    if(!cardsArray[i].classList.contains('match')){
      cardsArray[i].classList.remove('disabled');
    };
  };
};

//UPDATE NUMBER OF STARTS//
function updateStars(count) {
  if(count>19 && count<29){
    stars[2].style.visibility = "collapse";
  } else if(count>=28){
    stars[1].style.visibility = "collapse";
    stars[2].style.visibility = "collapse";
  };
};

function playGame() {
  cardsArray.forEach(function(card) {
    card.addEventListener('click',function(e) {
      if (!card.classList.contains('open') || !card.classList.contains('show')){
        openCards.push(card);
        card.classList.add('open','show');

      if (openCards.length>=2) {
        if(openCards[0].firstElementChild.className!==openCards[1].firstElementChild.className) {
          disable();
          setTimeout(function(){
          cardsArray.forEach(function(cardsArray) {
            if(!card.classList.contains('match')){
              cardsArray.classList.remove('open','show');
            };
          undoDisable();
          });
          },1000);
        } else {
          //add class//
          openCards[0].classList.add('match','disabled');
          openCards[1].classList.add('match','disabled');
          //add to matched cards list//
          matchedCards.push(openCards[0],openCards[1]);
        };
      count = count+1;
      //Popup Screen if full set of matched cards
      finishGame();
      //Update the number of moves on the page//
      document.querySelector('.moves').innerHTML=count;
      //Start Timer//
      if(count == 1){
        second = 0;
        minute = 0;
        hour = 0;
        startTimer();
      }
      //empty out array to grab the next 2 cards//
      openCards=[];
      };
      updateStars(count);
      };
    });
  });
};

playGame();

//TIMER//
var sec = 0, min = 0; hr = 0;
var timer = document.querySelector(".timer");
var interval;
function startTimer(){
    interval = setInterval(function(){
        timer.innerHTML = minute+"mins "+second+"secs";
        second++;
        if(second == 60){
            minute++;
            second=0;
        }
        if(minute == 60){
            hour++;
            minute = 0;
        }
    },1000);
}

//LOOK IN HTML - IT HAS "ONCLICK"//
function resetDeck() {
  matchedCards = [];
  //Stop timer and upate timers to restart//
  clearInterval(interval);
  timer.innerHTML = 0+"mins "+0+"secs";
  //Update the number of moves on the page to 0//
  count = 0;
  document.querySelector('.moves').innerHTML=0;
  //shuffle and reset all classes from cards//
  cardsArray = shuffle(cardsArray);
  //   cardDeck.appe = cardListHTML.join('');
  cardDeck.innerHTML = "";
  for(var i=0; i<cardsArray.length; i++){
    cardDeck.appendChild(cardsArray[i]);
    cardsArray[i].classList.remove("show", "open", "match", "disabled");
  };

  //reset stars//
  for (var i= 0; i < stars.length; i++){
      //stars[i].style.color = "#FFD700";
      stars[i].style.visibility = "visible";
  };
};

function finishGame() {
  // console.log("matched cards",matchedCards.length);
  if (matchedCards.length == 16){
    clearInterval(interval);
    winTime = timer.innerHTML;

    // show congratulations modal
    overlayAll.classList.add("show");

    // declare star rating variable
    var starRating = document.querySelector(".stars").innerHTML;

    //showing move, rating, time on modal
    document.getElementById("finalMove").innerHTML = count;
    document.getElementById("starRating").innerHTML = starRating;
    document.getElementById("totalTime").innerHTML = winTime;

    //close congrats window
    closePopup();
  };
};

function restartGame() {
  overlayAll.classList.remove("show");
  resetDeck();
  playGame();
};

function closePopup() {
  closeVar.addEventListener('click',function(e) {
    overlayAll.classList.remove("show");
  });
};
