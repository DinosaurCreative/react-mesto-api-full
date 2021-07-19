import { BASE_URL } from './constants';

export function checkServerResponse(item){
  return item.ok ? item.json() : Promise.reject(item.status)
};

export function signUp({password, email}) {
  return fetch(`${BASE_URL}/signup`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
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
    body: JSON.stringify({
      password,
      email
    })
  })
  .then(res => checkServerResponse(res))
};

export function checkToken(token) {
  return fetch(`${BASE_URL}/users/me`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      "Authorization" : `Bearer ${token}`
    }
  })
  .then(res => checkServerResponse(res))
};