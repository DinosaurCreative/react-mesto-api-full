import { BASE_URL } from './constants';

export class Api {
  constructor({address, headers}) {
    this._address = address;
    this._headers = headers;
  }
  
  _checkServerResponse(item) {
    if(item.ok){
      return item.json();
    }else {
      return Promise.reject(item.status)
    }
  }
  
    getProfileData() {
      return fetch(`${this._address}users/me`, {
        method: 'GET',
        headers: this._headers,
        credentials: 'include',
      })
      .then(res => this._checkServerResponse(res))
    }

  getImages(){
    return fetch(`${this._address}cards`,{
      method: 'GET',
      headers: this._headers,
      credentials: 'include',
    })
    .then(res => this._checkServerResponse(res))
  }


  setNewProfileData(data) {
   return fetch(`${this._address}users/me`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: data.name,
        about: data.about
      })
    })
    .then(res => this._checkServerResponse(res))
  }

  postImage(data) {
    return fetch(`${this._address}cards`, {
      method: 'POST',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        name: data.name,
        link: data.link,
      })
    })
    .then(res => this._checkServerResponse(res))
  }

  deleteImage(id) {
   return fetch(`${this._address}cards/${id}`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include',
    })
    .then(res => this._checkServerResponse(res))
    .catch(err => console.log(`Ошибка: ${err}`))
  }

  changeAvatar(link) {
    return fetch(`${this._address}users/me/avatar`, {
      method: 'PATCH',
      headers: this._headers,
      credentials: 'include',
      body: JSON.stringify({
        avatar: link
      })
    })
    .then(res => this._checkServerResponse(res))
  }
  
  increaseLike(id) {
    return fetch(`${this._address}cards/${id}/likes`, {
      method: 'PUT',
      headers: this._headers,
      credentials: 'include',
    })
    .then(res => this._checkServerResponse(res))
  }


  reduceLike(id) {
    return fetch(`${this._address}cards/${id}/likes`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include',
    })
    .then(res => this._checkServerResponse(res))
  }

  changeLikeCardStatus(id, isLiked) {
    if(isLiked) {
      return this.reduceLike(id)
    }else{
      return this.increaseLike(id)
    }
  }
  signOut() {
    return fetch(`${this._address}signout`, {
      method: 'DELETE',
      headers: this._headers,
      credentials: 'include',
    })
    .then(res => this._checkServerResponse(res))
  }
}

const api = new Api({
  address: BASE_URL,
  headers:{
    'Content-Type': 'application/json'
  }
});

export default api;