function showInputError(formElement, inputElement, errorMessage, config) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.add(config.inputErrorClass);
  errorElement.textContent = errorMessage;
  errorElement.classList.add(config.errorClass);
}

function hideInputError(formElement, inputElement, config) {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
  inputElement.classList.remove(config.inputErrorClass);
  errorElement.classList.remove(config.errorClass);
  errorElement.textContent = '';
}

function hasInvalidInput(inputList) {
  return inputList.some(inputElement => {
    return !inputElement.validity.valid;
  });
}

function toggleButtonState(inputList, buttonElement, config) {
  if (hasInvalidInput(inputList)) {
    buttonElement.classList.add(config.inactiveButtonClass);
    buttonElement.disabled = true;
  } else {
    buttonElement.classList.remove(config.inactiveButtonClass);
    buttonElement.disabled = false;
  }
}

function setEventListeners(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  toggleButtonState(inputList, buttonElement, config);

  inputList.forEach(inputElement => {
    inputElement.addEventListener('input', function() {
      checkInputValidity(formElement, inputElement, config);
      toggleButtonState(inputList, buttonElement, config);
    });
  });
}

export function enableValidation(config) {
  const formList = Array.from(document.querySelectorAll(config.formSelector));
  formList.forEach(formElement => {
    setEventListeners(formElement, config);
  });
}

export function clearValidation(formElement, config) {
  const inputList = Array.from(formElement.querySelectorAll(config.inputSelector));
  const buttonElement = formElement.querySelector(config.submitButtonSelector);

  inputList.forEach(inputElement => {
    hideInputError(formElement, inputElement, config);
    inputElement.setCustomValidity("");
  });

  toggleButtonState(inputList, buttonElement, config);
}

function checkInputValidity(formElement, inputElement, config) {
  inputElement.setCustomValidity('');

  const errorMessages = {
    valueMissing: inputElement.dataset.errorRequired,
    tooShort: inputElement.dataset.errorTooShort,
    patternMismatch: inputElement.dataset.errorPattern,
    typeMismatch: inputElement.dataset.errorType,
    customError: inputElement.dataset.error
  };

  const validityKeys = ['valueMissing', 'tooShort', 'patternMismatch', 'typeMismatch', 'customError'];
  const errorType = validityKeys.find(key => inputElement.validity[key] && errorMessages[key]);

  let finalMessage = '';

  if (errorType) {
    finalMessage = errorMessages[errorType];
    if (errorType === 'tooShort') {
      finalMessage = finalMessage
        .replace('{min}', inputElement.minLength)
        .replace('{length}', inputElement.value.length);
    }

    inputElement.setCustomValidity(finalMessage);
  }

  if (!inputElement.validity.valid) {
    showInputError(formElement, inputElement, finalMessage, config);
  } else {
    hideInputError(formElement, inputElement, config);
  }
}
