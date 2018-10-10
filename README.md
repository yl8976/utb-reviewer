# UTB Reviewer Bot

A simple Twitter bot that "reviews" Under the Button articles. The bot's handle is [@UTBReviewer](https://twitter.com/UTBReviewer).

## How It Works

This bot was built using:
1. [Heroku](https://heroku.com)
    - Hosts the code, runs Node.js and Puppeteer. A scheduler also runs the code once every 10 minutes.
2. [Puppeteer](https://github.com/GoogleChrome/puppeteer)
    - Creates a headless Chrome instance that scrapes [Under the Button's Most Recent Posts](https://www.underthebutton.com/section/all).
3. [Firebase Realtime Database](https://firebase.google.com/docs/database/)
    - Stores the latest post link scraped by Puppeteer.
4. [Twitter API](https://www.npmjs.com/package/twit)
    - Invokes Twitter's API using twit, an API client for Node.js. If the link scraped by Puppeteer is different from what's already on Firebase, twit posts a tweet to [@UTBReviewer](https://twitter.com/UTBReviewer).