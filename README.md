App: http://justinkuang.com/yelp-chatbot/
Github: https://github.com/cornellian/yelp-chatbot

I built an online chatbot that asks users for several attributes, and then finds relevant restaurants that fulfill such criteria.  The resulting information is presented to the user via the chatbot interface as a conversational response.

Engineering wise, this project is split into two main parts: the front-end user interface, and the back-end node.js server. I will explain each section individually.

The front end is built using HTML5, CSS and Javascript, along with the JQuery library and Web Speech API. The chatbot interface collects location, cuisine, and price range data from the user, then sends such attributes as parameters in a GET request to the back-end server. Also, the front-end code implements several checks to see if the inputs are valid- if they aren't, the user is asked to re-enter the parameters. The GET request returns a JSON array of objects (restaurants) that fit such criteria. This front-end parses the JSON data for specific restaurant attributes like rating, review count, phone number, address, Yelp url and a sample image to be shown to the user, so he/she can make an educated decision on which one to eat at. If the GET request fails, the user is notified. Similarly, if there are no restaurants that fit the user's parameters, the user is also notified as such. Also, the front-end interface uses the Web Speech API to read out loud the chatbot's response. I personally found the voice to be annoying, so I also implemented a button at the bottom of the interface that toggles the sound on and off. The entire front-end interface is hosted via Github pages.

The back end is a node.js server that uses the Express.js library to handle requests. As my webapp is the only client using this server, I only wrote code to handle GET requests with 3 arguments: location, search term, and maximum price. The node.js server parses the data from the GET request, and specifically also turns the maximum price argument into a comma-delimited string of each price including and below the maximum price (ex. input "3" becomes "3,2,1") to return results of all those prices. These arguments are passed to the Yelp Fusion API, and the resulting most relevant 20 results are returned to the front-end as a JSON file. The entire back-end is hosted on Heroku.



In the future, I hope to accomplish two things:

1. Find a way to not store the client id/secret id/auth token as plaintext- This is my first time working with a full stack application, so learning best practices is something that I want to do for future projects (and this one).

2. Implement a short description of the restaurant in the bot's output. The Yelp API doesn't support this (only reviews, which are subjective), so I want to possibly use PhantomJS or another scraper to find a short description from the official website of each restaurant, which can be found from the Yelp Fusion API. 

3. Implement a more full scale zip code validation system- the list of valid zip codes is public domain, and there are public APIs that can tell you directly if an input zip code is valid or not. I hope to make such an API call to see if the user's input zip code is valid, and then directly be able to tell the user if he/she needs to re-enter that information.
4. Allow the user to not input a parameter (ex. the user doesn't care about what cuisine)- this would require editing the node.js code to have a default action (in this case, not inputting that parameter at all).
