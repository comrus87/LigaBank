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

  var tabs = document.querySelectorAll('.services__tab-item');
  var tabContents = document.querySelectorAll('.services__block');
  var introPage = document.querySelector('.intro');
  var servicesPage = document.querySelector('.services');

  // Модальное окно

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


  // СЛайдер

  if (introPage) {
    var sliderIntro = new Swiper('.intro', {
      pagination: {
        el: '.swiper-pagination',
        clickable: true
      },
      autoplay: {
        delay: 4000,
      },
      speed: 700
    });

    sliderIntro.init();
  }


  // Табы

  function switchTabs() {
    function hideTabContent(a) {
      for (var i = a; i < tabContents.length; i++) {
        tabContents[i].classList.add('services__hide');
        tabContents[i].classList.remove('services__show');

        tabs[i].classList.remove('services__tab-item--active');
      }
    }

    hideTabContent(1);

    function showTabContent(b) {
      if (tabContents[b].classList.contains('services__hide')) {
        tabContents[b].classList.remove('services__hide');
        tabContents[b].classList.add('services__show');
        tabs[b].classList.add('services__tab-item--active');
      }
    }

    tabs.forEach(function (tab, i) {
      tab.addEventListener('click', function () {
        hideTabContent(0);
        showTabContent(i);
      });
    });
  }

  var sliderServices = new Swiper('.services', {
    breakpoints: {
      320: {
        init: true,
        pagination: {
          el: '.swiper-pagination',
          clickable: true,
          bulletClass: 'services__bullet',
          bulletActiveClass: 'services__active-bullet'
        }
      },
      1024: {
        init: false
      }
    }
  });

  function changeServicePage() {
    if (window.matchMedia('(min-width: 1024px)').matches) {
      sliderServices.destroy(false);
      switchTabs();
    } else if (window.matchMedia('(max-width: 1024px)').matches) {
      sliderServices.init();
    }
  }

  if (servicesPage) {
    changeServicePage();
    window.addEventListener('resize', changeServicePage);
  }

  // Калькулятор

  var select = document.querySelector('.calculator__select');
  var selectTitle = document.querySelector('.calculator__select-title');

  var selectList = document.querySelector('.calculator__select-list');
  var mortgageBlock = document.querySelector('.calculator__mortgage-container');
  var avtoBlock = document.querySelector('.calculator__avto-container');
  var consumerBlock = document.querySelector('.calculator__consumer-container');
  var offerBlock = document.querySelector('.calculator__offer-wrap');
  var creditFormBlock = document.querySelector('.credit-form');


  var state = {
    modeCredit: null,
    mortgage: {
      totalValue: 2000000,
      initialPay: null,
      period: null,
      isCapital: false
    }
  };


  var arrBlocks = [];
  arrBlocks.push(mortgageBlock, avtoBlock, consumerBlock);

  function hiddenCreditBlocks() {
    for (var i = 0; i < arrBlocks.length; i++) {
      arrBlocks[i].style.display = 'none';
    }
    offerBlock.style.display = 'none';
    creditFormBlock.style.display = 'none';
  }

  hiddenCreditBlocks();

  function toggleSelect(evt) {
    evt.stopPropagation();
    if (!select.classList.contains('calculator__select--active')) {
      select.classList.add('calculator__select--active');
      document.addEventListener('click', function () {
        select.classList.remove('calculator__select--active');
      });
    } else {
      select.classList.remove('calculator__select--active');
    }
  }

  selectTitle.addEventListener('click', toggleSelect);

  function showCreditBlock(mode) {
    for (var i = 0; i < arrBlocks.length; i++) {
      arrBlocks[i].style.display = 'none';
    }
    mode.style.display = 'block';
    offerBlock.style.display = 'block';
  }

  selectList.addEventListener('click', function (evt) {
    state.modeCredit = evt.target.getAttribute('data-value');
    selectTitle.textContent = evt.target.textContent;

    switch (state.modeCredit) {
      case 'mortgage':
        showCreditBlock(mortgageBlock);
        break;
      case 'avto':
        showCreditBlock(avtoBlock);
        break;
      case 'consumer':
        showCreditBlock(consumerBlock);
        break;
    }
  });


  // иптоека
  var STEP_MORTGAGE = 100000;
  var MIN_PERSENT_MORTGAGE = 10;
  var MAX_PERSENT_MORTGAGE = 100;
  var MIN_PERIOD_MORTGAGE = 5;
  var MAX_PERIOD_MORTGAGE = 30;
  var mortgageTotalInput = mortgageBlock.querySelector('.calculator__input-total');
  var mortgageInitialInput = mortgageBlock.querySelector('.calculator__input-initial');
  var mortgageInitialRange = mortgageBlock.querySelector('.calculator__range-initial');
  var mortgagePercent = mortgageBlock.querySelector('.calculator__pay-percent');
  var mortgagePeriodInput = mortgageBlock.querySelector('.calculator__input-period');

  var btnMinus = mortgageBlock.querySelector('.calculator__btn-minus');
  var btnPlus = mortgageBlock.querySelector('.calculator__btn-plus');


  function showCurrency(lastNumber, input, value) {
    if (lastNumber === '1') {
      input.value = value.replace(/^0+/, '') + ' рубль';
    } else if (lastNumber === '2' || lastNumber === '3' || lastNumber === '4') {
      input.value = value.replace(/^0+/, '') + ' рубля';
    } else {
      input.value = value.replace(/^0+/, '') + ' рублей';
    }
  }

  function showMortgagePeriod(input, value) {
    var lastNumber = String(value).slice(-1);
    var twoLastNumber = String(value).slice(-2);

    if (twoLastNumber === '11' || twoLastNumber === '12' || twoLastNumber === '13' || twoLastNumber === '14') {
      input.value = String(value).replace(/^0+/, '') + ' лет';
    } else {
      if (lastNumber === '1') {
        input.value = String(value).replace(/^0+/, '') + ' год';
      } else if (lastNumber === '2' || lastNumber === '3' || lastNumber === '4') {
        input.value = String(value).replace(/^0+/, '') + ' года';
      } else {
        input.value = String(value).replace(/^0+/, '') + ' лет';
      }
    }
  }

  function changeInitialInput(totalValue, persent) {
    var initialValueNumber = Math.round((totalValue * persent) / 100);
    var valueString = String(initialValueNumber).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    var lastNumber = valueString.slice(-1);
    showCurrency(lastNumber, mortgageInitialInput, valueString);
    state.mortgage.initialPay = initialValueNumber;
  }

  mortgageTotalInput.addEventListener('input', function () {
    mortgageTotalInput.value = mortgageTotalInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    mortgageTotalInput.style.color = '#1f1e25';
    mortgageTotalInput.style.borderColor = '#1f1e25';
  });

  mortgageInitialInput.addEventListener('input', function () {
    mortgageInitialInput.value = mortgageInitialInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  });


  mortgageInitialRange.addEventListener('change', function () {
    var valueNumberTotal = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);
    changeInitialInput(valueNumberTotal, mortgageInitialRange.value);
    mortgagePercent.textContent = mortgageInitialRange.value + '%';
  });


  mortgageInitialInput.addEventListener('change', function () {
    var valueNumber = parseInt(mortgageInitialInput.value.replace(/\D+/g, ''), 10);
    var valueNumberTotal = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);

    var percent = (valueNumber * 100) / valueNumberTotal;

    if (percent < MIN_PERSENT_MORTGAGE || !valueNumber) {
      changeInitialInput(valueNumberTotal, MIN_PERSENT_MORTGAGE);
      mortgageInitialRange.value = MIN_PERSENT_MORTGAGE;
    } else if (percent > 100) {
      changeInitialInput(valueNumberTotal, MAX_PERSENT_MORTGAGE);
      mortgageInitialRange.value = MAX_PERSENT_MORTGAGE;
    } else {
      changeInitialInput(valueNumberTotal, percent);
      mortgageInitialRange.value = percent;
    }

    mortgagePercent.textContent = mortgageInitialRange.value + '%';
  });

  mortgageTotalInput.addEventListener('change', function () {
    var lastNumber = mortgageTotalInput.value.slice(-1);
    var valueNumber = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber >= 1200000 && valueNumber <= 25000000) {
      state.mortgage.totalValue = valueNumber;

      changeInitialInput(valueNumber, mortgageInitialRange.value);

      mortgageTotalInput.style.color = '#1f1e25';
      mortgageTotalInput.style.borderColor = '#1f1e25';
      showCurrency(lastNumber, mortgageTotalInput, mortgageTotalInput.value);
    } else {
      state.mortgage.totalValue = null;
      mortgageTotalInput.value = 'Некорректное значение';
      mortgageTotalInput.style.color = 'red';
      mortgageTotalInput.style.borderColor = 'red';
    }
  });


  btnMinus.addEventListener('click', function () {
    var valueNumber = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);
    var lastNumber = String(valueNumber).slice(-1);

    if (valueNumber >= 1300000) {
      valueNumber -= STEP_MORTGAGE;
      var valueString = String(valueNumber).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
      showCurrency(lastNumber, mortgageTotalInput, valueString);
      changeInitialInput(valueNumber, mortgageInitialRange.value);
      state.mortgage.totalValue = valueNumber;
    }
  });

  btnPlus.addEventListener('click', function () {
    var valueNumber = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);
    var lastNumber = String(valueNumber).slice(-1);

    if (valueNumber <= 24900000) {
      valueNumber += STEP_MORTGAGE;
      var valueString = String(valueNumber).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
      showCurrency(lastNumber, mortgageTotalInput, valueString);
      changeInitialInput(valueNumber, mortgageInitialRange.value);
      state.mortgage.totalValue = valueNumber;
    }
  });

  // Период ипотеки

  mortgagePeriodInput.addEventListener('input', function () {
    mortgagePeriodInput.value = mortgagePeriodInput.value.replace(/[^\d]/g, '');
  });

  mortgagePeriodInput.addEventListener('change', function () {
    var valueNumber = parseInt(mortgagePeriodInput.value.replace(/\D+/g, ''), 10);
    if (valueNumber < MIN_PERIOD_MORTGAGE) {
      mortgagePeriodInput.value = MIN_PERIOD_MORTGAGE + ' лет';
    } else if (valueNumber > MAX_PERIOD_MORTGAGE) {
      mortgagePeriodInput.value = MAX_PERIOD_MORTGAGE + ' лет';
    } else {
      showMortgagePeriod(mortgagePeriodInput, valueNumber);
    }
  });


});
