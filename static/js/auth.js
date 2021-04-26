const authError = document.getElementById("auth-error");

const signinBtn = document.getElementById("signin-btn");
const authContainer = document.getElementById("auth-container");

// input fields
const username = document.getElementById("username");
const password = document.getElementById("password");

// switch to registration page if user is not registered

const pageTitle = document.getElementById("page-title");

const RegisterBtn = document.createElement("div");
RegisterBtn.setAttribute("id", "register-btn");
RegisterBtn.classList.add("rectangle-btn");
RegisterBtn.textContent = "Register";

const registerLine = document.createElement("div");
registerLine.classList.add("alt-link");
registerLine.innerHTML =
  "Already have an account?<span id='signin-link'> Sign In</span>";

registerLine.addEventListener("click", toSignin);

const signinLine = document.getElementById("signin-line");
signinLine.addEventListener("click", toRegister);

function toRegister() {
  authError.innerHTML = "";
  // set placeholders
  username.setAttribute("placeholder", "choose username");
  password.setAttribute("placeholder", "choose password");
  username.value = "";
  password.value = "";

  // set page titles
  document.title = "Register";
  pageTitle.innerHTML = "<header>Register</header>";

  authContainer.removeChild(signinLine);
  authContainer.removeChild(signinBtn);

  authContainer.appendChild(RegisterBtn);
  authContainer.appendChild(registerLine);
}

// switch back to sign in page from registration
registerLine.addEventListener("click", toSignin);

function toSignin() {
  authError.innerHTML = "";
  // set placeholders
  username.setAttribute("placeholder", "enter username");
  password.setAttribute("placeholder", "enter password");
  username.value = "";
  password.value = "";

  // set page titles
  document.title = "Sign In";
  pageTitle.innerHTML = "<header>Sign In</header>";

  authContainer.removeChild(registerLine);
  authContainer.removeChild(RegisterBtn);

  authContainer.appendChild(signinBtn);
  authContainer.appendChild(signinLine);
}

// sign in //

signinBtn.addEventListener("click", signin);

function signin() {
  // check correct user credentials
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = checkCredentials;
  requestUrl =
    "/signin?username=" + username.value + "&password=" + password.value;
  httpRequest.open("GET", requestUrl, true);
  httpRequest.send();
}

function checkCredentials() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    // if credentials are correct, navigate to home
    if (r.status == "FOUND") {
      sessionStorage.setItem("username", username.value);
      window.location.replace("/");
    } else {
      // otherwise, ask user to retry
      authError.innerHTML =
        "Incorrect username or password.<br>Please try again.";
    }
  }
}

// register //
RegisterBtn.addEventListener("click", register);

function register() {
  // check username is unique
  httpRequest = new XMLHttpRequest();
  httpRequest.onreadystatechange = checkUsername;
  requestUrl =
    "/register?username=" + username.value + "&password=" + password.value;
  httpRequest.open("GET", requestUrl, true);
  httpRequest.send();
}

function checkUsername() {
  if (httpRequest.readyState === 4 && httpRequest.status === 200) {
    let r = JSON.parse(httpRequest.responseText);

    // if username is unique and successfully added, navigate to home
    if (r.status == "OK") {
      sessionStorage.setItem("username", username.value);
      window.location.replace("/");
    } else {
      // otherwise, ask user to choose a different username
      authError.innerHTML = "Username is taken.<br>Please try again.";
    }
  }
}
