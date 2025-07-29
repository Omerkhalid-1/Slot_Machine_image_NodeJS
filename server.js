const express = require('express');
const path = require('path');
const { spin, checkWin } = require('./GameLogic.js'); 

const app = express();
app.use(express.static('public'));
app.use(express.json());

app.post('/api/spin', (req, res) => {
  const { balance, bet, lines } = req.body;
  const rows = spin();
  const winnings = checkWin(rows, lines, bet);
  const newBalance = balance - (bet * lines) + winnings;

  res.json({ rows, winnings, newBalance });
});

app.get('*', (req, res) => {
  res.status(404).sendFile(path.join(__dirname, 'public', '404.html'));
});

app.listen(3000, () => {
  console.log('Server running on http://localhost:3500');
});
