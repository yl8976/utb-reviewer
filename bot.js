// Import Firebase Admin, Twit, and Node-Twitterbot
var admin = require('firebase-admin');
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

// Initialize Firebase database
admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY.replace(/\\n/g, '\n')
    }),
    databaseURL: "https://utb-reviewer.firebaseio.com"
});
var db = admin.database();
var ref = db.ref("links/most-recent-link");
var mostRecentPostLink = "";

// Chooses a random phrase to tweet
function chooseRandom(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}
var phrase = Tweets.chooseRandom(Tweets.phraseArray);

// Setup Puppeteer, a headless Chrome browser
const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.underthebutton.com/section/all?page=1&per_page=5';

// Most recent post links
var links = []

// Launch puppeteer and scrape https://underthebutton.com's Most Recent page with 5 posts
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

    // Update most recent link to Firebase
    ref.set({
        link: links[0],
    });

    console.log("[bot.js] The most recent link so far: " + links[0]);
    browser.close();
}

try {
    run();
} catch (error) {
    // Log error to Heroku console
    console.log("[bot.js] You've got an error. Check it out below:");
    console.log(error);
}

// If most recent link changes when you scrape the site, compose a new tweet with the latest post link
ref.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    console.log("[bot.js] New post detected! The most recent post link is: " + changedPost);
    mostRecentPostLink = String(changedPost);
    Bot.tweet(phrase + mostRecentPostLink);
    console.log("[bot.js] Tweet successful. The tweet says: " + phrase);
});