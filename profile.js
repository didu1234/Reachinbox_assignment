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

   