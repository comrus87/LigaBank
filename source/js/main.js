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

  var targetForm = document.querySelector('#target-form');


  var state = {
    modeCredit: null
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
    creditFormBlock.style.display = 'none';
  }

  selectList.addEventListener('click', function (evt) {
    state.modeCredit = evt.target.getAttribute('data-value');
    selectTitle.textContent = evt.target.textContent;

    switch (state.modeCredit) {
      case 'mortgage':
        showCreditBlock(mortgageBlock);
        targetForm.value = 'Ипотека';
        break;
      case 'avto':
        showCreditBlock(avtoBlock);
        targetForm.value = 'Автокредит';
        break;
      case 'consumer':
        showCreditBlock(consumerBlock);
        targetForm.value = 'Потребительский кредит';
        break;
    }
  });


  // иптоека
  var STEP_MORTGAGE = 100000;
  var MIN_COINT_MORTGAGE = 1200000;
  var MAX_COINT_MORTGAGE = 25000000;
  var MIN_COINT_BTN_MORTGAGE = 1300000;
  var MAX_COINT_BTN_MORTGAGE = 24900000;
  var MATERNITY_CAPITAL = 470000;
  var MIN_SUM_MORTGAGE = 500000;
  var MIN_PERSENT_MORTGAGE = 10;
  var MAX_PERSENT_MORTGAGE = 100;
  var MIN_PERIOD_MORTGAGE = 5;
  var MAX_PERIOD_MORTGAGE = 30;
  var PERCENT_POINT_MORTGAGE = 15;
  var mortgageTotalInput = mortgageBlock.querySelector('.calculator__input-total');
  var mortgageInitialInput = mortgageBlock.querySelector('.calculator__input-initial');
  var mortgageInitialRange = mortgageBlock.querySelector('.calculator__range-initial');
  var mortgagePercent = mortgageBlock.querySelector('.calculator__pay-percent');
  var mortgagePeriodInput = mortgageBlock.querySelector('.calculator__input-period');
  var mortgagePeriodRange = mortgageBlock.querySelector('.calculator__range-period');

  var btnMinus = mortgageBlock.querySelector('.calculator__btn-minus');
  var btnPlus = mortgageBlock.querySelector('.calculator__btn-plus');

  var offer = document.querySelector('.calculator__offer-column');
  var sumOffer = document.querySelector('.calculator__offer-sum');
  var percentOffer = document.querySelector('.calculator__offer-percent');
  var payOffer = document.querySelector('.calculator__offer-pay');
  var requiredOffer = document.querySelector('.calculator__offer-required');
  var maternityCapital = mortgageBlock.querySelector('.calculator__capital input');

  var offerWarning = document.querySelector('.calculator__warning');

  var btnOpenForm = document.querySelector('.calculator__fill-form');
  var creditForm = document.querySelector('.credit-form');


  var totalSumForm = document.querySelector('#total-sum-form');
  var initialPayForm = document.querySelector('#initial-pay-form');
  var peroidForm = document.querySelector('#peroid-form');


  function showCurrency(value) {
    var lastNumber = String(value).slice(-1);
    if (lastNumber === '1') {
      return String(value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(/^0+/, '') + ' рубль';
    } else if (lastNumber === '2' || lastNumber === '3' || lastNumber === '4') {
      return String(value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(/^0+/, '') + ' рубля';
    } else {
      return String(value).replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ').replace(/^0+/, '') + ' рублей';
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
    mortgageInitialInput.value = showCurrency(initialValueNumber);
  }

  // Общая сумма

  function onTotalInput() {
    mortgageTotalInput.value = mortgageTotalInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    mortgageTotalInput.style.color = '#1f1e25';
    mortgageTotalInput.style.borderColor = '#1f1e25';
  }

  function onTotalInputChange() {
    var valueNumber = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber >= MIN_COINT_MORTGAGE && valueNumber <= MAX_COINT_MORTGAGE) {

      changeInitialInput(valueNumber, mortgageInitialRange.value);

      mortgageTotalInput.style.color = '#1f1e25';
      mortgageTotalInput.style.borderColor = '#1f1e25';

      mortgageTotalInput.value = showCurrency(valueNumber);

    } else {
      mortgageTotalInput.value = 'Некорректное значение';
      mortgageTotalInput.style.color = 'red';
      mortgageTotalInput.style.borderColor = 'red';
    }

  }

  mortgageTotalInput.addEventListener('input', onTotalInput);
  mortgageTotalInput.addEventListener('change', onTotalInputChange);

  function onBtnMinusClick() {
    var valueNumber = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber >= MIN_COINT_BTN_MORTGAGE) {
      valueNumber -= STEP_MORTGAGE;
      mortgageTotalInput.value = showCurrency(valueNumber);
      changeInitialInput(valueNumber, mortgageInitialRange.value);
      onMortgageCalcChange();
    }
  }

  function onBtnPlusClick() {
    var valueNumber = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber <= MAX_COINT_BTN_MORTGAGE) {
      valueNumber += STEP_MORTGAGE;

      mortgageTotalInput.value = showCurrency(valueNumber);
      changeInitialInput(valueNumber, mortgageInitialRange.value);
      onMortgageCalcChange();
    }
  }

  btnMinus.addEventListener('click', onBtnMinusClick);
  btnPlus.addEventListener('click', onBtnPlusClick);


  // Первоначальный взнос

  function onInitialRangeChange() {
    var valueNumberTotal = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);
    changeInitialInput(valueNumberTotal, mortgageInitialRange.value);
    mortgagePercent.textContent = mortgageInitialRange.value + '%';
  }

  function onInitialInput() {
    mortgageInitialInput.value = mortgageInitialInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  }

  function onInitialInputChange() {
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
  }

  mortgageInitialInput.addEventListener('input', onInitialInput);
  mortgageInitialInput.addEventListener('change', onInitialInputChange);
  mortgageInitialRange.addEventListener('change', onInitialRangeChange);


  // Период ипотеки

  function onPeriodInput() {
    mortgagePeriodInput.value = mortgagePeriodInput.value.replace(/[^\d]/g, '');
  }

  function onPeriodInputChange() {
    var valueNumber = parseInt(mortgagePeriodInput.value.replace(/\D+/g, ''), 10);
    if (valueNumber < MIN_PERIOD_MORTGAGE || !valueNumber) {
      mortgagePeriodInput.value = MIN_PERIOD_MORTGAGE + ' лет';
      mortgagePeriodRange.value = MIN_PERIOD_MORTGAGE;
    } else if (valueNumber > MAX_PERIOD_MORTGAGE) {
      mortgagePeriodInput.value = MAX_PERIOD_MORTGAGE + ' лет';
      mortgagePeriodRange.value = MAX_PERIOD_MORTGAGE;
    } else {
      showMortgagePeriod(mortgagePeriodInput, valueNumber);
      mortgagePeriodRange.value = valueNumber;
    }
  }

  function onPeriodRange() {
    var valueNumber = parseInt(mortgagePeriodRange.value.replace(/\D+/g, ''), 10);
    showMortgagePeriod(mortgagePeriodInput, valueNumber);
  }

  mortgagePeriodInput.addEventListener('input', onPeriodInput);
  mortgagePeriodInput.addEventListener('change', onPeriodInputChange);
  mortgagePeriodRange.addEventListener('change', onPeriodRange);

  // Блок предложение


  function onMortgageCalcChange() {
    var valueTotal = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);
    var valueInitial = parseInt(mortgageInitialInput.value.replace(/\D+/g, ''), 10);
    var valueInitialRange = mortgageInitialRange.value;
    var valuePeriod = parseInt(mortgagePeriodInput.value.replace(/\D+/g, ''), 10);

    var mortgageSum;
    var percentRate;

    if (maternityCapital.checked) {
      mortgageSum = valueTotal - valueInitial - MATERNITY_CAPITAL;
    } else {
      mortgageSum = valueTotal - valueInitial;
    }

    if (mortgageSum < MIN_SUM_MORTGAGE) {
      offer.style.display = 'none';
      offerWarning.style.display = 'block';
    } else {
      offer.style.display = 'block';
      offerWarning.style.display = 'none';
    }

    if (valueInitialRange < PERCENT_POINT_MORTGAGE) {
      percentRate = 9.4 / 1200;
      percentOffer.textContent = '9,40%';
    } else {
      percentRate = 8.5 / 1200;
      percentOffer.textContent = '8,50%';
    }

    sumOffer.textContent = showCurrency(mortgageSum);

    var monthlyPow = valuePeriod * 12;
    var monthlyPay = mortgageSum * (percentRate + (percentRate / (Math.pow((1 + percentRate), monthlyPow) - 1)));
    var requiredProfit = monthlyPay * 100 / 45;

    payOffer.textContent = showCurrency(monthlyPay.toFixed());
    requiredOffer.textContent = showCurrency(requiredProfit.toFixed());

    totalSumForm.value = mortgageTotalInput.value;
    initialPayForm.value = mortgageInitialInput.value;
    peroidForm.value = mortgagePeriodInput.value;
  }

  mortgageBlock.addEventListener('change', onMortgageCalcChange);

  btnOpenForm.addEventListener('click', function () {
    creditForm.style.display = 'block';
  });

});
