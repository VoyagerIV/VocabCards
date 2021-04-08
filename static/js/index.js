// profile goes to the preferences page
const profileBtn = document.getElementById("profile");
profileBtn.addEventListener("click", function () {
  window.location.replace("/preferences");
});

// display existing decks //

// make new XLMHttpRequest object
httpRequest = new XMLHttpRequest();

// displayDecks function is called when response is received by the request object
httpRequest.onreadystatechange = displayDecks;

requestUrl = "/displayDecks";

// make request
httpRequest.open("GET", requestUrl, true);

// send request
httpRequest.send();

function displayDecks() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    let newDeck;
    // create and render new deck
    for (let i = 0; i < r.decks.length; i++) {
      newDeck = new Deck(
        r.decks[i].name,
        r.decks[i].type,
        r.decks[i].total_cards
      );
      newDeck.renderDeck();
    }
  }
}

// deck controls
const deckAddBtn = document.getElementById("deck-add");
const deckDeleteBtn = document.getElementById("deck-delete");
const deckGenerateBtn = document.getElementById("deck-generate");
// deck container
const decksContainer = document.getElementById("decks-container");

// Deck object constructor //
function Deck(name, type, totalCards) {
  // create deck DOM element
  this.domDeck = document.createElement("div");
  // open modal for deck on click
  this.domDeck.setAttribute("data-toggle", "modal");
  this.domDeck.setAttribute("data-target", "#click-deck-modal");

  this.domDeck.addEventListener("click", function () {
    // set current deck for edit cards page
    sessionStorage.setItem("selectedDeck", name);
    showDeckModal(name, type, totalCards);
  });

  this.renderDeck = function () {
    this.domDeck.classList.add("deck");
    this.domDeck.textContent = name;

    decksContainer.insertBefore(
      this.domDeck,
      document.getElementById("end-of-cards")
    );
  };
}

// create deck //
const createDeckForm = document.getElementById("create-deck-form");
const createDeckFbtn = document.getElementById("create-deck-fbtn");

createDeckFbtn.addEventListener("click", createDeckRequest);

let deckName;
let deckType = "standard";

function createDeckRequest() {
  // get inputted deck name and type
  deckName = document.getElementById("deck-name").value;
  let spaced = document.getElementById("spaced");

  if (spaced.checked) {
    deckType = "spaced";
  }

  // make new XLMHttpRequest object
  httpRequest = new XMLHttpRequest();

  // createDeck function is called when response is received by the request object
  httpRequest.onreadystatechange = createDeck;

  requestUrl = "/createDeck?name=" + deckName + "&type=" + deckType;

  // make request
  httpRequest.open("GET", requestUrl, true);

  // send request
  httpRequest.send();
}

function createDeck() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    // create and render new deck
    let newDeck = new Deck(r.name, r.type, r.total_cards);
    newDeck.renderDeck();
  }
}

// click on deck to get deck operations //

// modal window fields
const modalDeckName = document.getElementById("modal-deck-name");
const modalDeckType = document.getElementById("revision-style");
const numberOfCards = document.getElementById("number-of-cards");

// modal window buttons
const editCardsBtn = document.getElementById("modal-edit-cards");
const reviseBtn = document.getElementById("modal-revise");
const editDeckBtn = document.getElementById("modal-edit-deck");

function showDeckModal(name, type, totalCards) {
  modalDeckName.innerText = name;
  modalDeckType.innerText = type;
  numberOfCards.innerText = totalCards;
}

// modal edit cards page navigation //
editCardsBtn.addEventListener("click", function () {
  window.location.replace("/cardsPage");
});

// modal revise page navigation //
reviseBtn.addEventListener("click", function () {
  window.location.replace("/revisionPage");
});
