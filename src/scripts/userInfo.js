let currentUserId = null;

export function getUserInfo() {
  return {
    name: document.querySelector('.profile__title').textContent,
    description: document.querySelector('.profile__description').textContent
  };
}

export function setUserInfo({ name, about, avatar, _id }) {
  document.querySelector('.profile__title').textContent = name;
  document.querySelector('.profile__description').textContent = about;
  
  if (avatar) {
    document.querySelector('.profile__image').style.backgroundImage = `url('${avatar}')`;
  }
  
  if (_id) {
    currentUserId = _id;
  }
}

export function getCurrentUserId() {
  return currentUserId;
}