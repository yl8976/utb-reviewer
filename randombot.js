// Import Twit and Node-Twitterbot
var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;

// Setup Twitter API access (secret keys are stored privately on Heroku)
var Bot = new TwitterBot({
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});

// Random phrases to choose from
var phraseArray = ["This post is SO good, 10/10 ",
    "Hahahahahahahahahahaha 10/10 ",
    "lmao 10/10 ",
    "absolute 10/10 ",
    "lmfao 10/10 ",
    "ok, this is epic 10/10 ",
    "LOL same 10/10 ",
    "yes 10/10 ",
    "jeeeeeeeez you really outdid yourself with this one. 10/10 ",
    "wow. 10/10 ",
    "this deserves a pulitzer. 10/10",
    "is this satire? or is this art? 10/10",
    "reTWEET 10/10",
    "this is me irl. 10/10"
];

// Chooses a random phrase to tweet
function chooseRandom(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}
var phrase = chooseRandom(phraseArray);

// Setup Puppeteer, a headless Chrome browser
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.underthebutton.com/section/all?page=1&per_page=100';

// Most recent post links
var links = []

// Launch puppeteer and scrape https://underthebutton.com's Most Recent page with 100 posts
puppeteer
    .launch({
        args: ['--no-sandbox']
    })
    .then(function (browser) {
        return browser.newPage();
    })
    .then(function (page) {
        return page.goto(url).then(function () {
            return page.content();
        });
    })
    .then(function (html) {
        // Grabs only links from Most Recent page
        $('.most-recent-photo > a', html).each(function () {
            links.push($(this).attr("href"));
        });
        console.log("The most recent link so far: " + links[0])
    })
    .catch(function (err) {
        // Log error to Heroku console
        console.log("You've got an error. Check it out below:");
        console.log(err);
    });



// Function to make delays (gives time for link scraper)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Randomly tweets an article from the 100 most recent articles with probability 1/2.
async function randomTweet() {
    console.log('Waiting for scraper...');
    // Wait 1 minute for link scraper
    await sleep(60000);

    // Choose link and tweet at random and tweets them
    if (Math.round(Math.random())) {
        phrase = chooseRandom(phraseArray);
        link = chooseRandom(links);
        Bot.tweet(phrase + link);
        console.log("Random Tweet successful. The tweet says: " + phrase + link);
    }
}

randomTweet();