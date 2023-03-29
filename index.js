'use strict'

document.addEventListener('DOMContentLoaded', function () {
  const wrapper = document.querySelector('.wrapper');
  const form = document.getElementById('form');

  const successSubmitMessage = document.querySelector('#success').content.querySelector('.success').cloneNode(true);

  const onCloseMessageClick = () => {
    successSubmitMessage.remove();
    successSubmitMessage.removeEventListener('click', onCloseMessageClick);
    document.removeEventListener('keydown', onMessageEscKeydown);
  };

  const showMessage = () => {
  wrapper.append(successSubmitMessage);
  successSubmitMessage.addEventListener('click', onCloseMessageClick);
  document.addEventListener('keydown', onMessageEscKeydown);
};

  function onMessageEscKeydown (evt) {
    if (evt.key === 'Escape') {
      evt.preventDefault();
      onCloseMessageClick();
    }
  }
  
  form.addEventListener('submit', formSend);

  async function formSend(e) {
    e.preventDefault();

    let error = formValidate(form);

    let formData = new FormData(form);
    if(formImage.file) {
      formData.append('image', formImage.file[0]);
    }
  
    if (error === 0 ) {
      // wrapper.classList.add('_sending');
      fetch('https://echo.htmlacademy.ru/', {
        method: 'POST',
        body: formData
      })

        .then((response) => {
          if (response.ok) {
            // alert("Форма успешно отправлена!")
            // wrapper.parentElement.classList.remove('_sending');

            showMessage();
            form.reset();

          } else {
            // wrapper.parentElement.classList.remove('_sending');
            alert("Ошибка HTTP: " + response.status);
          }
        })
      // if (response.ok) {
      //   let result = await response.json();
      //   alert(result.message);
      //   formPreview.innerHTML = '';
      //   form.reset();
      // } else {
      //   alert('ошибка');
      // }
    } else {
        alert('заполните обязательные поля');
    }
  }

  function formValidate(form) {
    let error = 0;
    let formReg = form.querySelectorAll('._reg');

    for (let index = 0; index < formReg.length; index++) {
      const input = formReg[index];
      formRemoveError(input);

      if (input.classList.contains('_email')) {
        if (emailTest(input)) {
          formAddError(input);
          error++;
        }
      } else if (input.getAttribute("type") === "checkbox" && input.checked === false) {
        formAddError(input);
        error++;
      } else {
        if (input.value === '') {
          formAddError(input);
          error++;
        }

      }
    }

    return error;
  }

  function formAddError(input) {
    input.parentElement.classList.add('_error');
    input.classList.add('_error')
  }

  function formRemoveError(input) {
    input.parentElement.classList.remove('_error');
    input.classList.remove('_error');
  }

  function emailTest (input) {
    return !/^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(input.value);
  }

  const formImage = document.getElementById('formImage');

  const formPreview = document.getElementById('formPreview');

  formImage.addEventListener('change', () => {
    uploadFile(formImage.files[0]);
  });

  function uploadFile(file) {

    if (!['image/jpeg', 'image/png', 'image/gif'].includes(file.type)) {
      alert('Разрешены только изображения.');
      formImage.value = '';
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Файл должен быть менее 2 МБ.');
      return;
    }

    var reader = new FileReader();
    reader.onload = function (e) {
    formPreview.innerHTML = `<img src="${e.target.result}" alt="Фото">`;
    };

    reader.onerror = function (e) {
    alert('Ошибка');
    };

    reader.readAsDataURL(file);
  }
});