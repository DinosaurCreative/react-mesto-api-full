export class Api {
  constructor({address}) {
    this._address = address;
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
          'Content-Type': 'application/json'
        },
        credentials: 'include',
      })
      .then(res => this._checkServerResponse(res))
    }

  getImages(){
    return fetch(`${this._address}cards`,{
      method: 'GET',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
    .then(res => this._checkServerResponse(res))
  }


  setNewProfileData(data) {
   return fetch(`${this._address}users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
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
      headers: {
        'Content-Type': 'application/json'
      },
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
      headers:{
        'Content-Type': 'application/json'
      },
      credentials: 'include',
    })
    .then(res => this._checkServerResponse(res))
    .catch(err => console.log(`Ошибка: ${err}`))
  }

  changeAvatar(link) {
    return fetch(`${this._address}users/me/avatar`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json'
      },
      credentials: 'include',
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
        'Content-Type': 'applictaion/json'
      },
      credentials: 'include',
    })
    .then(res => this._checkServerResponse(res))
  }


  reduceLike(id) {
    return fetch(`${this._address}cards/likes/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'applictaion/json'
      },
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
}

const api = new Api({ address: 'http://api.lookaround.nomoredomains.club/' });

export default api;
