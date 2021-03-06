import { BASE_URL } from './constants';

const checkServerResponse = item => item.ok ? item.json() : Promise.reject(item.status);

export function signUp({password, email}) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      password,
      email
    })
  })
  .then(res => checkServerResponse(res))
};

export function signIn({password, email}) {
  return fetch(`${BASE_URL}/signin`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    credentials: "include",
    body: JSON.stringify({
      password,
      email
    })
  })
  .then(res => checkServerResponse(res))
};

export function checkToken() {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include"
  })
  .then(res => checkServerResponse(res))
};