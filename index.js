const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

// Array to store the expenses
let expenses = [];

// Default app value
app.get('/', (req, res) => {
    res.status(200).json()
})

// POST method for creating an expense
app.post('/expenses', (req, res) => {
  const { name, amount, date } = req.body;

  // Check if required fields are missing
  if (!name) {
    return res.status(400).json({ error: "Required field 'name' is missing" });
  }
  if (!amount) {
    return res.status(400).json({ error: "Required field 'amount' is missing" });
  }
  if (!date) {
    return res.status(400).json({ error: "Required field 'date' is missing" });
  }
  
  // Check if amount is a valid number
  if (typeof amount !== 'number') {
    return res.status(400).json({ error: "Field 'amount' should be a number" });
  }
  
  // Check if date is a valid date
  if (isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "Field 'date' should be a valid date" });
  }


  const expense = {
    name,
    amount,
    date: new Date(date).toISOString() // Transforming date to string format
  };

  expenses.push(expense);
  res.status(201).json(expense);
});

// GET method for getting all expenses
app.get('/expenses', (req, res) => {
  res.json(expenses);
});

// POST method for searching expenses on a specific date
app.post('/expenses/search', (req, res) => {
  const { date } = req.body;

  // Check if required field is missing
  if (!date) {
    return res.status(400).json({ error: "Required field 'date' is missing" });
  }
  
  // Check if date is a valid date
  if (isNaN(Date.parse(date))) {
    return res.status(400).json({ error: "Field 'date' should be a valid date" });
  }

  const searchDate = new Date(date).toISOString();
  const filteredExpenses = expenses.filter(expense => expense.date === searchDate);
  
  res.json(filteredExpenses);
});

// POST method for setting a limit on the amount spent in a day
let expenseLimit = 0;

app.post('/limit', (req, res) => {
  const { limit } = req.body;

  // Check if required field is missing
  if (limit === undefined) {
    return res.status(400).json({ error: "Required field 'limit' is missing" });
  }
  
  // Check if limit is a valid number
  if (typeof limit !== 'number') {
    return res.status(400).json({ error: "Field 'limit' should be a number" });
  }
  
  // Check if limit is a positive number
  if (limit <= 0) {
    return res.status(400).json({ error: "Field 'limit' should be a positive number" });
  }

  expenseLimit = limit;
  res.sendStatus(200);
});

// GET method to get the expense limit
app.get('/limit', (req, res) => {
  res.json({ limit: expenseLimit });
});

app.use(bodyParser.json());

app.use((req, res, next) => {
    console.log(`Got request ${req.method} ${req.path}`);
    next();
})

// Start the server
app.listen(3000, () => {
  console.log('Expense Tracker API is running on port 3000');
});