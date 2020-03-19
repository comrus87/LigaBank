'use strict';

document.addEventListener('DOMContentLoaded', function () {

  var ESC_KEYCODE = 27;
  var overlayLogin = document.querySelector('.overlay-login');
  var modalLogin = document.querySelector('.modal-login');
  var btnOpenModalLogin = document.querySelector('.page-header__enter-link');
  var btnCloseModalLogin = document.querySelector('.modal-login__btn-close');
  var loginInput = document.querySelector('#login');
  var passwordInput = document.querySelector('#password');
  var formLogin = document.querySelector('#login-form');
  var btnShowPassword = document.querySelector('.modal-login__password-btn');

  function openLoginModal() {
    overlayLogin.style.display = 'block';
    modalLogin.style.display = 'block';
    document.body.style.overflow = 'hidden';
    loginInput.focus();
  }

  function closeLoginModal() {
    overlayLogin.style.display = 'none';
    modalLogin.style.display = 'none';
    document.body.style.overflow = '';
    loginInput.value = '';
    passwordInput.value = '';
  }


  function changeShowPassword() {
    if (passwordInput.getAttribute('type') === 'password') {
      passwordInput.setAttribute('type', 'text');
    } else if (passwordInput.getAttribute('type') === 'text') {
      passwordInput.setAttribute('type', 'password');
    }
  }

  if (modalLogin) {
    btnShowPassword.addEventListener('mousedown', function () {
      var count = 0;
      var timerId = setInterval(function () {
        count++;
      }, 200);

      btnShowPassword.addEventListener('mouseup', function () {
        clearInterval(timerId);
        if (count > 2) {
          changeShowPassword();
          count = 0;
        }
      });
    });

    btnOpenModalLogin.addEventListener('click', openLoginModal);
    btnCloseModalLogin.addEventListener('click', closeLoginModal);

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeLoginModal();
      }
    });

    formLogin.addEventListener('submit', function (evt) {
      evt.preventDefault();
      localStorage.setItem('Логин', loginInput.value);
      localStorage.setItem('Пароль', passwordInput.value);
      closeLoginModal();
    });
  }
});
