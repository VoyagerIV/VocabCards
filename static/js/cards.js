// define and translate buttons
const defineBtn = document.getElementById("define");
defineBtn.addEventListener("click", defineRequest);

const translateBtn = document.getElementById("translate");
translateBtn.addEventListener("click", translateRequest);

const e = document.getElementById("language");

// back button leads to homepage
const backBtn = document.getElementById("back");
backBtn.addEventListener("click", function () {
  window.location.replace("/");
});

// display current deck's name
let selectedDeck = sessionStorage.getItem("selectedDeck");
const pageName = document.getElementById("page-title");
pageName.innerHTML = selectedDeck;

const sidePanel = document.getElementById("side-panel");

// remove define and translate buttons
// to be used for add card
const defineTranslateContainer = document.getElementById(
  "define-translate-container"
);

const frontContainer = document.getElementById("front-container");
frontContainer.removeChild(defineTranslateContainer);

// remove pronunciation icon
const backContainer = document.getElementById("back-container");
const audioBtn = document.getElementById("audio-btn");
const audio = document.getElementById("audio");

audioBtn.addEventListener("click", function () {
  audio.play();
});

backContainer.removeChild(audioBtn);

// display existing cards //

// make new XLMHttpRequest object
httpRequest = new XMLHttpRequest();

// displayDecks function is called when response is received by the request object
httpRequest.onreadystatechange = displayCards;

requestUrl = "/displayCards?deck=" + selectedDeck;

// make request
httpRequest.open("GET", requestUrl, true);

// send request
httpRequest.send();

function displayCards() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    let newCard;
    // create and render new card
    for (let i = 0; i < r.cards.length; i++) {
      newCard = new Card(r.cards[i].front, r.cards[i].back);
      newCard.renderCard();
    }
  }
}

// card controls //
const controlsContainer = document.getElementById("card-controls");

const addCardBtn = document.getElementById("card-add");
const deleteCardBtn = document.getElementById("card-delete");
const editCardBtn = document.getElementById("card-edit");
const addMultipleCardsBtn = document.getElementById("card-add-multiple");

// add and edit card buttons //
const addCardConfirmBtn = document.createElement("div");
addCardConfirmBtn.classList.add("rectangle-btn");
addCardConfirmBtn.innerHTML = "Add Card";

const cancelBtn = document.createElement("div");
cancelBtn.classList.add("rectangle-btn");
cancelBtn.innerHTML = "Cancel";

// main card fields //
const cardFrontField = document.getElementById("card-front");
const cardBackField = document.getElementById("card-back");

// Card object constructor
function Card(front, back) {
  // create deck DOM element
  this.domCard = document.createElement("div");
  this.domCard.addEventListener("click", function () {
    toMainPanel(front, back);
  });

  cardFrontField.innerHTML = front;
  cardBackField.innerHTML = back;

  this.renderCard = function () {
    this.domCard.classList.add("card-side-panel");
    this.domCard.innerHTML = front;

    sidePanel.prepend(this.domCard);
  };
}

// when a card in the side panel is clicked on, show card in main panel
function toMainPanel(front, back) {
  cardFrontField.innerHTML = front;
  cardBackField.innerHTML = back;
}

// add card to deck //
addCardBtn.addEventListener("click", addCardActive);

// remove controlContainer children
function removeControls() {
  while (controlsContainer.firstChild) {
    controlsContainer.removeChild(controlsContainer.firstChild);
  }
}

// add standard controls
function addControls() {
  controlsContainer.appendChild(deleteCardBtn);
  controlsContainer.appendChild(addMultipleCardsBtn);
  controlsContainer.appendChild(addCardBtn);
  controlsContainer.appendChild(editCardBtn);
}

addCardConfirmBtn.addEventListener("click", addCardRequest);

function addCardActive() {
  // add define and translate buttons
  frontContainer.prepend(defineTranslateContainer);

  // remove controls
  removeControls();

  // add card and cancel buttons
  controlsContainer.appendChild(cancelBtn);
  controlsContainer.appendChild(addCardConfirmBtn);

  // empty fields and set them to editable
  cardFrontField.innerHTML = "";
  cardFrontField.setAttribute("contenteditable", "true");
  cardBackField.innerHTML = "";
  cardBackField.setAttribute("contenteditable", "true");
}

// cards fields given and addition confirmed
let newCard;
let front;
let back;
function addCardRequest() {
  front = cardFrontField.innerHTML;
  back = cardBackField.innerHTML;

  // make new XLMHttpRequest object
  httpRequest = new XMLHttpRequest();

  // createCard function is called when response is received by the request object
  httpRequest.onreadystatechange = createCard;

  requestUrl = "/createCard?front=" + front + "&back=" + back;

  // make request
  httpRequest.open("GET", requestUrl, true);

  // send request
  httpRequest.send();
}

// newCard = new Card(cardFrontField.innerHTML, cardBackField.innerHTML);
// newCard.renderCard();
function createCard() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    // create and render new card
    let newCard = new Card(r.front, r.back);
    newCard.renderCard();

    // exit add card mode
    removeControls();
    cardFrontField.setAttribute("contenteditable", "false");
    cardBackField.setAttribute("contenteditable", "false");
    addControls();

    // remove define and translate buttons
    frontContainer.removeChild(defineTranslateContainer);
  }
}

// automatic define //

function defineRequest() {
  // make new XLMHttpRequest object
  httpRequest = new XMLHttpRequest();

  // displayDecks function is called when response is received by the request object
  httpRequest.onreadystatechange = displayDefinition;

  requestUrl = "/autoDefine?phrase=" + cardFrontField.innerHTML;

  // make request
  httpRequest.open("GET", requestUrl, true);

  // send request
  httpRequest.send();
}

function displayDefinition() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    // add definition to back field
    cardBackField.innerHTML += r.definition + "<br>";

    // get pronunciation
    pronounceRequest();
  }
}

// get pronunciation //
function pronounceRequest() {
  // make new XLMHttpRequest object
  httpRequest = new XMLHttpRequest();

  // displayDecks function is called when response is received by the request object
  httpRequest.onreadystatechange = displayPronunciation;

  requestUrl = "/autoPronounce?phrase=" + cardFrontField.innerHTML;

  // make request
  httpRequest.open("GET", requestUrl, true);

  // send request
  httpRequest.send();
}

function displayPronunciation() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    audio.setAttribute("src", r.pronunciation);

    cardBackField.prepend(audioBtn);
    // r.pronunciation
  }
}

// automatic translate //

function translateRequest() {
  let language = e.options[e.selectedIndex].value;

  // make new XLMHttpRequest object
  httpRequest = new XMLHttpRequest();

  // displayDecks function is called when response is received by the request object
  httpRequest.onreadystatechange = displayTranslation;

  requestUrl =
    "/autoTranslate?phrase=" + cardFrontField.innerHTML + "&lang=" + language;

  // make request
  httpRequest.open("GET", requestUrl, true);

  // send request
  httpRequest.send();
}

function displayTranslation() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    // add translation to back field
    cardBackField.innerHTML += r.translation + "<br>";
  }
}
