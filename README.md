# Reachinbox_assignment
OAuth2 for user login, fetches Gmail messages using the Gmail API based on user interaction, displays fetched messages in a web interface, and includes logout functionality for secure session management. Error handling ensures smooth operation and user feedback during data retrieval and interaction processes.

Index.html:
It allows users to sign in using Google OAuth2 authentication (signIn() function in index.html). After authentication, it retrieves an access token that grants permissions to interact with Gmail APIs.

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OAuth2 Google Sign-In With Logout</title>
</head>
<body>
    <h1>OAuth2 Google Sign-In</h1>
    <button onclick="signIn()">Sign In With Google</button>
</body>
<script type="module" src="./script.js"></script> 
</html>

Script.js:
function signIn() {
    let oauth2Endpoint = "https://accounts.google.com/o/oauth2/v2/auth";

    let form = document.createElement('form');
    form.setAttribute('method', 'GET');
    form.setAttribute('action', oauth2Endpoint);

    let params = {
        "client_id": "532551466905-tohieiu5egeidjno4676s039lcvgg4ol.apps.googleusercontent.com", 
        "redirect_uri": "http://127.0.0.1:5500/profile.html", 
        "response_type": "token",
        "scope": "https://mail.google.com",
        "include_granted_scopes": 'true',
        'state': 'pass-through-value'
    };

    for (let p in params) {
        let input = document.createElement('input');
        input.setAttribute('type', 'hidden');
        input.setAttribute('name', p);
        input.setAttribute('value', params[p]);
        form.appendChild(input);
    }

    document.body.appendChild(form);
    form.submit();
}

window.signIn = signIn;






Profile.html:
The fetched messages are intended to be displayed in a table (profile.html) where users can potentially interact with them. This includes displaying message details such as date, sender, recipient, subject, and the message itself.


<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Profile of user</title>
    <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.4.1/css/bootstrap.min.css">
</head>
<body>

    <div class="container">
        <h1>Welcome to Gmail Inbox</h1>
        <div id="total">Total Messages:</div>
        <input type="range" id="number" value="10" max="500" min="1"/>
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Date</th>
                    <th>From</th>
                    <th>To</th>
                    <th>Subject</th>
                    <th>Email</th>
                </tr>
            </thead>
            <tbody id="result">
            </tbody>
        </table>
        <button id="logout">Logout</button>
    </div>
    <script type="module" src="./profile.js"></script> 
</body>
</html>




Profile.js:
Once authenticated, the profile.html page displays a user's Gmail inbox. It fetches a specified number of Gmail messages (number) using the Gmail API (getMessages() function in profile.js). Each message's details are fetched individually to display or process further.

import utils from "./utils.js";

let params = utils.getParamsFromURL(location.href);
let ACCESS_TOKEN = "";
let redirect_url = "http://127.0.0.1:5500/index.html";

let messageData = {};

let total = document.getElementById('total');
let divResult = document.getElementById('result');

let button = document.getElementById("logout");
let numberInput = document.getElementById('number')

console.log(params);  

utils.saveOAuth2Info(params, "profile.html", "info");

let info = JSON.parse(localStorage.getItem("info"));
ACCESS_TOKEN = info.access_token;

let number = 5;
numberInput.onchange = () =>{
    total.innerHTML = numberInput.value
    number = numberInput.value
    getMessages(number)

}

total.innerHTML += number;
getMessages(number);

function getMessages(number) {
    fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages?maxResults=${number}`, {
        method: 'GET',
        headers: new Headers({ Authorization: `Bearer ${ACCESS_TOKEN}` })
    })
    .then((data) => data.json())
    .then((messages) => {
        console.log(messages);

        messages.messages.forEach((message) => {
            fetch(`https://gmail.googleapis.com/gmail/v1/users/me/messages/${message.id}`, {
                method: 'GET',
                headers: new Headers({ Authorization: `Bearer ${ACCESS_TOKEN}` })
            })
            .then((data) => data.json())
            .then((info) => {
                console.log(info);

                if (info.payload && info.payload.headers) {
                    let result = [];

                    info.payload.headers.forEach((header) => {
                        if (header.name === "Date" || header.name === "Subject" || header.name === "To" || header.name === "From") {
                            result.push(header.value);
                        }
                    });

                    console.log(result);

                    divResult.innerHTML += `
                        <tr>
                            <td>${result[0] || ''}</td>
                            <td>${result[1] || ''}</td>
                            <td>${result[2] || ''}</td>
                            <td>${result[3] || ''}</td>
                            <td><a target="_blank" href="https://mail.google.com/mail/u/0/#inbox/${messageData.id}">${messageData.msg}</a>
                        </tr>
                    `;
                } else {
                    console.error('Headers not found or not in expected format:', info);
                }
            })
            .catch((error) => {
                console.error('Error fetching message details:', error);
            });
        });
    })
    .catch((error) => {
        console.error('Error fetching messages:', error);
    });
}

button.onclick = logout;

function logout() {
    utils.logout(ACCESS_TOKEN, redirect_url);
}



Utils.js:

const utils = {
    getParamsFromURL: function(url) {
        let params = {};
        let parser = new URL(url);
        let queryString = parser.hash.substring(1);
        let urlParams = new URLSearchParams(queryString);
        for (let [key, value] of urlParams.entries()) {
            params[key] = value;
        }
        return params;
    },
    saveOAuth2Info: function(params, page, storageKey) {
        localStorage.setItem(storageKey, JSON.stringify(params));
        localStorage.setItem('page', page);
    },
    logout: function(accessToken, redirectUrl) {
        let logoutWindow = window.open(`https://accounts.google.com/Logout?continue=https://appengine.google.com/_ah/logout?continue=${redirectUrl}`, '_blank');
        setTimeout(() => {
            logoutWindow.close();
            window.location.href = redirectUrl;
        }, 1000);
    }
};

export default utils;



OAuth sign-in integration:
Inedx.html page click an Run it on Live server The first page is this page were we can login to the gmail page.
![1](https://github.com/didu1234/Reachinbox_assignment/assets/133500757/650810b7-f142-455a-b554-f51ac6e075d6)


2) page appear is profile page were we can see the mail that our on our current or we can see orgininal email id  and i have given 5 message limit in this so we can only 5 messages right now. I have guven an increase decrease bar for email were we can extend our gmail count and also given a logout button .Once we logout we directly go to the main page and for login we need permission to access it again .also we can see link which takes directly to the original email.

![2](https://github.com/didu1234/Reachinbox_assignment/assets/133500757/9d2e8ba4-6a30-464b-9371-709d094065b1)
![3](https://github.com/didu1234/Reachinbox_assignment/assets/133500757/3bda0109-11d8-4281-9eee-c8ea4bf50e26)
![4](https://github.com/didu1234/Reachinbox_assignment/assets/133500757/0fae4089-dd81-48dc-a456-c438a6d9dacd)



