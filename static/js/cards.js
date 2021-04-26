const defineCheck = document.getElementById("define-check");
const translateCheck = document.getElementById("translate-check");
const addMultipleInput = document.getElementById("add-multiple-input");

// get username
let username = sessionStorage.getItem("username");

// define and translate buttons
const defineBtn = document.getElementById("define");
defineBtn.addEventListener("click", defineRequest);

const translateBtn = document.getElementById("translate");
translateBtn.addEventListener("click", translateRequest);

const e = document.getElementById("language");
const e2 = document.getElementById("language2");

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
let audioBtn = document.getElementById("audio-btn");

audioBtn.addEventListener("click", playAudio);

function playAudio() {
  let audio = cardBackField.firstChild.childNodes[3];
  audio.play();
}

backContainer.removeChild(audioBtn);

// remove the add multiple cards elements
const mainPanel = document.getElementById("card-main-panel");
const addMultipleContainer = document.getElementById("add-multiple-container");

mainPanel.removeChild(addMultipleContainer);

// display existing cards //

// make new XLMHttpRequest object
httpRequest = new XMLHttpRequest();

// displayDecks function is called when response is received by the request object
httpRequest.onreadystatechange = displayCards;

requestUrl = "/displayCards?deck=" + selectedDeck + "&username=" + username;

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

// add, edit and add multiple card buttons //
const addCardConfirmBtn = document.createElement("div");
addCardConfirmBtn.classList.add("rectangle-btn");
addCardConfirmBtn.classList.add("confirm-btn");
addCardConfirmBtn.innerHTML = "Add Card";

const addCardsConfirmBtn = document.createElement("div");
addCardsConfirmBtn.classList.add("rectangle-btn");
addCardsConfirmBtn.classList.add("confirm-btn");
addCardsConfirmBtn.innerHTML = "Add Cards";

const editCardConfirmBtn = document.createElement("div");
editCardConfirmBtn.classList.add("rectangle-btn");
editCardConfirmBtn.classList.add("confirm-btn");
editCardConfirmBtn.innerHTML = "Edit Card";

const cancelBtn = document.createElement("div");
cancelBtn.classList.add("rectangle-btn");
cancelBtn.classList.add("cancel-btn");
cancelBtn.innerHTML = "Cancel";

const cancelMultipleBtn = document.createElement("div");
cancelMultipleBtn.classList.add("rectangle-btn");
cancelMultipleBtn.classList.add("cancel-btn");
cancelMultipleBtn.innerHTML = "Cancel";

// cancel button functionality
cancelBtn.addEventListener("click", exitMode);

function exitMode() {
  removeControls();
  cardFrontField.setAttribute("contenteditable", "false");
  cardBackField.setAttribute("contenteditable", "false");
  // display the last selected card
  selectedCard.click();
  addControls();

  // remove define and translate buttons
  frontContainer.removeChild(defineTranslateContainer);
}

// cancel multiple button
cancelMultipleBtn.addEventListener("click", exitMultiple);

function exitMultiple() {
  removeControls();
  mainPanel.removeChild(addMultipleContainer);
  mainPanel.append(frontContainer);
  mainPanel.append(backContainer);

  addControls();
}

// main card fields //
const cardFrontField = document.getElementById("card-front");
const cardBackField = document.getElementById("card-back");

let selectedCard = "";

// Card object constructor
function Card(front, back) {
  // create deck DOM element
  this.domCard = document.createElement("div");
  this.domCard.addEventListener("click", function (e) {
    toMainPanel(e.target, front, back);
  });

  toMainPanel(this.domCard, front, back);

  this.renderCard = function () {
    this.domCard.classList.add("card-side-panel");
    this.domCard.innerHTML = front;

    sidePanel.prepend(this.domCard);
  };
}

// when a card in the side panel is clicked on, show card in main panel
function toMainPanel(card, front, back) {
  cardFrontField.innerHTML = front;
  cardBackField.innerHTML = back;

  // if card has pronunciation
  if (String(back).includes("</audio>")) {
    audioBtn = document.getElementById("audio-btn");
    audioBtn.addEventListener("click", playAudio);
  }

  // change background colour of selected card
  if (selectedCard != "") {
    selectedCard.classList.remove("selected-card");
  }
  selectedCard = card;
  selectedCard.classList.add("selected-card");
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
  // get current deck
  let deck = sessionStorage.getItem("selectedDeck");

  front = cardFrontField.innerHTML;
  back = cardBackField.innerHTML;

  // make new XLMHttpRequest object
  httpRequest = new XMLHttpRequest();

  // createCard function is called when response is received by the request object
  httpRequest.onreadystatechange = createCard;

  requestUrl =
    "/createCard?front=" +
    front +
    "&back=" +
    back +
    "&deck=" +
    deck +
    "&username=" +
    username;

  // make request
  httpRequest.open("GET", requestUrl, true);

  // send request
  httpRequest.send();
}

function createCard() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    // create and render new card
    let newCard = new Card(r.front, r.back);
    newCard.renderCard();

    // exit add card mode
    cancelBtn.click();
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
    cardBackField.prepend(audioBtn);

    cardBackField.firstChild.childNodes[3].setAttribute("src", r.pronunciation);
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

// delete card //
deleteCardBtn.addEventListener("click", deleteCardRequest);
let toDeleteField = "";

function deleteCardRequest() {
  let selectedDeck = sessionStorage.getItem("selectedDeck");
  toDeleteField = selectedCard.textContent;
  // make new XLMHttpRequest request
  httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = deleteCard;

  requestUrl =
    "/deleteCard?front=" + selectedCard.textContent + "&deck=" + selectedDeck;

  httpRequest.open("GET", requestUrl, true);

  httpRequest.send();
}

function deleteCard() {
  if (httpRequest.readyState != 4 && httpRequest.status != 200) {
    return;
  }

  let cards = document.querySelectorAll(".card-side-panel");
  for (let i = 0; i < cards.length; i++) {
    if (cards[i].textContent === toDeleteField) {
      toDelete = cards[i];

      // if the only card was deleted
      if (cards.length == 1) {
        selectedCard = "";
        cardFrontField.innerHTML = "";
        cardBackField.innerHTML = "";
        // if last card was deleted
        // and there are more cards above it
      } else if (i == cards.length - 1) {
        cards[i - 1].click();
      } else {
        cards[i + 1].click();
      }

      sidePanel.removeChild(cards[i]);
      break;
    }
  }
}

// edit card //

editCardBtn.addEventListener("click", editCardActive);

function editCardActive() {
  // add define and translate buttons
  frontContainer.prepend(defineTranslateContainer);

  // remove controls
  removeControls();

  // edit card and cancel buttons
  controlsContainer.appendChild(cancelBtn);
  controlsContainer.appendChild(editCardConfirmBtn);

  // set fields to editable
  cardFrontField.setAttribute("contenteditable", "true");
  cardBackField.setAttribute("contenteditable", "true");
}

editCardConfirmBtn.addEventListener("click", editCardRequest);

function editCardRequest() {
  let deck = sessionStorage.getItem("selectedDeck");
  let front = cardFrontField.innerHTML;
  let back = cardBackField.innerHTML;

  // make new XLMHttpRequest request
  httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = editCard;

  requestUrl =
    "/editCard?card=" +
    selectedCard.textContent +
    "&deck=" +
    deck +
    "&new_front=" +
    front +
    "&new_back=" +
    back;

  httpRequest.open("GET", requestUrl, true);

  httpRequest.send();
}

function editCard() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    // exit edit card mode
    removeControls();
    cardFrontField.setAttribute("contenteditable", "false");
    cardBackField.setAttribute("contenteditable", "false");
    frontContainer.removeChild(defineTranslateContainer);
    addControls();
  }
}

// multiple cards feature
addMultipleCardsBtn.addEventListener("click", addMultipleActive);

function addMultipleActive() {
  // change main card view
  mainPanel.removeChild(frontContainer);
  mainPanel.removeChild(backContainer);

  mainPanel.appendChild(addMultipleContainer);

  // remove card controls
  removeControls();

  // add cancel and confirmation buttons
  controlsContainer.appendChild(cancelMultipleBtn);
  controlsContainer.appendChild(addCardsConfirmBtn);
}

// add multiple cards request
addCardsConfirmBtn.addEventListener("click", addMultipleCardsRequest);

function addMultipleCardsRequest() {
  console.log("here!");
  let deck = sessionStorage.getItem("selectedDeck");
  // get language and input
  let language = e2.options[e2.selectedIndex].value;
  let input = addMultipleInput.value;

  let translate = "n";
  let define = "n";

  // see which auto fields have been checked
  if (defineCheck.checked) {
    define = "y";
  }
  if (translateCheck.checked) {
    translate = "y";
  }

  // send add multiple cards request
  httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = addMultipleCards;

  requestUrl =
    "/addMultiple?input=" +
    input +
    "&lang=" +
    language +
    "&define=" +
    define +
    "&translate=" +
    translate +
    "&username=" +
    username +
    "&deck=" +
    deck;

  httpRequest.open("GET", requestUrl, true);

  httpRequest.send();

  // exit add multiple mode
  cancelMultipleBtn.click();
  console.log("there");
}

function addMultipleCards() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    JSON.parse(httpRequest.responseText);

    // reload page
    location.reload();
  }
}
