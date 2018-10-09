var admin = require('firebase-admin');
var Twit = require('twit');
var TwitterBot = require('node-twitterbot').TwitterBot;

var Bot = new TwitterBot({
    consumer_key: process.env.BOT_CONSUMER_KEY,
    consumer_secret: process.env.BOT_CONSUMER_SECRET,
    access_token: process.env.BOT_ACCESS_TOKEN,
    access_token_secret: process.env.BOT_ACCESS_TOKEN_SECRET
});
var phraseArray = ["This post is SO good, 10/10 ",
    "Hahahahahahahahahahaha 10/10 ",
    "lmao 10/10 ",
    "absolute 10/10 ",
    "lmfao 10/10 ",
    "ok, this is epic 10/10 ",
    "LOL same 10/10 ",
    "yes 10/10 ",
    "xD 10/10 ",
    "wow. 10/10 "
];
function chooseRandom(myArray) {
    return myArray[Math.floor(Math.random() * myArray.length)];
}
var phrase = chooseRandom(phraseArray);

admin.initializeApp({
    credential: admin.credential.cert({
        projectId: process.env.PROJECT_ID,
        clientEmail: process.env.CLIENT_EMAIL,
        privateKey: process.env.PRIVATE_KEY
    }),
    databaseURL: "https://utb-reviewer.firebaseio.com"
});

var db = admin.database();
var ref = db.ref("links/most-recent-link");
var mostRecentPost = "";

const puppeteer = require('puppeteer');
const $ = require('cheerio');
const url = 'https://www.underthebutton.com/section/all';
var links = []
puppeteer
    .launch()
    .then(function (browser) {
        return browser.newPage();
    })
    .then(function (page) {
        return page.goto(url).then(function () {
            return page.content();
        });
    })
    .then(function (html) {
        $('.most-recent-photo > a', html).each(function () {
            console.log($(this).attr("href"));
            links.push($(this).attr("href"));
        });
        ref.set({
            link: links[0],
        });
    })
    .catch(function (err) {
        //handle error
        console.log("Error!");
    });

// Get the data on a post that has changed
ref.on("child_changed", function (snapshot) {
    var changedPost = snapshot.val();
    console.log("The most recent UTB post is " + changedPost);
    mostRecentPost = changedPost;
    Bot.tweet(phrase + mostRecentPost);
});