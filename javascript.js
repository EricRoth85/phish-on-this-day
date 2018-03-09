let quotes = [
  'quote 1',
  'quote 2',
  'quote 3',
  'quote 4',
  'quote 5',
  'quote 6',
  'quote 7',
  'quote 8',
  'quote 9',
  'quote 10',
]

function newQuote() {
let randomNumber = Math.floor(Math.random() * quotes.length);
document.getElementById('quoteDisplay').innerHTML = quotes[randomNumber]
}
