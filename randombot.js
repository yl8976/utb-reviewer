// Import Twit and Node-Twitterbot
var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;
var Tweets = require('./tweets');

// Setup Twitter API access (secret keys are stored privately on Heroku)
var Bot = new TwitterBot({
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});


// Setup Puppeteer, a headless Chrome browser
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.underthebutton.com/section/all?page=3&per_page=10';

// Most recent post links
var links = []

// Launch puppeteer and scrape https://underthebutton.com's Most Recent page with 100 posts
async function run() {
    const browser = await puppeteer.launch({
        args: ['--no-sandbox']
    });

    const page = await browser.newPage();
    await page.goto(url);
    let html = await page.content();

    // Grabs only links from Most Recent page
    $('.most-recent-photo > a', html).each(function () {
        links.push($(this).attr("href"));
    });
    console.log("[randombot.js] Scrape successful. Now wait for the delay to finish...");
    browser.close();
}

// Function to make delays (gives time for link scraper)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Randomly tweets an article from the 100 most recent articles with expected probability of success 30%.
async function randomTweet() {
    console.log("[randombot.js] Waiting for scraper...");
    // Wait 1 minute for link scraper
    await sleep(60000);

    // Choose link and tweet at random and tweets them
    if (Math.round(Math.random() - 0.2)) {
        var phrase = Tweets.chooseRandom(Tweets.phraseArray);
        var link = Tweets.chooseRandom(links);
        Bot.tweet(phrase + link);
        console.log("[randombot.js] Random tweet successful. The tweet says: " + phrase + link);
    } else {
        console.log("[randombot.js] No random tweet will occur this time.")
    }
}

try {
    run();
} catch (error) {
    // Log error to Heroku console
    console.log("[randombot.js] You've got an error. Check it out below:");
    console.log(error);
}

randomTweet();

// Exit and save memory when Heroku cycles dynos
process.on('SIGTERM', function() {
    process.exit();
});