const cardText = document.getElementById("card-text");
const showAnswerBtn = document.getElementById("show-answer");

// back button leads to homepage
const backBtn = document.getElementById("back");
backBtn.addEventListener("click", function () {
  window.location.replace("/");
});

// get all cards for deck
// make new XLMHttpRequest object
httpRequest = new XMLHttpRequest();

// displayDecks function is called when response is received by the request object
httpRequest.onreadystatechange = revisionCards;

let selectedDeck = sessionStorage.getItem("selectedDeck");

requestUrl = "/revisionCards?deck=" + selectedDeck;

// make request
httpRequest.open("GET", requestUrl, true);

// send request
httpRequest.send();

let cards;

function revisionCards() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);
    // get cards list
    cards = r.cards;
    cardText.textContent = cards[0]["front"];
  }
}

// keep track of current card
let side = 0;
let curr = 0;

showAnswerBtn.addEventListener("click", next);

function next() {
  if (side % 2 === 0) {
    showAnswerBtn.textContent = "Next";
    // show card's back field
    cardText.textContent = cards[curr]["back"];
    // change button
  } else {
    // move to next card
    curr += 1;
    cardText.textContent = cards[curr]["front"];
    showAnswerBtn.textContent = "Show Answer";
  }
  side += 1;
}
