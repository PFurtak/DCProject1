let currentScore = 0;
let answer = '';
let xhr = new XMLHttpRequest();

// test
const quote = document.querySelector('.quoteGenP');
const score = document.querySelector('.scoreboardField');
const losingQuote = document.querySelector('.wrongFact');
const authorQuotes = document.querySelector('.authorQuotes');
const authors = document.querySelectorAll('#author');

//materialize init
M.AutoInit();

authors.forEach(auth => {
  auth.addEventListener('click', e => {
    e.preventDefault();
    cleanUp();
    emptyQuoteBox();
    if (auth.innerText.toLowerCase() === answer.toLowerCase()) {
      console.log('You are correct!');
      currentScore += 1;
      score.innerHTML = currentScore;
      reset();
    } else {
      wrongAnswer();
    }
  });
});

// button functions

async function getQuoteAuthor() {
  const quoteAPI = `https://quote-garden.herokuapp.com/quotes/random`;
  let quotes = await fetch(quoteAPI);
  let data = await quotes.json();

  console.log('results is', data.quoteAuthor);
  if (data.quoteAuthor.length === 0) {
    getQuoteAuthor();
  } else {
    quote.innerHTML = data.quoteText;
    answer = data.quoteAuthor;
  }
}

async function generateAuthorButtons() {
  const authorsList = await Promise.all([
    getRandomAuthor(),
    getRandomAuthor(),
    getRandomAuthor()
  ]);
  authorsList.push(answer);

  let finalAuthorList = await randomizeAuthors(authorsList);

  for (let i = 0; i < finalAuthorList.length; i++) {
    const authorNode = authors[i];
    const authorText = finalAuthorList[i];
    authorNode.innerHTML = authorText;
  }
}

async function randomizeAuthors(authorArray) {
  newAuthorArray = [];
  console.log('the author array is ', authorArray);
  for (let i = 0; i < 4; i++) {
    num = Math.floor(Math.random() * authorArray.length);
    newAuthorArray.push(authorArray[num]);
    authorArray.splice(num, 1);
  }
  console.log('The new array is', newAuthorArray);
  return newAuthorArray;
}

function getRelatedToAuthor() {
  let url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=5&gsrsearch='${answer}'`;
  xhr.open('GET', url, true);

  xhr.onload = function() {
    let data = JSON.parse(this.response);

    for (let i in data.query.pages) {
      let link = data.query.pages[i].title;
      let relatedButton = document.createElement('button');
      relatedButton.innerHTML = `Another result from people who have searched ${answer} is: ${link}`;
      authorQuotes.append(relatedButton);

      relatedButton.onclick = e => {
        e.preventDefault();
        location.href = `https://en.wikipedia.org/wiki/${link}`;
      };
    }
  };
}

async function getRandomAuthor() {
  const quoteAPI = `https://quote-garden.herokuapp.com/quotes/random`;
  let fetcher = await fetch(quoteAPI);
  let data = await fetcher.json();
  let author = data.quoteAuthor;
  if (author.length === 0 || author === undefined) {
    getRandomAuthor();
  } else {
    return author;
  }
}

async function getNumbersQuote() {
  const numberAPI = `http://numbersapi.com/${currentScore}?json`;
  await get(numberAPI).then(response => {
    text = response.text;
  });
  return text;
}

async function serveQuotes() {
  const authorQuotesApi = `https://quote-garden.herokuapp.com/quotes/author/${answer}`;
  await get(authorQuotesApi).then(response => {
    quotes = response.results;

    if (quotes.length < 10) {
      for (let i = 0; i <= quotes.length; i++) {
        if (i >= 1) {
          if (quotes[i].quoteText === quotes[i - 1].quoteText) {
          } else {
            authorQuotes.append(quotes[i].quoteText);
            let newParagraph = document.createElement('p');
            authorQuotes.append(newParagraph);
          }
        } else {
          authorQuotes.append(quotes[i].quoteText);
          let newParagraph = document.createElement('p');
          authorQuotes.append(newParagraph);
        }
      }
    } else {
      for (let i = 0; i <= 10; i++) {
        if (i >= 1) {
          if (quotes[i].quoteText === quotes[i - 1].quoteText) {
          } else {
            authorQuotes.append(quotes[i].quoteText);
            let newParagraph = document.createElement('p');
            authorQuotes.append(newParagraph);
          }
        } else {
          authorQuotes.append(quotes[i].quoteText);
          let newParagraph = document.createElement('p');
          authorQuotes.append(newParagraph);
        }
      }
    }
  });
}

async function askForQuotes() {
  authorQuotes.innerHTML = `Would you like to see more quotes from ${answer}?`;
  const question = document.createElement('button');
  question.innerHTML = 'Yes';
  authorQuotes.append(question);

  question.addEventListener('click', e => {
    e.preventDefault();
    serveQuotes();
    cleanUp();
  });
}

async function wrongAnswer() {
  losingQuote.innerHTML = await getNumbersQuote();
  currentScore = 0;
  score.innerHTML = currentScore;
  reset();
  await getRelatedToAuthor();
  await askForQuotes();
  await xhr.send();
}

function cleanUp() {
  authorQuotes.innerHTML = '';
}

function emptyQuoteBox() {
  losingQuote.innerHTML = '';
}

async function startUP() {
  quote.innerHTML = 'Your new quote is loading! Give us a second to fetch it!';
  await getQuoteAuthor();
  await generateAuthorButtons();
  console.log('answer', answer);
}

function reset() {
  authors.forEach(auth => {
    auth.innerHTML = 'Loading...';
  });
  startUP();
}

startUP();
