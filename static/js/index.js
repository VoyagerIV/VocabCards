// get username
let username = sessionStorage.getItem("username");

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

requestUrl = "/displayDecks?username=" + username;

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

  requestUrl =
    "/createDeck?name=" +
    deckName +
    "&type=" +
    deckType +
    "&username=" +
    username;

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

const generateDeckBtn = document.getElementById("generate-deck-btn");
generateDeckBtn.addEventListener("click", generateDeckRequest);

// generat vocabulary deck //
function generateDeckRequest() {
  // get inputted deck name
  deckName = document.getElementById("generate-deck-name").value;
  let definition = document.getElementById("auto-definition");
  let translation = document.getElementById("auto-translation");

  let fields;
  if (definition.checked && translation.checked) {
    fields = "both";
  } else if (definition.checked) {
    fields = "definition";
  } else {
    fields = "translation";
  }

  // make new XLMHttpRequest object
  httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function () {
    location.reload();
  };

  requestUrl =
    "/generateDeck?name=" +
    deckName +
    "&fields=" +
    fields +
    "&username=" +
    username;

  httpRequest.open("GET", requestUrl, true);

  httpRequest.send();
}

// click on deck to get deck operations //

// modal window fields
const modalDeckName = document.getElementById("modal-deck-name");
const modalDeckType = document.getElementById("revision-style");
const numberOfCards = document.getElementById("number-of-cards");

// modal window buttons
const editCardsBtn = document.getElementById("modal-edit-cards");
const reviseBtn = document.getElementById("modal-revise");
const editDeckBtn = document.getElementById("edit-deck-btn");
const deleteDeckBtn = document.getElementById("modal-delete-deck");

function showDeckModal(name, type, totalCards) {
  modalDeckName.innerText = name;
  modalDeckType.innerText = type;
  numberOfCards.innerText = totalCards;
}

// modal delete deck //
deleteDeckBtn.addEventListener("click", deleteDeckRequest);

function deleteDeckRequest() {
  let deck = sessionStorage.getItem("selectedDeck");

  // new XLMHttpRequest
  httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = deleteDeck;

  requestUrl = "/deleteDeck?deck=" + deck + "&username=" + username;

  httpRequest.open("GET", requestUrl, true);

  httpRequest.send();
}

function deleteDeck() {
  if (httpRequest.readyState != 4 && httpRequest.status != 200) {
    return;
  }
  let deck = sessionStorage.getItem("selectedDeck");
  let decks = document.querySelectorAll(".deck");
  for (let i = 0; i < decks.length; i++) {
    if (decks[i].textContent == deck) {
      decksContainer.removeChild(decks[i]);
      break;
    }
  }
}

// modal edit deck //
editDeckBtn.addEventListener("click", editDeckRequest);

function editDeckRequest() {
  let deck = sessionStorage.getItem("selectedDeck");

  // get new name and type of deck
  let newName = document.getElementById("edit-deck-name").value;

  let spaced = document.getElementById("edit-spaced");

  if (spaced.checked) {
    newType = "spaced";
  } else {
    newType = "standard";
  }

  // new XLMHttpRequest
  httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = function () {
    editDeck(deck, newName);
  };

  requestUrl =
    "/editDeck?deck=" +
    deck +
    "&new_name=" +
    newName +
    "&new_type=" +
    newType +
    "&username=" +
    username;

  httpRequest.open("GET", requestUrl, true);

  httpRequest.send();
}

function editDeck(deck, newName) {
  if (httpRequest.readyState != 4 && httpRequest.status != 200) {
    return;
  }

  window.location.replace("/");
}

// modal edit cards page navigation //
editCardsBtn.addEventListener("click", function () {
  window.location.replace("/cardsPage");
});

// modal revise page navigation //
reviseBtn.addEventListener("click", function () {
  window.location.replace("/revisionPage");
});
