import React from 'react';

const defaultInfo = {
  name: '',
  about: '',
  _id: '',
  avatar: ''
}

export const CurrentUserContext = React.createContext(defaultInfo);