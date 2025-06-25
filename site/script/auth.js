const BASE_URL = "https://api.ft.ca/";

export async function getTasks() {
  let result = false;
  try {
    const response = await fetch(`${BASE_URL}task`, {});
    if (!response.ok || response.status >= 500) throw new Error("Server error");
    else if (!response.ok || response.status >= 400)
      throw new Error("Client error");
    else if (!response.ok) throw new Error("Arcane error");
    result = await response.json();
    return result;
  } catch (error) {
    return { status: "offline", error };
  }
}

// recevoir le token and le storer in the client
console.log("in auth.js");
let currentUser = null;

async function hashPassword(password) {
  let hashHex = "";
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
  } catch (error) {
    console.log(`error: ${error}`);
  }
  return hashHex;
}

async function apiCall(resource, method, auth, body = {}) {
  let result = false;
  const BASE_URL = "https://api.ft.ca/";
  const apiUrl = `${BASE_URL}${resource}`;

  const headers = {
    "Content-type": "application/json",
    Accept: "application/json",
  };

  const apiReq = {
    method: method,
    headers: headers,
  };

  if (method == "POST") apiReq["body"] = JSON.stringify(body);

  if (auth) {
    if (isIdentified()) {
      headers["Authorization"] = `Bearer ${getConnectedUser().tokenUuid}`;
    } else throw new Error("Empty token while required...");
  }

  const Response = await fetch(apiUrl, apiReq);

  if (Response.ok) {
    result = await Response.json();
  }

  return result;
}

export function getConnectedUser() {
  return JSON.parse(localStorage.getItem("user"));
}

export function isIdentified() {
  return getConnectedUser() !== null;
}

export async function subscribe(user) {
  let result = false;
  
  console.log('in auth.js subscribe', user)

  const subscribeResponse = await apiCall("user/subscribe", "POST", false, user);

  if (subscribeResponse.errorCode == 0) {
    result = true;
    alert("subscribe success");
  } else {
    alert("subscribe fail");
    console.error("unhandle error in auth.js subscribeJson");
  }

  return result;
}

export async function login(user) {
  console.log("in auth.js login");

  let result = false;

  const loginResult = await apiCall("user/login", "POST", false, user);

  if (loginResult.errorCode == 0) {
    result = true;
    localStorage.setItem("user", JSON.stringify(loginResult.token));
    document.dispatchEvent(new CustomEvent("auth-loggedin", {}));
  }

  return result;
}

export async function logout() {
  console.log("in auth.js logout");
  let result = false;

  const logoutJson = await apiCall("user/logout", "POST", true);

  if (logoutJson.errorCode == 0) {
    result = logoutJson.revoked;
    localStorage.clear();

    // todo understand this better
    // const event = new CustomEvent("auth-logedout", {});
    // this.dispatchEvent(event);

    // document.querySelector(".articles").style.visibility = "hidden";
    // document.querySelector(".account").style.visibility = "hidden";
  }

  return result;
}