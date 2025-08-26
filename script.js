let numberOne, numberTwo, operationSign;

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
    return a / b;
}

function power(a, b) {
    if (b < 0) {
        throw new Error('Invalid degree value');
    }
    else if (b === 0) {
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


try {
    operate(0, 0, '9');
} catch (error) {
    console.log(error.message);
}

const calculatorButtons = document.querySelectorAll('.calculator-button');
calculatorButtons.forEach(button => {
    button.addEventListener('click', () => {
        button.classList.add('calculator-button-clicked'); 
        
        setTimeout(() => {
            button.classList.remove('calculator-button-clicked');    
        }, 100);
    });
});
