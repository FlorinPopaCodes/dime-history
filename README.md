# Dime History 🪙

This extension deletes items in the browsers history that are older than 14
days. That's it!


## Motivation

I wanted to be more mindful with how I approach bookmarking and the things
that I allow to pop-up in my browser's address bar once I start typing, so 
I decided to create a simple extension that just deletes everything older
than two weeks.


## How does this work

When installed, the extension records the current date. On each idle event
(after around a minute of inactivity), it deletes history between the install
date and 14 days ago. It never touches history from before installation.


## Alternatives

* [HistoryCleaner](https://addons.mozilla.org/en-US/firefox/addon/history-cleaner/)
* [Expire history by days](https://addons.mozilla.org/en-US/firefox/addon/expire-history-by-days/)
