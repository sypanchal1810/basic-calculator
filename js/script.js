'use strict';

// Variable to store user input and calculation
let expression = '';
const deleteButton = document.querySelector('.delete');

// Select the display of calculator
const display = document.getElementById('display');

// Function to update the display with the current expression
function updateDisplay() {
  display.value = expression;
}

// Function to append number or operator to the expression
function appendToExpression(val) {
  expression += val;
  updateDisplay();
  deleteButton.disabled = false;
}

// Function to clear the display and reset the expression
function clearDisplay() {
  expression = '';
  updateDisplay();
  deleteButton.disabled = false;
}

// Function to clear the last digit from the expression
function clearDigit() {
  expression = expression.slice(0, -1);
  updateDisplay();
}

// Function to calculate the result and update the display
function calculateResult() {
  try {
    const result = evaluateExpression(expression);
    expression = result.toString();
    updateDisplay();
    deleteButton.disabled = true;
  } catch (error) {
    // Handle any errors in the expression
    expression = 'Invalid';
    updateDisplay();
    deleteButton.disabled = true;
  }
}

// Function evaluate expression which follows the precedence order of Divide, Multiply, Add and Subtract
function evaluateExpression(expression) {
  const operators = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
  };

  const precedence = {
    '+': 1,
    '-': 1,
    '*': 2,
    '/': 2,
  };

  const tokens = expression.split(/([-+*/])/);
  let values = [];
  let operatorsStack = [];

  for (let i = 0; i < tokens.length; i++) {
    const token = tokens[i].trim();

    if (token in operators) {
      while (operatorsStack.length > 0 && precedence[operatorsStack[operatorsStack.length - 1]] >= precedence[token]) {
        const operator = operatorsStack.pop();
        const b = values.pop();
        const a = values.pop();
        const result = operators[operator](a, b);
        values.push(result);
      }

      operatorsStack.push(token);
    } else {
      const value = parseFloat(token);
      if (isNaN(value)) {
        throw new Error('Invalid expression');
      }
      values.push(value);
    }
  }

  while (operatorsStack.length > 0) {
    const operator = operatorsStack.pop();
    const b = values.pop();
    const a = values.pop();
    const result = operators[operator](a, b);
    values.push(result);
  }

  if (values.length !== 1 || operatorsStack.length !== 0) {
    throw new Error('Invalid');
  }

  return values[0];
}
