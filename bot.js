// Import Firebase Admin, Twit, and Node-Twitterbot
var admin = require('firebase-admin');
var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;

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
    "this deserves a pulitzer. 10/10 ",
    "is this satire? or is this art? 10/10 ",
    "reTWEET 10/10 ",
    "this is me irl. 10/10 ",
    "this one's meh. SYKE! 10/10 ",
    "UTB is really on the come up eh? 10/10 ",
    "great content. 10/10 ",
    "UTB is perhaps one of the best publications I've ever read. 10/10 ",
    "this gave me a new perspective on life. 10/10 ",
    "but why? thought-provoking... insightful... 10/10 "
];

// Chooses a random phrase to tweet
function chooseRandom(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}
var phrase = chooseRandom(phraseArray);

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

// Export code to other JS files to remove redundancy
module.exports = {
    Bot: Bot,
    phraseArray: phraseArray,
    chooseRandom: chooseRandom
};