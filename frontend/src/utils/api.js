export class Api {
  constructor({address, token}) {
    this._address = address;
    this._token = token;
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
        headers: {
          authorization: this._token,
          'Content-Type': 'application/json'
        }
      })
      .then(res => this._checkServerResponse(res))
    }

  getImages(){
    return fetch(`${this._address}cards`,{
      method: 'GET',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => this._checkServerResponse(res))
  }


  setNewProfileData(data) {
   return fetch(`${this._address}users/me`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
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
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
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
      headers:{
        authorization: this._token,
        'Content-Type': 'application/json'
      }
    })
    .then(res => this._checkServerResponse(res))
    .catch(err => console.log(`Ошибка: ${err}`))
  }

  changeAvatar(link) {
    return fetch(`${this._address}users/me/avatar`, {
      method: 'PATCH',
      headers: {
        authorization: this._token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        avatar: link
      })
    })
    .then(res => this._checkServerResponse(res))
  }
  
  increaseLike(id) {
    return fetch(`${this._address}cards/likes/${id}`, {
      method: 'PUT',
      headers: {
        authorization: this._token,
        'Content-Type': 'applictaion/json'
      }
    })
    .then(res => this._checkServerResponse(res))
  }


  reduceLike(id) {
    return fetch(`${this._address}cards/likes/${id}`, {
      method: 'DELETE',
      headers: {
        authorization: this._token,
        'Content-Type': 'applictaion/json'
      }
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
}

const api = new Api({ address: 'https://nomoreparties.co/v1/cohort-24/', token: '1b42587b-1212-49d2-8dac-fba90d326288' });

export default api;
