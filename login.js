import fetch from 'node-fetch';
import {parse} from 'node-html-parser';
import Moralis from 'moralis/node.js';


var htmlString = '';
var csrfToken = '';

const serverUrl = "https://jbfwl2hktba9.usemoralis.com:2053/server";
const appId = "KwTszDen47DBZGnGSwbMv1RfEons7lcRHSUHk4vk";


Moralis.start({serverUrl, appId});

async function getCsrfToken() {
    try {
        const response = await fetch('https://game.worker.town/login');

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.text();

        const root = parse(result);
        csrfToken = root.querySelector("[name~=csrf-token]")._attrs.content;

    } catch (err) {
        console.log(err);
    }
}

await getCsrfToken();

async function login(e) {
    let message;

    await fetch("https://game.worker.town/api/login/sig", {
        headers: {
            "X-Requested-With": "XMLHttpRequest", "X-CSRF-Token": csrfToken
        }, method: "get", credentials: "same-origin",
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            message = response;
            Moralis.getSigningData = message;
            return;
        });


    let user = Moralis.User.current();
    console.log(user);
    user = await Moralis.authenticate({signingMessage: message});

    await fetch("https://game.worker.town/api/login/auth", {
        headers: {
            "Content-Type": "application/json",
            "Accept": "application/json",
            "X-Requested-With": "XMLHttpRequest",
            "X-CSRF-Token": csrfToken
        }, method: "post", credentials: "same-origin", body: JSON.stringify({
            address: user.attributes.authData.moralisEth.id,
            signature: user.attributes.authData.moralisEth.signature,
            message: user.attributes.authData.moralisEth.data
        })
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(response => {
            document.location.href = '/tavern';
            return;
        });
}

login();
















fetch("https://game.worker.town/api/workers/feed", {
    "headers": {
        "accept": "application/json",
        "accept-language": "tr-TR,tr;q=0.9,en-US;q=0.8,en;q=0.7",
        "cache-control": "no-cache",
        "content-type": "application/json",
        "pragma": "no-cache",
        "sec-ch-ua": "\" Not A;Brand\";v=\"99\", \"Chromium\";v=\"98\", \"Google Chrome\";v=\"98\"",
        "sec-ch-ua-mobile": "?0",
        "sec-ch-ua-platform": "\"Linux\"",
        "sec-fetch-dest": "empty",
        "sec-fetch-mode": "cors",
        "sec-fetch-site": "same-origin",
        "x-csrf-token": "1dHiBSXSYf6iOZuOtlijmFHftF9ygyQZlqq4dYPL",
        "x-requested-with": "XMLHttpRequest"
    },
    "referrer": "https://game.worker.town/tavern",
    "referrerPolicy": "strict-origin-when-cross-origin",
    "body": "{\"worker_id\":\"5284\",\"shift\":1}",
    "method": "POST",
    "mode": "cors",
    "credentials": "include"
});



