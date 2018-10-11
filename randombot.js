// Import Twit and Node-Twitterbot
var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;
var botjs = require('./bot');

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
    console.log("[randombot.js] Scrape successful.");
    browser.close();
}

// Function to make delays (gives time for link scraper)
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Randomly tweets an article from the 100 most recent articles with expected probability of success 30%.
async function randomTweet() {
    console.log('[randombot.js] Waiting for scraper...');
    // Wait 1 minute for link scraper
    await sleep(60000);

    // Choose link and tweet at random and tweets them
    if (Math.round(Math.random() + 0.2)) {
        var phrase = botjs.chooseRandom(botjs.phraseArray);
        var link = botjs.chooseRandom(links);
        botjs.Bot.tweet(phrase + link);
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

process.on('SIGTERM', function() {
    process.exit();
});