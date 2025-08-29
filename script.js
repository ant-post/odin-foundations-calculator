let numberOne, numberTwo, operationSign, lastResult;

function add(a, b) {
    return a + b;
}

function subtract(a, b) {
    return a - b;
}

function multiply(a, b) {
    return a * b;
}

function divide(a, b) {
    if (b === 0) {
        throw new Error('Division by zero');
    }
    return a / b;
}

function power(a, b) {
    if (b < 0) {
        throw new Error('Invalid degree value');
    }
    if (!Number.isInteger(b)) {
        throw new Error('Exponent must be an integer');
    }
    
    if (b === 0) {
        return 1;
    }
    else {
        let result = a;
        for (let i = 2; i <= b; i++) {
            result *= a;
        }
        return result;
    }
}

function modulo(a, b) {
    return a % b;
}

function operate(a, b, operationSign) {
    a = parseFloat(a);
    b = parseFloat(b);
    
    switch (operationSign) {
        case '+':
            return add(a, b);
        case '-':
            return subtract(a, b);
        case '*':
            return multiply(a, b);
        case '/':
            return divide(a, b);
        case '^':
            return power(a, b);
        case '%':
            return modulo(a, b);
        default:
            throw new Error('Invalid operation sign');
    }
}

const screenCurrent = document.getElementById('calculator-screen-current');
function pushScreenCurrentContent(str) {
    screenCurrent.textContent = screenCurrent.textContent + str;
}

function replaceScreenCurrentContent(str) {
    screenCurrent.textContent = str;
}

function deleteLastSymbolScreenCurrent() {
    screenCurrent.textContent = screenCurrent.textContent.slice(0, -1);
}

function formatNumber(str) {
    const num = parseFloat(str);
    // return num % 1 === 0 ? str : num.toFixed(2);
    return num % 1 === 0 ? str : (Math.round(num * 100) / 100).toString()
}

const screenHistory = document.getElementById('calculator-screen-history');
function displayScreenHistoryContent(numberOne, numberTwo, operationSymbol, isResult) {
    if (numberOne != null) {
        if (operationSymbol != null) {
            if (numberTwo != null) {
                if (isResult) {
                     screenHistory.textContent = `${formatNumber(numberOne)} ${operationSign} ${formatNumber(numberTwo)} = ${formatNumber(lastResult)}`;
                }
                else {
                    screenHistory.textContent = `${formatNumber(numberOne)} ${operationSign} ${formatNumber(numberTwo)}`;
                }
            }
            else {
                screenHistory.textContent = `${formatNumber(numberOne)} ${operationSign}`;
            }
        } 
        else {
            screenHistory.textContent = formatNumber(numberOne);
        }
    }
    else {
        screenHistory.textContent = '';
    }
}

const dotButton = document.querySelector(`[data-number="."]`);
function processNumberInput(numberSymbol) {
    if (numberSymbol === '.') {
        dotButton.disabled = true;
    }

    if (numberOne != null) {
        if (operationSign != null) {
            if (numberTwo != null) {
                numberTwo = numberTwo + numberSymbol;    
            }
            else {
                if (numberSymbol === '.') {
                    numberTwo = '0.0';
                }
                else {
                    numberTwo = numberSymbol;
                }
            }
            replaceScreenCurrentContent(numberTwo);
        }
        else {
            numberOne = numberOne + numberSymbol;
            replaceScreenCurrentContent(numberOne);
        }
    }
    else {
        if (numberSymbol === '.') {
            numberOne = '0.0';
        }
        else {
            numberOne = numberSymbol;
        }
        replaceScreenCurrentContent(numberOne);
    } 
    displayScreenHistoryContent(numberOne, numberTwo, operationSign, false);
}

function processOperationInput(operationSymbol) {
    dotButton.disabled = false;
    if (operationSign == null) {
        if (numberOne == null) {
            if (lastResult != null) {
                numberOne = lastResult;
                operationSign = operationSymbol;
            }
        }
        else {
            operationSign = operationSymbol;
        }
    }
    else if (numberOne != null && numberTwo != null) {
        processResultInput();
        processOperationInput(operationSymbol);
    }
    else {
        operationSign = operationSymbol;
    }
    displayScreenHistoryContent(numberOne, numberTwo, operationSign, false);
}

function processResultInput() {
    if (numberOne != null && numberTwo != null && operationSign != null) {
        dotButton.disabled = false;
        try {
            lastResult = operate(numberOne, numberTwo, operationSign).toString();
            displayScreenHistoryContent(numberOne, numberTwo, operationSign, true);
            replaceScreenCurrentContent(lastResult);
        } catch (error) {
            replaceScreenCurrentContent('Error: ' + error.message);
            displayScreenHistoryContent(null, null, null, false);
        } finally {
            numberOne = null;
            numberTwo = null;
            operationSign = null;
        }
    }
}

function processDeleteInput() {
    if (numberTwo != null) {
        const sliced = numberTwo.toString().slice(0, -1);
        numberTwo = sliced !== '' ? sliced : null;
        deleteLastSymbolScreenCurrent();
    }
    else if (numberOne != null) { 
        const inheritedUnmodifiedResult = lastResult != null
            && numberOne === lastResult;
             
        if (inheritedUnmodifiedResult) {
            return;
        }
        
        const sliced = numberOne.toString().slice(0, -1);
        numberOne = sliced !== '' ? sliced : null;
        deleteLastSymbolScreenCurrent();
    }
    displayScreenHistoryContent(numberOne, numberTwo, operationSign, false);
}

function processClearInput() {
    numberOne = null;
    numberTwo = null;
    operationSign = null;
    lastResult = null;
    dotButton.disabled = false;
    replaceScreenCurrentContent('');
    displayScreenHistoryContent(null, null, null, false);
}


const calculatorButtons = document.querySelectorAll('.calculator-button');
calculatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('calculator-button-clicked'); 
        
        const buttonClickSoundOne = document.getElementById('button-click-sound-one');
        buttonClickSoundOne.currentTime = 0;
        buttonClickSoundOne.play();
        
        setTimeout(() => {
            button.classList.remove('calculator-button-clicked');    
        }, 100);
    });
    
    if (button.dataset.number) {
        button.addEventListener('click', () => processNumberInput(button.dataset.number));
    }
    else if (button.dataset.operation) {
        button.addEventListener('click', () => processOperationInput(button.dataset.operation))
    }
    else if (button.dataset.action === 'result') {
        button.addEventListener('click', () => processResultInput());
    }
    else if (button.dataset.action === 'clear') {
        button.addEventListener('click', () => processClearInput());
    }
    else if (button.dataset.action === 'delete') {
        button.addEventListener('click', () => processDeleteInput());
    }
});

document.addEventListener('keydown', (event) => {
    const key = event.key;

    if (/^[0-9.,]/.test(key)) {
        const normalizedKey = key === ',' ? '.' : key;
        const button = document.querySelector(`[data-number="${normalizedKey}"]`);
        button?.click();
    } 
    else if (['+', '-', '*', '/', '^', '%'].includes(key)) {  
        const button = document.querySelector(`[data-operation="${key}"]`);
        button?.click();
    }
    else if (key === 'Enter' || key === '=') {
        document.querySelector('[data-action="result"]')?.click();
    } 
    else if (key === 'Backspace' || key === 'Delete') {
        document.querySelector('[data-action="delete"]')?.click();
    }
    else if (key === 'Escape') {
        document.querySelector('[data-action="clear"]')?.click();
    }
});