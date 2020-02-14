let currentScore = 0;
let answer = "";
var xhr = new XMLHttpRequest();

// test
const spinner = document.querySelector(".loader");
const quote = document.querySelector(".quoteGenP");
const answer1 = document.querySelector("#author1");
const answer2 = document.querySelector("#author2");
const answer3 = document.querySelector("#author3");
const answer4 = document.querySelector("#author4");
const score = document.querySelector(".scoreboardField");
const losingQuote = document.querySelector(".wrongFact");
const authorQuotes = document.querySelector(".authorQuotes");

//materialize init
M.AutoInit();

//carousel
document.addEventListener("DOMContentLoaded", function() {
  var elems = document.querySelectorAll(".carousel");
  var instances = M.Carousel.init(elems, options);
});

// button functions
answer1.addEventListener("click", e => {
  e.preventDefault();
  cleanUp();
  if (answer1.innerText.toLowerCase() === answer.toLowerCase()) {
    console.log("You are correct!");
    currentScore += 1;
    score.innerHTML = currentScore;
    reset();
  } else {
    getWrongAnswer();
  }
});

answer2.addEventListener("click", e => {
  e.preventDefault();
  cleanUp();
  if (answer2.innerText.toLowerCase() === answer.toLowerCase()) {
    console.log("You are correct!");
    currentScore += 1;
    score.innerHTML = currentScore;
    reset();
  } else {
    getWrongAnswer();
  }
});

answer3.addEventListener("click", e => {
  e.preventDefault();
  cleanUp();
  if (answer3.innerText.toLowerCase() === answer.toLowerCase()) {
    console.log("You are correct!");
    currentScore += 1;
    score.innerHTML = currentScore;
    reset();
  } else {
    getWrongAnswer();
  }
});

answer4.addEventListener("click", e => {
  e.preventDefault();
  cleanUp();
  if (answer4.innerText.toLowerCase() === answer.toLowerCase()) {
    console.log("You are correct!");
    currentScore += 1;
    score.innerHTML = currentScore;
    reset();
  } else {
    getWrongAnswer();
  }
});

// functions
async function getQuoteAuthor() {
  const quoteAPI = `https://quote-garden.herokuapp.com/quotes/random`;
  await get(quoteAPI).then(response => {
    console.log("testing for blank ", response.quoteAuthor);
    if (response.quoteAuthor.length === 0) {
      getQuoteAuthor();
    } else {
      quote.innerHTML = response.quoteText;
      answer = response.quoteAuthor;
    }
  });
  console.log("assigning the func", answer);
}

async function generateAuthorButtons() {
  const quoteAPI = `https://quote-garden.herokuapp.com/quotes/random`;
  let randomAuthors = [];

  while (randomAuthors.length < 3) {
    check = await get(quoteAPI).then(response => {
      return response.quoteAuthor;
    });
    if (check != false) {
      console.log(check);
      console.log(check.length);
      randomAuthors.push(check);
    }
  }
  await randomAuthors.push(answer);
  console.log(randomAuthors);
  //
  answer1.innerHTML = getRandomAuthor(randomAuthors);
  answer2.innerHTML = getRandomAuthor(randomAuthors);
  answer3.innerHTML = getRandomAuthor(randomAuthors);
  answer4.innerHTML = getRandomAuthor(randomAuthors);
}

function getRandomAuthor(randomAuthors) {
  num = Math.floor(Math.random() * randomAuthors.length);
  author = randomAuthors[num];
  randomAuthors.splice(num, 1);
  return author;
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
  get(authorQuotesApi).then(response => {
    console.log(response);
    quotes = response.results;

    if (quotes.length < 10) {
      for (let i = 0; i <= quotes.length; i++) {
        if (i >= 1) {
          if (quotes[i].quoteText === quotes[i - 1].quoteText) {
            console.log("This has repeated in less than 10.");
          } else {
            authorQuotes.append(quotes[i].quoteText);
            let newParagraph = document.createElement("p");
            authorQuotes.append(newParagraph);
          }
        } else {
          authorQuotes.append(quotes[i].quoteText);
          let newParagraph = document.createElement("p");
          authorQuotes.append(newParagraph);
        }
      }
    } else {
      for (let i = 0; i <= 10; i++) {
        if (i >= 1) {
          if (quotes[i].quoteText === quotes[i - 1].quoteText) {
            console.log("This has repeated in arrays greater than 10.");
          } else {
            authorQuotes.append(quotes[i].quoteText);
            let newParagraph = document.createElement("p");
            authorQuotes.append(newParagraph);
          }
        } else {
          authorQuotes.append(quotes[i].quoteText);
          let newParagraph = document.createElement("p");
          authorQuotes.append(newParagraph);
        }
      }
    }

    //this needs to append onto the class authorQuotes, which appears at the bottom of the page.
  });
}

function askForQuotes() {
  authorQuotes.innerHTML = `Woud you like to see more quotes from ${answer}?`;
  const spacing = document.createElement("p");
  const question = document.createElement("button");
  question.innerHTML = "Yes";
  authorQuotes.append(spacing);
  authorQuotes.append(question);
  presentAuthorLink();

  question.addEventListener("click", e => {
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
  askForQuotes();
  getRelatedToAuthor();
  await xhr.send();
}

function cleanUp() {
  authorQuotes.innerHTML = "";
}

function getWrongAnswer() {
  wrongAnswer();
}

async function startUP() {
  answer1.innerHTML = "Loading...";
  answer2.innerHTML = "Loading...";
  answer3.innerHTML = "Loading...";
  answer4.innerHTML = "Loading...";
  quote.innerHTML = "Your new quote is loading! Give us a second to fetch it!";

  await getQuoteAuthor();

  await generateAuthorButtons();
  await console.log("answer", answer);
}

function reset() {
  startUP();
}

startUP();

//private testing.

function getRelatedToAuthor() {
  let url = `https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&generator=search&gsrnamespace=0&gsrlimit=5&gsrsearch='${answer}'`;
  xhr.open("GET", url, true);
  // Provide 3 arguments (GET/POST, The URL, Async True/False)

  // Once request has loaded...
  xhr.onload = function() {
    // Parse the request into JSON
    var data = JSON.parse(this.response);

    // Loop through the data object
    // Pulling out the titles of each page

    for (var i in data.query.pages) {
      let link = data.query.pages[i].title;
      let relatedButton = document.createElement("button");
      relatedButton.innerHTML = `Related to the author is: ${link}`;
      authorQuotes.append(relatedButton);
      relatedButton.onclick = () => {
        location.href = `https://en.wikipedia.org/wiki/${link}`;
      };
    }
  };
}

function presentAuthorLink() {
  let authorButton = document.createElement("button");
  authorButton.innerHTML = `Would you like to learn more about ${author}?`;
  authorQuotes.append(authorButton);
  //click options.
  authorButton.onclick = () => {
    location.href = `https://en.wikipedia.org/wiki/${answer}`;
  };
}

// Send request to the server asynchronously
