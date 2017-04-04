var messages = [], //array that hold the record of each string in chat
    lastUserMessage = "", //keeps track of the most recent input string from the user
    botMessage = "", // keeps track of what the chatbot is going to say
    botName = 'Yelp recommendation Chatbot',
    talking = true, //toggle speech
    counter = 0,
    info = {},
    talking = true,
    data_output = false, //true if the yelp api call has been made
    output_messages = ["First of all, I need to ask a few basic questions. What zip code are you in?", "What type of cuisine are you looking for?", "What is your maximum price range on a scale of 1 to 4?", "Loading recommendations, please wait..."];

//toggles sound on and off
function toggleSound() {
    talking = !talking;
    if (talking) {
        $('#sound').text("Turn Sound Off");
    } else {
        $('#sound').text("Turn Sound On");

    }
}

//edit this function to change what the chatbot says
function chatbotResponse() {


    if (data_output) { //first recommendation is already out
        if (counter == 20) {
            botMessage = "I'm out of recommendations, sorry!";
        } else {
            botMessage = "";
            if (counter == 3 || lastUserMessage.toLowerCase() === "next") {
                botMessage += "How about " + info.businesses[counter - 3].name + "? ";
                if (info.businesses[counter - 3].rating != "") {
                    botMessage += "This place has a rating of " + info.businesses[counter - 3].rating + " out of 5, with " + info.businesses[counter - 3].review_count + " reviews. ";
                }
                if (info.businesses[counter - 3].phone != "") {
                    botMessage += "</br></br>" + "You can call " + info.businesses[counter - 3].name + " at " + info.businesses[counter - 3].phone.substr(2, info.businesses[counter - 3].phone.length) + ". ";
                }
                var location = info.businesses[counter - 3].location.address1 + " " + info.businesses[counter - 3].location.city + " " + info.businesses[counter - 3].location.state + " " + info.businesses[counter - 3].location.zip_code + "/";
                location = location.replace(" ", "+"); //location.address1 field is space delimited- this replace function turns those spaces into "+" for the url
                botMessage += "</br></br>" + "Click " + "<a target='_blank' href='https://www.google.com/maps/dir//" + location + "'> here</a>" + " for directions on Google Maps. "
                botMessage += "</br>" + "Click " + "<a target='_blank' href='" + info.businesses[counter - 3].url + "'> here</a>" + " for this restaurant's Yelp profile. "
                botMessage += "</br></br></br>" + "<img style='width:200px' src='" + info.businesses[counter - 3].image_url + "'>";
                botMessage += "</br> </br> Say 'next' for another recommendation, or 'thanks' to end this session. ";

            } else if (lastUserMessage.toLowerCase() === "thanks") {
                botMessage += "No problem! Visit again if you need another recommendation. ";
            } else {
                botMessage = "say either 'next' or 'thanks'.";
                counter--;
            }
            counter++;
        }
    } else {
        botMessage = "Be Patient!"
        if (counter === 3) {
            if (messages[2] == parseInt(messages[2]) && messages[6] == parseInt(messages[6])) {
                call_yelp(messages[2], messages[4], messages[6]);
                botMessage = output_messages[counter];
            } else {
                botMessage = "You need to input numbers for both your zip code and price. Refresh this page and try again.";
            }
        }
        if (counter < 3) {
            if (counter == 0) {
                if (lastUserMessage.toLowerCase() !== "i'm hungry") {
                    botMessage = "Too bad! "
                } else {
                    botMessage = "";
                }
            } else {
                botMessage = "";
            }
            botMessage += output_messages[counter];
            counter++;
        }
    }

}

//this runs each time enter is pressed.
function newEntry() {
    //if the message from the user isn't empty then run
    if (document.getElementById("chatbox").value != "") {
        //pulls the value from the chatbox ands sets it to lastUserMessage
        lastUserMessage = document.getElementById("chatbox").value;
        //sets the chat box to be clear
        document.getElementById("chatbox").value = "";
        //adds the value of the chatbox to the array messages
        messages.push(lastUserMessage);
        //Speech(lastUserMessage);  //says what the user typed outloud
        //sets the variable botMessage in response to lastUserMessage
        chatbotResponse();
        //add the chatbot's name and message to the array messages
        messages.push("<b>" + botName + ":</b> " + botMessage);
        // says the message using the text to speech function written below
        //outputs the last few array elements of messages to html
        for (var i = 1; i < 8; i++) {
            if (messages[messages.length - i])
                document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
        }
        Speech($("#chatlog1").text().substr(29, $("#chatlog1").text().length));
        console.log($("#chatlog1").text().substr(29, $("#chatlog1").text().length));

    } else {
        chatbotResponse();
        //add the chatbot's name and message to the array messages
        messages.push("<b>" + botName + ":</b> " + botMessage);
        // says the message using the text to speech function written below
        //outputs the last few array elements of messages to html
        for (var i = 1; i < 8; i++) {
            if (messages[messages.length - i])
                document.getElementById("chatlog" + i).innerHTML = messages[messages.length - i];
        }
        Speech($("#chatlog1").text().substr(29, $("#chatlog1").text().length));
        console.log($("#chatlog1").text().substr(29, $("#chatlog1").text().length));
    }
}

//text to Speech
//https://developers.google.com/web/updates/3014/01/Web-apps-that-talk-Introduction-to-the-Speech-Synthesis-API
function Speech(say) {
    if ('speechSynthesis' in window && talking) {
        var utterance = new SpeechSynthesisUtterance(say);
        speechSynthesis.speak(utterance);
    }
}

//runs the keypress() function when a key is pressed
document.onkeypress = keyPress;
//if the key pressed is 'enter' runs the function newEntry()
function keyPress(e) {
    var x = e || window.event;
    var key = (x.keyCode || x.which);
    if (key == 13 || key == 3) {
        //runs this function when enter is pressed
        newEntry();
    }
    if (key == 38) {
        console.log('hi')
        //document.getElementById("chatbox").value = lastUserMessage;
    }
}

//clears the placeholder text ion the chatbox
//this function is set to run when the users brings focus to the chatbox, by clicking on it
function placeHolder() {
    document.getElementById("chatbox").placeholder = "";
}

function call_yelp(zip, food, price) {

    $.ajax({
        url: 'https://yelp-chatbot.herokuapp.com/',
        type: 'GET',
        dataType: 'json',
        data: {
            location: zip,
            price: price,
            term: food
        },
        success: function(data) {
            console.log(data);
            info = data;
            data_output = true;
            newEntry();
        },
        error: function() {
            alert("you didn't put in numbers for your zip and price! Refresh this page and try again.");
        }
    });
}
