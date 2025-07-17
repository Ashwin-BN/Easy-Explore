import { jwtDecode } from "jwt-decode";

export function setToken(token) {
  localStorage.setItem("access_token", token);
}


export function getCurrentUser() {
    const token = getToken();
    if (!token) return null;

    try {
        const userStr = sessionStorage.getItem("user");
    if (!userStr) return null;

    return JSON.parse(userStr);
  } catch (err) {
    console.error("Failed to parse user from sessionStorage:", err.message);
    return null;
    }
}

export function getToken() {
  if (typeof window !== "undefined") {
    try {
      return localStorage.getItem("access_token");
    } catch (error) {
      console.error("Error getting token:", error);
    }
  }
  return null;
}

export function removeToken() {
  localStorage.removeItem("access_token");
}

export function readToken() {
  try {
    let token = getToken();
    //console.log("Raw token:", token);
    return token ? jwtDecode(token) : null;
  } catch (error) {
    console.error("Error reading token:", error);
    return null;
  }
}

export function isAuthenticated() {
  const token = readToken();
  return token ? true : false;
}

// authentication.js
export async function authenticateUser(email, password) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/login`, {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: { "Content-Type": "application/json" },
  });

  if (!res.ok) {
    const error = await res.json();
    throw new Error(error.message || "Login failed");
  }

  const data = await res.json();

  if (typeof window !== "undefined") {
    sessionStorage.setItem("user", JSON.stringify(data.user));
    setToken(data.token);
  }

  return data;
}

export async function registerUser(userName, email, password, password2) {
  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/user/register`, {
    method: "POST",
    body: JSON.stringify({
      userName: userName,
      email: email,
      password: password,
      password2: password2,
    }),
    headers: {
      "content-type": "application/json",
    },
  });

  const data = await res.json();

  if (res.status === 200) {
    return true;
  } else {
    throw new Error(data.message);
  }
}
