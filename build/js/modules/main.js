'use strict';

document.addEventListener('DOMContentLoaded', function () {

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
  var mortgagePeriodInput = mortgageBlock.querySelector('.calculator__input-period');

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
  var periodForm = document.querySelector('#period-form');


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

  function calcCredit(block, totalInput, initialInput, initialRange, periodInput) {
    var payPercent = block.querySelector('.calculator__pay-percent');
    var periodRange = block.querySelector('.calculator__range-period');
    var btnMinus = block.querySelector('.calculator__btn-minus');
    var btnPlus = block.querySelector('.calculator__btn-plus');


    function changeInitialInput(totalValue, persent) {
      var initialValueNumber = Math.round((totalValue * persent) / 100);
      initialInput.value = showCurrency(initialValueNumber);
    }

    function onTotalInput() {
      totalInput.value = totalInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
      totalInput.style.color = '#1f1e25';
      totalInput.style.borderColor = '#1f1e25';
    }

    function onTotalInputChange() {
      var valueNumber = parseInt(totalInput.value.replace(/\D+/g, ''), 10);

      if (valueNumber >= MIN_COINT_MORTGAGE && valueNumber <= MAX_COINT_MORTGAGE) {

        changeInitialInput(valueNumber, initialRange.value);

        totalInput.style.color = '#1f1e25';
        totalInput.style.borderColor = '#1f1e25';

        totalInput.value = showCurrency(valueNumber);

      } else {
        totalInput.value = 'Некорректное значение';
        totalInput.style.color = 'red';
        totalInput.style.borderColor = 'red';
      }
    }

    totalInput.addEventListener('input', onTotalInput);
    totalInput.addEventListener('change', onTotalInputChange);


    function onBtnMinusClick() {
      var valueNumber = parseInt(totalInput.value.replace(/\D+/g, ''), 10);

      if (valueNumber >= MIN_COINT_BTN_MORTGAGE) {
        valueNumber -= STEP_MORTGAGE;
        totalInput.value = showCurrency(valueNumber);
        changeInitialInput(valueNumber, initialRange.value);
        onMortgageCalcChange();
      }
    }

    function onBtnPlusClick() {
      var valueNumber = parseInt(totalInput.value.replace(/\D+/g, ''), 10);

      if (valueNumber <= MAX_COINT_BTN_MORTGAGE) {
        valueNumber += STEP_MORTGAGE;

        totalInput.value = showCurrency(valueNumber);
        changeInitialInput(valueNumber, initialRange.value);
        onMortgageCalcChange();
      }
    }

    btnMinus.addEventListener('click', onBtnMinusClick);
    btnPlus.addEventListener('click', onBtnPlusClick);


    // Первоначальный взнос

    function onInitialRangeChange() {
      var valueNumberTotal = parseInt(totalInput.value.replace(/\D+/g, ''), 10);
      changeInitialInput(valueNumberTotal, initialRange.value);
      payPercent.textContent = initialRange.value + '%';
    }

    function onInitialInput() {
      initialInput.value = initialInput.value.replace(/[^\d]/g, '').replace(/(\d)(?=(\d\d\d)+([^\d]|$))/g, '$1 ');
    }

    function onInitialInputChange() {
      var valueNumber = parseInt(initialInput.value.replace(/\D+/g, ''), 10);
      var valueNumberTotal = parseInt(totalInput.value.replace(/\D+/g, ''), 10);

      var percent = (valueNumber * 100) / valueNumberTotal;

      if (percent < MIN_PERSENT_MORTGAGE || !valueNumber) {
        changeInitialInput(valueNumberTotal, MIN_PERSENT_MORTGAGE);
        initialRange.value = MIN_PERSENT_MORTGAGE;
      } else if (percent > 100) {
        changeInitialInput(valueNumberTotal, MAX_PERSENT_MORTGAGE);
        initialRange.value = MAX_PERSENT_MORTGAGE;
      } else {
        changeInitialInput(valueNumberTotal, percent);
        initialRange.value = percent;
      }

      payPercent.textContent = initialRange.value + '%';
    }

    initialInput.addEventListener('input', onInitialInput);
    initialInput.addEventListener('change', onInitialInputChange);
    initialRange.addEventListener('change', onInitialRangeChange);

    // Период ипотеки

    function onPeriodInput() {
      periodInput.value = periodInput.value.replace(/[^\d]/g, '');
    }

    function onPeriodInputChange() {
      var valueNumber = parseInt(periodInput.value.replace(/\D+/g, ''), 10);
      if (valueNumber < MIN_PERIOD_MORTGAGE || !valueNumber) {
        periodInput.value = MIN_PERIOD_MORTGAGE + ' лет';
        periodRange.value = MIN_PERIOD_MORTGAGE;
      } else if (valueNumber > MAX_PERIOD_MORTGAGE) {
        periodInput.value = MAX_PERIOD_MORTGAGE + ' лет';
        periodRange.value = MAX_PERIOD_MORTGAGE;
      } else {
        showPeriod(periodInput, valueNumber);
        periodRange.value = valueNumber;
      }
    }

    function onPeriodRange() {
      var valueNumber = parseInt(periodRange.value.replace(/\D+/g, ''), 10);
      showPeriod(periodInput, valueNumber);
    }

    periodInput.addEventListener('input', onPeriodInput);
    periodInput.addEventListener('change', onPeriodInputChange);
    periodRange.addEventListener('change', onPeriodRange);

  }

  calcCredit(mortgageBlock, mortgageTotalInput, mortgageInitialInput, mortgageInitialRange, mortgagePeriodInput);


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
    periodForm.value = mortgagePeriodInput.value;
  }

  mortgageBlock.addEventListener('change', onMortgageCalcChange);

  btnOpenForm.addEventListener('click', function () {
    creditForm.style.display = 'block';
  });

  // Форма отправки

  var phoneForm = document.querySelector('.credit-form__phone-input');

  if (phoneForm) {
    IMask(phoneForm, {mask: '+{7}(000)000-00-00'});
  }

  if (creditForm) {
    creditForm.addEventListener('submit', function (evt) {
      evt.preventDefault();
      creditForm.reset();
    });
  }
});
