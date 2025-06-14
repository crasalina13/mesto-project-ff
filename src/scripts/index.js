import '../pages/index.css';
import { getUserInfo, getInitialCards, updateUserInfo, addNewCard, updateAvatar } from './api.js';
import { createCard, handleLikeClick, handleDeleteClick } from './card.js';
import { openModal, closeModal } from './modal.js';
import { getUserInfo as getLocalUserInfo, setUserInfo, getCurrentUserId } from './userInfo.js';
import { enableValidation, clearValidation } from './validation.js';

const validationConfig = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

enableValidation(validationConfig);

const profileForm = document.querySelector('.popup__form[name="edit-profile"]');
const cardForm = document.querySelector('.popup__form[name="new-place"]');
const avatarForm = document.querySelector('.popup__form[name="edit-avatar"]');

const editProfileModal = document.querySelector('.popup_type_edit');
const addCardModal = document.querySelector('.popup_type_new-card');
const imageModal = document.querySelector('.popup_type_image');
const avatarModal = document.querySelector('.popup_type_avatar');

const profileEditButton = document.querySelector('.profile__edit-button');
const profileAddButton = document.querySelector('.profile__add-button');
const avatarEditButton = document.querySelector('.profile__avatar-edit-button');

const popups = document.querySelectorAll('.popup');

popups.forEach((item) => {
  item.classList.add('popup_is-animated');
});

const popupImage = imageModal.querySelector('.popup__image');
const popupCaption = imageModal.querySelector('.popup__caption');

function handleCardClick(name, link) {
  popupImage.src = link;
  popupImage.alt = name;
  popupCaption.textContent = name;
  openModal(imageModal);
}

function renderCard(cardData) {
  const cardElement = createCard(
    cardData,
    handleCardClick,
    handleDeleteClick,
    handleLikeClick,
    getCurrentUserId()
  );
  document.querySelector('.places__list').prepend(cardElement);
}

Promise.all([getUserInfo(), getInitialCards()])
  .then(([userData, cardsData]) => {
    setUserInfo(userData);
    
    cardsData.reverse().forEach(cardData => {
      renderCard(cardData);
    });
  })
  .catch(err => console.log(err));

profileEditButton.addEventListener('click', () => {
  const userData = getLocalUserInfo();
  document.querySelector('.popup__input_type_name').value = userData.name;
  document.querySelector('.popup__input_type_description').value = userData.description;
  
  clearValidation(profileForm, validationConfig);
  openModal(editProfileModal);
});

profileAddButton.addEventListener('click', () => {
  cardForm.reset();
  clearValidation(cardForm, validationConfig);
  openModal(addCardModal);
});

avatarEditButton.addEventListener('click', () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationConfig);
  openModal(avatarModal);
});

profileForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  
  const submitButton = profileForm.querySelector(validationConfig.submitButtonSelector);
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  
  updateUserInfo(
    document.querySelector('.popup__input_type_name').value,
    document.querySelector('.popup__input_type_description').value
  )
    .then(userData => {
      setUserInfo(userData);
      closeModal(editProfileModal);
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

cardForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  
  const submitButton = cardForm.querySelector(validationConfig.submitButtonSelector);
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  
  addNewCard(
    document.querySelector('.popup__input_type_card-name').value,
    document.querySelector('.popup__input_type_url').value
  )
    .then(cardData => {
      renderCard(cardData);
      cardForm.reset();
      closeModal(addCardModal);
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});

avatarForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  
  const submitButton = avatarForm.querySelector(validationConfig.submitButtonSelector);
  const originalText = submitButton.textContent;
  submitButton.textContent = 'Сохранение...';
  
  updateAvatar(document.querySelector('.popup__input_type_avatar-url').value)
    .then(userData => {
      setUserInfo(userData);
      closeModal(avatarModal);
    })
    .catch(err => console.log(err))
    .finally(() => {
      submitButton.textContent = originalText;
    });
});