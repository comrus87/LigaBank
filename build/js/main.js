'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // Попап авторизации

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

    formLogin.addEventListener('submit', function (evt) {
      evt.preventDefault();
      localStorage.setItem('Логин', loginInput.value);
      localStorage.setItem('Пароль', passwordInput.value);
      closeLoginModal();
    });

    document.addEventListener('keydown', function (evt) {
      if (evt.keyCode === ESC_KEYCODE) {
        closeLoginModal();
        closeModalSuccess();
      }
    });
  }

  // Сладйдер

  var introPage = document.querySelector('.intro');

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

  // Блок услуги

  var tabs = document.querySelectorAll('.services__tab-item');
  var tabContents = document.querySelectorAll('.services__block');
  var servicesPage = document.querySelector('.services');

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

  // Блок калькулятор

  var ERROR_EMAIL_MESSAGE = 'Введите корректный E-mail';
  var select = document.querySelector('.calculator__select');
  var selectTitle = document.querySelector('.calculator__select-title');
  var selectList = document.querySelector('.calculator__select-list');
  var mortgageBlock = document.querySelector('.calculator__mortgage-container');
  var avtoBlock = document.querySelector('.calculator__avto-container');
  var consumerBlock = document.querySelector('.calculator__consumer-container');
  var offerBlock = document.querySelector('.calculator__offer-wrap');

  var creditFormBlock = document.querySelector('.credit-form');
  var targetForm = document.querySelector('#target-form');
  var totalSumForm = document.querySelector('#total-sum-form');
  var initialPayForm = document.querySelector('#initial-pay-form');
  var periodForm = document.querySelector('#period-form');

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
  var MIN_PERIOD_MORTGAGE = 5;
  var MAX_PERIOD_MORTGAGE = 30;
  var PERCENT_POINT_MORTGAGE = 15;
  var MAX_PERSENT = 100;

  var mortgageTotalInput = mortgageBlock.querySelector('.calculator__input-total');
  var mortgageInitialInput = mortgageBlock.querySelector('.calculator__input-initial');
  var mortgageInitialRange = mortgageBlock.querySelector('.calculator__range-initial');
  var mortgagePeriodInput = mortgageBlock.querySelector('.calculator__input-period');
  var maternityCapital = mortgageBlock.querySelector('.calculator__capital input');

  var mortgagePayPercent = mortgageBlock.querySelector('.calculator__pay-percent');
  var mortgagePeriodRange = mortgageBlock.querySelector('.calculator__range-period');
  var mortgageBtnMinus = mortgageBlock.querySelector('.calculator__btn-minus');
  var mortgageBtnPlus = mortgageBlock.querySelector('.calculator__btn-plus');


  var offer = document.querySelector('.calculator__offer-column');
  var sumOffer = document.querySelector('.calculator__offer-sum');
  var percentOffer = document.querySelector('.calculator__offer-percent');
  var payOffer = document.querySelector('.calculator__offer-pay');
  var requiredOffer = document.querySelector('.calculator__offer-required');


  var offerWarning = document.querySelector('.calculator__warning');
  var btnOpenForm = document.querySelector('.calculator__fill-form');

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

  function showPeriod(input, value) {
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

  // Общиая стоимость

  function addStyleTotalInput(totalInput) {
    totalInput.value = totalInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    totalInput.style.color = '#1f1e25';
    totalInput.style.borderColor = '#1f1e25';
  }

  function changeTotalInput(totalInput, initialRangeValue, initialInput) {
    var valueNumber = parseInt(totalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber >= MIN_COINT_MORTGAGE && valueNumber <= MAX_COINT_MORTGAGE) {

      changeInitialInput(valueNumber, initialRangeValue, initialInput);

      totalInput.style.color = '#1f1e25';
      totalInput.style.borderColor = '#1f1e25';

      totalInput.value = showCurrency(valueNumber);

    } else {
      totalInput.value = 'Некорректное значение';
      totalInput.style.color = 'red';
      totalInput.style.borderColor = 'red';
    }
  }

  function onMortgageTotalInput() {
    addStyleTotalInput(mortgageTotalInput);
  }

  function onMortgageTotalInputChange() {
    var initialRangeValue = mortgageInitialRange.value;
    changeTotalInput(mortgageTotalInput, initialRangeValue, mortgageInitialInput);
  }

  mortgageTotalInput.addEventListener('input', onMortgageTotalInput);
  mortgageTotalInput.addEventListener('change', onMortgageTotalInputChange);


  function onMortgageBtnMinusClick() {
    var valueNumber = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber >= MIN_COINT_BTN_MORTGAGE) {
      valueNumber -= STEP_MORTGAGE;
      mortgageTotalInput.value = showCurrency(valueNumber);
      changeInitialInput(valueNumber, mortgageInitialRange.value, mortgageInitialInput);
      onMortgageCalcChange();
    }
  }

  function onMortgageBtnPlusClick() {
    var valueNumber = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber <= MAX_COINT_BTN_MORTGAGE) {
      valueNumber += STEP_MORTGAGE;

      mortgageTotalInput.value = showCurrency(valueNumber);
      changeInitialInput(valueNumber, mortgageInitialRange.value, mortgageInitialInput);
      onMortgageCalcChange();
    }
  }

  mortgageBtnMinus.addEventListener('click', onMortgageBtnMinusClick);
  mortgageBtnPlus.addEventListener('click', onMortgageBtnPlusClick);


  // Первоначальный взнос

  function changeInitialInput(totalValue, persent, initialInput) {
    var initialValueNumber = Math.round((totalValue * persent) / MAX_PERSENT);
    initialInput.value = showCurrency(initialValueNumber);
  }

  function calcInitialRange(totalInput, initialRange, initialInput) {
    var valueNumberTotal = parseInt(totalInput.value.replace(/\D+/g, ''), 10);
    changeInitialInput(valueNumberTotal, initialRange.value, initialInput);
    mortgagePayPercent.textContent = initialRange.value + '%';
  }

  function calcInitialInput(initialInput, totalInput, initialRange) {
    var valueNumber = parseInt(initialInput.value.replace(/\D+/g, ''), 10);
    var valueNumberTotal = parseInt(totalInput.value.replace(/\D+/g, ''), 10);

    var percent = (valueNumber * MAX_PERSENT) / valueNumberTotal;

    if (percent < MIN_PERSENT_MORTGAGE || !valueNumber) {
      changeInitialInput(valueNumberTotal, MIN_PERSENT_MORTGAGE, initialInput);
      initialRange.value = MIN_PERSENT_MORTGAGE;
    } else if (percent > MAX_PERSENT) {
      changeInitialInput(valueNumberTotal, MAX_PERSENT, initialInput);
      initialRange.value = MAX_PERSENT;
    } else {
      changeInitialInput(valueNumberTotal, percent, initialInput);
      initialRange.value = percent;
    }

    mortgagePayPercent.textContent = initialRange.value + '%';
  }

  function onMortgageInitialInput() {
    mortgageInitialInput.value = mortgageInitialInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  }

  function onMortgageInitialInputChange() {
    calcInitialInput(mortgageInitialInput, mortgageTotalInput, mortgageInitialRange);
  }

  function onInitialRangeChange() {
    calcInitialRange(mortgageTotalInput, mortgageInitialRange, mortgageInitialInput);
  }

  mortgageInitialInput.addEventListener('input', onMortgageInitialInput);
  mortgageInitialInput.addEventListener('change', onMortgageInitialInputChange);
  mortgageInitialRange.addEventListener('change', onInitialRangeChange);

  // Период ипотеки

  function onMortgagePeriodInput() {
    mortgagePeriodInput.value = mortgagePeriodInput.value.replace(/[^\d]/g, '');
  }

  function onMortgagePeriodInputChange() {
    var valueNumber = parseInt(mortgagePeriodInput.value.replace(/\D+/g, ''), 10);
    if (valueNumber < MIN_PERIOD_MORTGAGE || !valueNumber) {
      mortgagePeriodInput.value = MIN_PERIOD_MORTGAGE + ' лет';
      mortgagePeriodRange.value = MIN_PERIOD_MORTGAGE;
    } else if (valueNumber > MAX_PERIOD_MORTGAGE) {
      mortgagePeriodInput.value = MAX_PERIOD_MORTGAGE + ' лет';
      mortgagePeriodRange.value = MAX_PERIOD_MORTGAGE;
    } else {
      showPeriod(mortgagePeriodInput, valueNumber);
      mortgagePeriodRange.value = valueNumber;
    }
  }

  function onMortgagePeriodRange() {
    var valueNumber = parseInt(mortgagePeriodRange.value.replace(/\D+/g, ''), 10);
    showPeriod(mortgagePeriodInput, valueNumber);
  }

  mortgagePeriodInput.addEventListener('input', onMortgagePeriodInput);
  mortgagePeriodInput.addEventListener('change', onMortgagePeriodInputChange);
  mortgagePeriodRange.addEventListener('change', onMortgagePeriodRange);


  // Блок предложение

  function onMortgageCalcChange() {
    var valueTotal = parseInt(mortgageTotalInput.value.replace(/\D+/g, ''), 10);
    var valueInitial = parseInt(mortgageInitialInput.value.replace(/\D+/g, ''), 10);
    var valueInitialRange = parseInt(mortgageInitialRange.value.replace(/\D+/g, ''), 10);
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
    periodForm.value = mortgagePeriodInput.value;
  }

  mortgageBlock.addEventListener('change', onMortgageCalcChange);

  // Форма отправки

  var nameForm = document.querySelector('.credit-form__name-input');
  var phoneForm = document.querySelector('.credit-form__phone-input');
  var emailForm = document.querySelector('.credit-form__email-input');
  var creditForm = document.querySelector('.credit-form form');
  var modalSuccess = document.querySelector('.modal-success');
  var overlaySuccess = document.querySelector('.overlay-success');
  var btnCloseModalSuccess = document.querySelector('.modal-success__btn-close');

  btnOpenForm.addEventListener('click', function () {
    creditFormBlock.style.display = 'block';
    nameForm.focus();
  });

  var onEmailValidate = function () {
    var value = emailForm.value.trim();
    var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;

    if (reg.test(value) === false && value !== '') {
      emailForm.setCustomValidity(ERROR_EMAIL_MESSAGE);
    } else {
      emailForm.setCustomValidity('');
    }
  };

  function onCreditFormSubmit(evt) {
    evt.preventDefault();
    localStorage.setItem('ФИО', nameForm.value);
    localStorage.setItem('Телефон', phoneForm.value);
    localStorage.setItem('E-mail', emailForm.value);
    creditForm.reset();
    creditFormBlock.style.display = 'none';
    modalSuccess.style.display = 'block';
    overlaySuccess.style.display = 'block';
    document.body.style.overflow = 'hidden';
  }

  function closeModalSuccess() {
    modalSuccess.style.display = 'none';
    overlaySuccess.style.display = 'none';
    document.body.style.overflow = '';
  }

  if (creditForm) {
    IMask(phoneForm, {mask: '+{7}(000)000-00-00'});

    emailForm.addEventListener('input', onEmailValidate);
    creditForm.addEventListener('submit', onCreditFormSubmit);
    btnCloseModalSuccess.addEventListener('click', closeModalSuccess);
  }

  // Автокредит <<<<<<<<<<<<

  var STEP_AVTO = 50000;
  var MIN_COINT_AVTO = 500000;
  var MAX_COINT_AVTO = 5000000;
  var MIN_COINT_BTN_AVTO = 550000;
  var MAX_COINT_BTN_AVTO = 4950000;
  var MIN_SUM_AVTO = 200000;
  var MIN_PERSENT_AVTO = 20;

  var MIN_PERIOD_AVTO = 1;
  var MAX_PERIOD_AVTO = 5;

  var avtoTotalInput = avtoBlock.querySelector('.calculator__input-total');
  var avtoInitialInput = avtoBlock.querySelector('.calculator__input-initial');
  var avtoInitialRange = avtoBlock.querySelector('.calculator__range-initial');
  var avtoPeriodInput = avtoBlock.querySelector('.calculator__input-period');
  var avtoPeriodRange = avtoBlock.querySelector('.calculator__range-period');
  var avtoPayPercent = avtoBlock.querySelector('.calculator__pay-percent');
  var avtoBtnMinus = avtoBlock.querySelector('.calculator__btn-minus');
  var avtoBtnPlus = avtoBlock.querySelector('.calculator__btn-plus');

  var kasko = avtoBlock.querySelector('.calculator__kasko input');



});
