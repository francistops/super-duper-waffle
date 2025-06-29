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

 export async function hashPassword(password) {
  let hashHex = "";
  try {
    const encoder = new TextEncoder();
    const data = encoder.encode(password);
    const hashBuffer = await crypto.subtle.digest("SHA-256", data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    hashHex = hashArray
      .map((byte) => byte.toString(16).padStart(2, "0"))
      .join("");
    console.log("hashHex", hashHex);
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
      console.log("getConnectedUser", getConnectedUser());
      headers["Authorization"] = `Bearer ${getConnectedUser().tokenUuid}`;
    } else throw new Error("Empty token while required...");
  }

  const response = await fetch(apiUrl, apiReq);

  if (response.ok) {
    result = await response.json();
  }

  return result;
}

export function getConnectedUser() {
  console.log("in auth.js getConnectedUser");
  return JSON.parse(localStorage.getItem("user"));
}

export function isIdentified() {
  console.log("in auth.js isIdentified");
  return getConnectedUser() !== null;
}

export async function register(user) {
  let result = false;
  // console.log('in auth.js register', user.email)
  const data = await apiCall("user/register", "POST", false, user);
  //! todo: display code must be must be app.js
  if (data.errorCode == 0) {
    result = true;
    // alert("registration success");
    console.log("registration success", data);
  } else {
    result = false;
    // alert("registration fail");
    console.error("unhandle error in auth.js registerJson", data);
  }

  return result;
}

export async function login(user) {
  console.log("in auth.js login");

  let result = false;

  const data = await apiCall("user/login", "POST", false, user);
  console.log("data from apiCall in auth.js login", data);
  if (data) {
    result = true;
    localStorage.setItem("user", JSON.stringify(data.token));
    document.dispatchEvent(new CustomEvent("auth-loggedin", {
      bubbles: true,
      composed: true,
      detail: `User logged in successfully got token: ${data.token}`,
    }));
  } else {
    console.error("unhandle error in auth.js login", data);
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
  }
  return result;
}

export async function addNextService(service) {
  console.log("in auth.js addNextService", service);
  let result = false;

  const data = await apiCall("task/service/add", "POST", true, service);
  if (data.errorCode == 0) {
    result = true;
    console.log("addNextService success", data);
  } else {
    console.error("unhandle error in auth.js addNextService", data);
  }

  return result;
}