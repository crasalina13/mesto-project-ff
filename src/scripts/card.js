export function createCard(cardData, handleCardClick, handleDeleteClick, handleLikeClick, currentUserId) {
  const cardTemplate = document.querySelector('#card-template').content.querySelector('.card');
  const cardElement = cardTemplate.cloneNode(true);
  
  const cardImage = cardElement.querySelector('.card__image');
  const cardTitle = cardElement.querySelector('.card__title');
  const likeButton = cardElement.querySelector('.card__like-button');
  const deleteButton = cardElement.querySelector('.card__delete-button');
  const likeCountElement = cardElement.querySelector('.card__like-count');
  
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;
  
  likeCountElement.textContent = cardData.likes.length;
  
  const isLiked = cardData.likes.some(like => like._id === currentUserId);
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }
  
  if (cardData.owner._id !== currentUserId) {
    deleteButton.remove();
  }
  
  cardImage.addEventListener('click', () => {
    handleCardClick(cardData.name, cardData.link);
  });
  
  likeButton.addEventListener('click', (evt) => {
    handleLikeClick(evt, cardData._id, likeCountElement);
  });
  
  if (deleteButton) {
    deleteButton.addEventListener('click', () => {
      handleDeleteClick(cardData._id, cardElement);
    });
  }
  
  return cardElement;
}