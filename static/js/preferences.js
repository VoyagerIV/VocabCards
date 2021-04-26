// back to main page
const backBtn = document.getElementById("back");
backBtn.addEventListener("click", toHome);

const cancelBtn = document.getElementById("cancel");
cancelBtn.addEventListener("click", toHome);

// get input fields
const e = document.getElementById("language");
const definition = document.getElementById("def");
const type = document.getElementById("type");
const synonym = document.getElementById("synonym");
const example = document.getElementById("example");
const phonetics = document.getElementById("phonetics");
const pronunciation = document.getElementById("pronun");

const saveBtn = document.getElementById("save-changes");

saveBtn.addEventListener("click", savePreferences);

function savePreferences() {
  let language = e.options[e.selectedIndex].value;

  // make new XLMHttpRequest request
  httpRequest = new XMLHttpRequest();

  httpRequest.onreadystatechange = toHome;

  requestUrl =
    "/updatePreferences?lang=" +
    language +
    "&define=" +
    definition.checked +
    "&synonym=" +
    synonym.checked +
    "&type=" +
    type.checked +
    "&example=" +
    example.checked +
    "&phonetics=" +
    phonetics.checked +
    "&pronunciation=" +
    pronunciation.checked;

  httpRequest.open("GET", requestUrl, true);

  httpRequest.send();
}

function toHome() {
  window.location.replace("/");
}
