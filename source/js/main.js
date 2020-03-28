'use strict';

document.addEventListener('DOMContentLoaded', function () {

  // Подключаем плавную прокрутку

  var scroll = new SmoothScroll('a[href*="#"]', {
    speed: 500
  });

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

  function showPasswordUnPress(event) {
    var count = 0;
    var timerId = setInterval(function () {
      count++;
    }, 200);

    btnShowPassword.addEventListener(event, function () {
      clearInterval(timerId);
      if (count > 2) {
        changeShowPassword();
        count = 0;
      }
    });
  }

  function onBtnShowPasswordClick() {
    showPasswordUnPress('mouseup');
  }

  function onBtnShowPasswordTouch() {
    showPasswordUnPress('touchend');
  }

  if (modalLogin) {

    btnShowPassword.addEventListener('mousedown', onBtnShowPasswordClick);
    btnShowPassword.addEventListener('touchstart', onBtnShowPasswordTouch);

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
      speed: 700,
      loop: true
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
  var offer = document.querySelector('.calculator__offer-column');
  var sumOfferTitle = document.querySelector('.calculator__offer-sum-title');
  var sumOffer = document.querySelector('.calculator__offer-sum');
  var percentOffer = document.querySelector('.calculator__offer-percent');
  var payOffer = document.querySelector('.calculator__offer-pay');
  var requiredOffer = document.querySelector('.calculator__offer-required');
  var offerWarning = document.querySelector('.calculator__warning');
  var offerWarningTitle = document.querySelector('.calculator__warning-title');
  var btnOpenForm = document.querySelector('.calculator__fill-form');

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
        sumOfferTitle.textContent = 'Сумма ипотеки';
        onMortgageCalcChange();
        break;
      case 'avto':
        showCreditBlock(avtoBlock);
        targetForm.value = 'Автокредит';
        sumOfferTitle.textContent = 'Сумму автокредита';
        onAvtoCalcChange();
        break;
      case 'consumer':
        showCreditBlock(consumerBlock);
        targetForm.value = 'Потребительский кредит';
        sumOfferTitle.textContent = 'Сумму кредита';
        onConsumerCalcChange();
        break;
    }
  });

  // иптоека
  var STEP_MORTGAGE = 100000;
  var MIN_COINT_MORTGAGE = 1200000;
  var MAX_COINT_MORTGAGE = 25000000;
  var MIN_COINT_BTN_MORTGAGE = MIN_COINT_MORTGAGE + STEP_MORTGAGE;
  var MAX_COINT_BTN_MORTGAGE = MAX_COINT_MORTGAGE - STEP_MORTGAGE;
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

  // Общиая сумма ипотеки

  function addStyleTotalInput(totalInput) {
    totalInput.value = totalInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    totalInput.style.color = '#1f1e25';
    totalInput.style.borderColor = '#1f1e25';
  }

  function changeTotalInput(totalInput, initialRangeValue, initialInput, minCoint, maxCoint) {
    var valueNumber = parseInt(totalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber >= minCoint && valueNumber <= maxCoint) {

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
    changeTotalInput(mortgageTotalInput, initialRangeValue, mortgageInitialInput, MIN_COINT_MORTGAGE, MAX_COINT_MORTGAGE);
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


  // Первоначальный взнос ипотеки

  function changeInitialInput(totalValue, persent, initialInput) {
    var initialValueNumber = Math.round((totalValue * persent) / MAX_PERSENT);
    initialInput.value = showCurrency(initialValueNumber);
  }

  function calcInitialRange(totalInput, initialRange, initialInput, payPercent) {
    var valueNumberTotal = parseInt(totalInput.value.replace(/\D+/g, ''), 10);
    changeInitialInput(valueNumberTotal, initialRange.value, initialInput);
    payPercent.textContent = initialRange.value + '%';
  }

  function calcInitialInput(initialInput, totalInput, initialRange, minPersent, payPercent) {
    var valueNumber = parseInt(initialInput.value.replace(/\D+/g, ''), 10);
    var valueNumberTotal = parseInt(totalInput.value.replace(/\D+/g, ''), 10);

    var percent = (valueNumber * MAX_PERSENT) / valueNumberTotal;

    if (percent < minPersent || !valueNumber) {
      changeInitialInput(valueNumberTotal, minPersent, initialInput);
      initialRange.value = minPersent;
    } else if (percent > MAX_PERSENT) {
      changeInitialInput(valueNumberTotal, MAX_PERSENT, initialInput);
      initialRange.value = MAX_PERSENT;
    } else {
      changeInitialInput(valueNumberTotal, percent, initialInput);
      initialRange.value = percent;
    }

    payPercent.textContent = initialRange.value + '%';
  }

  function onMortgageInitialInput() {
    mortgageInitialInput.value = mortgageInitialInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  }

  function onMortgageInitialInputChange() {
    calcInitialInput(mortgageInitialInput, mortgageTotalInput, mortgageInitialRange, MIN_PERSENT_MORTGAGE, mortgagePayPercent);
  }

  function onMortgageInitialRangeChange() {
    calcInitialRange(mortgageTotalInput, mortgageInitialRange, mortgageInitialInput, mortgagePayPercent);
  }

  mortgageInitialInput.addEventListener('input', onMortgageInitialInput);
  mortgageInitialInput.addEventListener('change', onMortgageInitialInputChange);
  mortgageInitialRange.addEventListener('change', onMortgageInitialRangeChange);

  // Период ипотеки

  function changePeriodInput(periodInput, periodRange, minPeriod, maxPeriod) {
    var valueNumber = parseInt(periodInput.value.replace(/\D+/g, ''), 10);
    if (valueNumber < minPeriod || !valueNumber) {
      periodInput.value = minPeriod + ' лет';
      periodRange.value = minPeriod;
    } else if (valueNumber > maxPeriod) {
      periodInput.value = maxPeriod + ' лет';
      periodRange.value = maxPeriod;
    } else {
      showPeriod(periodInput, valueNumber);
      periodRange.value = valueNumber;
    }
  }

  function onMortgagePeriodInput() {
    mortgagePeriodInput.value = mortgagePeriodInput.value.replace(/[^\d]/g, '');
  }

  function onMortgagePeriodInputChange() {
    changePeriodInput(mortgagePeriodInput, mortgagePeriodRange, MIN_PERIOD_MORTGAGE, MAX_PERIOD_MORTGAGE);
  }

  function onMortgagePeriodRange() {
    var valueNumber = parseInt(mortgagePeriodRange.value.replace(/\D+/g, ''), 10);
    showPeriod(mortgagePeriodInput, valueNumber);
  }

  mortgagePeriodInput.addEventListener('input', onMortgagePeriodInput);
  mortgagePeriodInput.addEventListener('change', onMortgagePeriodInputChange);
  mortgagePeriodRange.addEventListener('change', onMortgagePeriodRange);


  // Блок предложение ипотеки

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
      offerWarningTitle.textContent = 'Наш банк не выдаёт ипотечные кредиты меньше 500 000 рублей.';
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
    initialPayBlockForm.style.display = 'flex';
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
  var MIN_COINT_BTN_AVTO = MIN_COINT_AVTO + STEP_AVTO;
  var MAX_COINT_BTN_AVTO = MAX_COINT_AVTO - STEP_AVTO;
  var MIN_SUM_AVTO = 200000;
  var MIN_PERSENT_AVTO = 20;
  var MIN_PERIOD_AVTO = 1;
  var MAX_PERIOD_AVTO = 5;
  var COINT_POINT_AVTO = 2000000;
  var avtoTotalInput = avtoBlock.querySelector('.calculator__input-total');
  var avtoInitialInput = avtoBlock.querySelector('.calculator__input-initial');
  var avtoInitialRange = avtoBlock.querySelector('.calculator__range-initial');
  var avtoPeriodInput = avtoBlock.querySelector('.calculator__input-period');
  var avtoPeriodRange = avtoBlock.querySelector('.calculator__range-period');
  var avtoPayPercent = avtoBlock.querySelector('.calculator__pay-percent');
  var avtoBtnMinus = avtoBlock.querySelector('.calculator__btn-minus');
  var avtoBtnPlus = avtoBlock.querySelector('.calculator__btn-plus');
  var kasko = avtoBlock.querySelector('.calculator__kasko input');
  var insurance = avtoBlock.querySelector('.calculator__insurance input');


  function onAvtoTotalInput() {
    addStyleTotalInput(avtoTotalInput);
  }

  function onAvtoTotalInputChange() {
    var initialRangeValue = avtoInitialRange.value;
    changeTotalInput(avtoTotalInput, initialRangeValue, avtoInitialInput, MIN_COINT_AVTO, MAX_COINT_AVTO);
  }

  avtoTotalInput.addEventListener('input', onAvtoTotalInput);
  avtoTotalInput.addEventListener('change', onAvtoTotalInputChange);


  function onAvtoBtnMinusClick() {
    var valueNumber = parseInt(avtoTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber >= MIN_COINT_BTN_AVTO) {
      valueNumber -= STEP_AVTO;
      avtoTotalInput.value = showCurrency(valueNumber);
      changeInitialInput(valueNumber, avtoInitialRange.value, avtoInitialInput);
      onAvtoCalcChange();
    }
  }

  function onAvtoBtnPlusClick() {
    var valueNumber = parseInt(avtoTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber <= MAX_COINT_BTN_AVTO) {
      valueNumber += STEP_AVTO;

      avtoTotalInput.value = showCurrency(valueNumber);
      changeInitialInput(valueNumber, avtoInitialRange.value, avtoInitialInput);
      onAvtoCalcChange();
    }
  }

  avtoBtnMinus.addEventListener('click', onAvtoBtnMinusClick);
  avtoBtnPlus.addEventListener('click', onAvtoBtnPlusClick);

  // Первоначальный взнос авто

  function onAvtoInitialInput() {
    avtoInitialInput.value = avtoInitialInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
  }

  function onAvtoInitialInputChange() {
    calcInitialInput(avtoInitialInput, avtoTotalInput, avtoInitialRange, MIN_PERSENT_AVTO, avtoPayPercent);
  }

  function onAvtoInitialRangeChange() {
    calcInitialRange(avtoTotalInput, avtoInitialRange, avtoInitialInput, avtoPayPercent);
  }

  avtoInitialInput.addEventListener('input', onAvtoInitialInput);
  avtoInitialInput.addEventListener('change', onAvtoInitialInputChange);
  avtoInitialRange.addEventListener('change', onAvtoInitialRangeChange);

  // Период кредитования авто

  function onAvtoPeriodInput() {
    avtoPeriodInput.value = avtoPeriodInput.value.replace(/[^\d]/g, '');
  }

  function onAvtoPeriodInputChange() {
    changePeriodInput(avtoPeriodInput, avtoPeriodRange, MIN_PERIOD_AVTO, MAX_PERIOD_AVTO);
  }

  function onAvtoPeriodRange() {
    var valueNumber = parseInt(avtoPeriodRange.value.replace(/\D+/g, ''), 10);
    showPeriod(avtoPeriodInput, valueNumber);
  }

  avtoPeriodInput.addEventListener('input', onAvtoPeriodInput);
  avtoPeriodInput.addEventListener('change', onAvtoPeriodInputChange);
  avtoPeriodRange.addEventListener('change', onAvtoPeriodRange);

  // Блок предложение авто

  function onAvtoCalcChange() {
    var valueTotal = parseInt(avtoTotalInput.value.replace(/\D+/g, ''), 10);
    var valueInitial = parseInt(avtoInitialInput.value.replace(/\D+/g, ''), 10);
    var valuePeriod = parseInt(avtoPeriodInput.value.replace(/\D+/g, ''), 10);

    var avtoSum = valueTotal - valueInitial;
    var percentRate;

    if (avtoSum < MIN_SUM_AVTO) {
      offer.style.display = 'none';
      offerWarning.style.display = 'block';
      offerWarningTitle.textContent = 'Наш банк не выдаёт автокредиты кредиты меньше 200 000 рублей.';
    } else {
      offer.style.display = 'block';
      offerWarning.style.display = 'none';
    }

    if (kasko.checked && insurance.checked) {
      percentRate = 3.5 / 1200;
      percentOffer.textContent = '3,5%';
    } else if (kasko.checked || insurance.checked) {
      percentRate = 8.5 / 1200;
      percentOffer.textContent = '8,5%';
    } else {
      if (valueTotal < COINT_POINT_AVTO) {
        percentRate = 16 / 1200;
        percentOffer.textContent = '16%';
      } else {
        percentRate = 15 / 1200;
        percentOffer.textContent = '15%';
      }
    }

    sumOffer.textContent = showCurrency(avtoSum);

    var monthlyPow = valuePeriod * 12;
    var monthlyPay = avtoSum * (percentRate + (percentRate / (Math.pow((1 + percentRate), monthlyPow) - 1)));
    var requiredProfit = monthlyPay * 100 / 45;

    payOffer.textContent = showCurrency(monthlyPay.toFixed());
    requiredOffer.textContent = showCurrency(requiredProfit.toFixed());

    totalSumForm.value = avtoTotalInput.value;
    initialPayForm.value = avtoInitialInput.value;
    periodForm.value = avtoPeriodInput.value;
    initialPayBlockForm.style.display = 'flex';
  }

  avtoBlock.addEventListener('change', onAvtoCalcChange);

  // Потребительский кредит <<<<<<<<<<<<

  var STEP_CONSUMER = 50000;
  var MIN_COINT_CONSUMER = 50000;
  var MAX_COINT_CONSUMER = 3000000;
  var MIN_COINT_BTN_CONSUMER = MIN_COINT_CONSUMER + STEP_CONSUMER;
  var MAX_COINT_BTN_CONSUMER = MAX_COINT_CONSUMER - STEP_CONSUMER;
  var MIN_PERIOD_CONSUMER = 1;
  var MAX_PERIOD_CONSUMER = 7;
  var FIRST_POINT_CONSUMER = 750000;
  var SECOND_POINT_CONSUMER = 2000000;
  var consumerTotalInput = consumerBlock.querySelector('.calculator__input-total');
  var consumerPeriodInput = consumerBlock.querySelector('.calculator__input-period');
  var consumerPeriodRange = consumerBlock.querySelector('.calculator__range-period');
  var consumerBtnMinus = consumerBlock.querySelector('.calculator__btn-minus');
  var consumerBtnPlus = consumerBlock.querySelector('.calculator__btn-plus');
  var participant = consumerBlock.querySelector('.calculator__participant input');
  var initialPayBlockForm = document.querySelector('.credit-form__initial-item');

  function onConsumerTotalInput() {
    addStyleTotalInput(consumerTotalInput);
  }

  function onConsumerTotalInputChange() {
    var valueNumber = parseInt(consumerTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber >= MIN_COINT_CONSUMER && valueNumber <= MAX_COINT_CONSUMER) {
      consumerTotalInput.style.color = '#1f1e25';
      consumerTotalInput.style.borderColor = '#1f1e25';
      consumerTotalInput.value = showCurrency(valueNumber);

    } else {
      consumerTotalInput.value = 'Некорректное значение';
      consumerTotalInput.style.color = 'red';
      consumerTotalInput.style.borderColor = 'red';
    }
  }

  consumerTotalInput.addEventListener('input', onConsumerTotalInput);
  consumerTotalInput.addEventListener('change', onConsumerTotalInputChange);

  function onConsumerBtnMinusClick() {
    var valueNumber = parseInt(consumerTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber >= MIN_COINT_BTN_CONSUMER) {
      valueNumber -= STEP_CONSUMER;
      consumerTotalInput.value = showCurrency(valueNumber);
      onConsumerCalcChange();
    }
  }

  function onConsumerBtnPlusClick() {
    var valueNumber = parseInt(consumerTotalInput.value.replace(/\D+/g, ''), 10);

    if (valueNumber <= MAX_COINT_BTN_CONSUMER) {
      valueNumber += STEP_CONSUMER;

      consumerTotalInput.value = showCurrency(valueNumber);
      onConsumerCalcChange();
    }
  }

  consumerBtnMinus.addEventListener('click', onConsumerBtnMinusClick);
  consumerBtnPlus.addEventListener('click', onConsumerBtnPlusClick);

  // Период кредитования потребителя

  function onConsumerPeriodInput() {
    consumerPeriodInput.value = consumerPeriodInput.value.replace(/[^\d]/g, '');
  }

  function onConsumerPeriodInputChange() {
    changePeriodInput(consumerPeriodInput, consumerPeriodRange, MIN_PERIOD_CONSUMER, MAX_PERIOD_CONSUMER);
  }

  function onConsumerPeriodRange() {
    var valueNumber = parseInt(consumerPeriodRange.value.replace(/\D+/g, ''), 10);
    showPeriod(consumerPeriodInput, valueNumber);
  }

  consumerPeriodInput.addEventListener('input', onConsumerPeriodInput);
  consumerPeriodInput.addEventListener('change', onConsumerPeriodInputChange);
  consumerPeriodRange.addEventListener('change', onConsumerPeriodRange);

  // Блок предложение потребитель

  function onConsumerCalcChange() {
    var consumerSum = parseInt(consumerTotalInput.value.replace(/\D+/g, ''), 10);
    var valuePeriod = parseInt(consumerPeriodInput.value.replace(/\D+/g, ''), 10);

    var percentRate;

    if (consumerSum < FIRST_POINT_CONSUMER) {
      percentRate = 15;
      percentOffer.textContent = '15%';
    } else if (consumerSum >= FIRST_POINT_CONSUMER && consumerSum < SECOND_POINT_CONSUMER) {
      percentRate = 12.5;
      percentOffer.textContent = '12,5%';
    } else {
      percentRate = 9.5;
      percentOffer.textContent = '9,5%';
    }

    if (participant.checked) {
      percentRate -= 0.5;
      var percentRateString = percentRate + '%';
      percentOffer.textContent = percentRateString.replace('.', ',');
    }

    percentRate = percentRate / 1200;

    sumOffer.textContent = showCurrency(consumerSum);

    var monthlyPow = valuePeriod * 12;
    var monthlyPay = consumerSum * (percentRate + (percentRate / (Math.pow((1 + percentRate), monthlyPow) - 1)));
    var requiredProfit = monthlyPay * 100 / 45;

    payOffer.textContent = showCurrency(monthlyPay.toFixed());
    requiredOffer.textContent = showCurrency(requiredProfit.toFixed());

    totalSumForm.value = consumerTotalInput.value;
    periodForm.value = consumerPeriodInput.value;
    initialPayBlockForm.style.display = 'none';
  }

  consumerBlock.addEventListener('change', onConsumerCalcChange);

  // Карта

  var russiaInput = document.querySelector('#russia');
  var sngInput = document.querySelector('#sng');
  var europeInput = document.querySelector('#europe');
  var mapFilter = document.querySelector('.departments__filter-form');

  ymaps.ready(init);

  function init() {

    var myMap = new ymaps.Map("map", {
      center: [55.45, 37.36],
      zoom: 3,
      controls: []
    });


    var ZoomLayout = ymaps.templateLayoutFactory.createClass('<div>' +
      '<button type="button" id="zoom-in" class="departments__btn-zoom departments__btn-zoom-in">+</button>' +
      '<button type="button" id="zoom-out" class="departments__btn-zoom departments__btn-zoom-out">-</buton>' +
      '</div>', {

      build: function () {
        ZoomLayout.superclass.build.call(this);
        this.zoomInCallback = ymaps.util.bind(this.zoomIn, this);
        this.zoomOutCallback = ymaps.util.bind(this.zoomOut, this);

        document.querySelector('#zoom-in').addEventListener('click', this.zoomInCallback);
        document.querySelector('#zoom-out').addEventListener('click', this.zoomOutCallback);
      },

      clear: function () {
        document.querySelector('#zoom-in').removeEventListener('click', this.zoomInCallback);
        document.querySelector('#zoom-out').removeEventListener('click', this.zoomOutCallback);

        ZoomLayout.superclass.clear.call(this);
      },

      zoomIn: function () {
        var map = this.getData().control.getMap();
        map.setZoom(map.getZoom() + 1, {checkZoomRange: true});
      },

      zoomOut: function () {
        var map = this.getData().control.getMap();
        map.setZoom(map.getZoom() - 1, {checkZoomRange: true});
      }
    });

    var zoomControl = new ymaps.control.ZoomControl({options: {layout: ZoomLayout}});

    myMap.controls.add(zoomControl, {
      position: {
        top: 170,
        right: 10
      }
    });

    var GeoLayout = ymaps.templateLayoutFactory.createClass('<button type="button" id="geo-location" class="departments__geo-location" aria-label="Показать мое местоположение"></button>', {
    });

    var geoLocationControl = new ymaps.control.GeolocationControl({options: {layout: GeoLayout}});

    myMap.controls.add(geoLocationControl, {
      position: {
        top: 250,
        right: 10
      }
    });

    // Маркеры на карте

    var coordsRussia = [
      [55.75, 37.61],
      [59.93, 30.31],
      [51.54, 46.00],
      [67.61, 33.66],
      [57.15, 65.53],
      [54.99, 73.36]
    ];

    var coordsSNG = [
      [40.36, 49.83],
      [41.31, 69.27],
      [53.90, 27.56],
      [43.23, 76.94]
    ];

    var coordsEurope = [
      [48.85, 2.35],
      [50.08, 14.42],
      [51.50, -0.12],
      [41.90, 12.49]
    ];

    function madeCollection(coords) {
      var collection = new ymaps.GeoObjectCollection({}, {
        iconLayout: 'default#image',
        iconImageHref: 'img/marker.png',
      });

      for (var i = 0; i < coords.length; i++) {
        collection.add(new ymaps.Placemark(coords[i]));
      }

      return collection;
    }

    var russiaCollection = madeCollection(coordsRussia);
    var sngCollection = madeCollection(coordsSNG);
    var europeCollection = madeCollection(coordsEurope);

    function onFilterChange() {
      if (russiaInput.checked) {
        myMap.geoObjects.add(russiaCollection);
      } else {
        myMap.geoObjects.remove(russiaCollection);
      }
      if (sngInput.checked) {
        myMap.geoObjects.add(sngCollection);
      } else {
        myMap.geoObjects.remove(sngCollection);
      }
      if (europeInput.checked) {
        myMap.geoObjects.add(europeCollection);
      } else {
        myMap.geoObjects.remove(europeCollection);
      }
    }

    onFilterChange();
    mapFilter.addEventListener('change', onFilterChange);
  }

});
