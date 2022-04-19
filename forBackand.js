import fetch from 'node-fetch';

var customHeader = {
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
    "x-csrf-token": "8MsUb9JcR3BtojjDovhIA5KgZbFKrsmGLfy31DgD",
    "x-requested-with": "XMLHttpRequest",
    "cookie": "_ga=GA1.1.47641056.1649914779; _ga_P9DQW7WC46=GS1.1.1650354581.16.1.1650356823.0; XSRF-TOKEN=eyJpdiI6IkhmL0kzcmhXWUhjbDMwZWlJcVJvc0E9PSIsInZhbHVlIjoiejhmSkhTWVZkQitST0hzQndWdE1TK2YxQjRqdDZWU2NxQ1h3dzFES1JTZnJMUHRJMGlqVDlpSERseDIzVTh0MXVlZGRMamJuTXJiRkZ4UWVPR2tFUmhzRWZGenNwL213dEprTjJoOXRkaTcxUzd4UVE2QUZsMkp0OXhGMS9GSlUiLCJtYWMiOiJhNGFjNGNlYjM1MTA3MGM1ZTNjNmNjNDRlODIzN2JjMDQzNjZlYjM5OTdkZmZmNGVjNDNlYmQzMjY1MmM0ZjE5IiwidGFnIjoiIn0%3D; workertown_session=eyJpdiI6IktWTVZiRGVmZVI4TGgrZDFaY3V0cXc9PSIsInZhbHVlIjoibGo2cFhEWTQzZTBZbWFuNlg2OFpJN0RkL01TMDVUVE5wR3RXRmYxN3RqUlRZaCt2SnBvekh4bjRSWWc4YzZkbVNUOER5UFpYQzUwRjF6OEZvM3hPeEJtMG1SUVRFU2JnejZkQVFVbXNjeUFtb2ZnQndkaGJSUi9saXhYOHlBRDEiLCJtYWMiOiJkYTE4MGYzMjA4OWI1MmVkNGU5OGRhZjQzN2ZmZDgzMGVkOWJiNzQ1MGRmYTk2OGM4MDg2MjE1MDI4ZmUwNWE2IiwidGFnIjoiIn0%3D"
}

while (true) {
    await fetch("https://game.worker.town/api/workers", {
        headers: customHeader, method: "get", credentials: "same-origin",
    })
        .then(res => res.json())
        .catch(error => console.error('Error:', error))
        .then(async response => {
            console.log(response)
            if (response[0].resting_until == null && response[0].working_until == null) {
                await postData("https://game.worker.town/api/workers/work", {"worker_id": "5284"})
                console.log("IDLE")
            } else if (response[0].resting_until != null && Math.floor(new Date(response[0].resting_until).getTime() / 1000) <= Math.floor(Date.now() / 1000)) {
                await postData("https://game.worker.town/api/workers/rest/callback", {"worker_id": "5284"})
                console.log("GO TO WORK")
                await postData("https://game.worker.town/api/workers/work", {"worker_id": "5284"})
            } else if (response[0].working_until != null && Math.floor(new Date(response[0].working_until).getTime() / 1000) <= Math.floor(Date.now() / 1000)) {
                await postData("https://game.worker.town/api/workers/work/callback", {"worker_id": "5284"})
                console.log("GO TO RESTING")
                await postData("https://game.worker.town/api/workers/rest", {"worker_id": "5284"})
            } else if (response[0].working_until != null && Math.floor(new Date(response[0].working_until).getTime() / 1000) >= Math.floor(Date.now() / 1000)) {
                if (Math.floor(new Date(response[0].shift.shift_1_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && response[0].shift.shift_1_eaten === 0) {
                    await postData('https://game.worker.town/api/workers/feed', {"worker_id": "5284", "shift": 1})
                    console.log("SHIFT 1")
                } else if (Math.floor(new Date(response[0].shift.shift_2_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && response[0].shift.shift_2_eaten === 0) {
                    console.log("SHIFT 2")
                    await postData('https://game.worker.town/api/workers/feed', {"worker_id": "5284", "shift": 2})
                } else if (Math.floor(new Date(response[0].shift.shift_3_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && response[0].shift.shift_3_eaten === 0) {
                    await postData('https://game.worker.town/api/workers/feed', {"worker_id": "5284", "shift": 3})
                    console.log("SHIFT 3")
                } else if (Math.floor(new Date(response[0].shift.shift_4_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && response[0].shift.shift_4_eaten === 0) {
                    await postData('https://game.worker.town/api/workers/feed', {"worker_id": "5284", "shift": 4})
                    console.log("SHIFT 4")
                }
            }
        });
    console.log("WAITING 15 MINUTES");
    await sleep(1000*60*15);
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: customHeader,
        body: JSON.stringify(data)
    });
    return response.json();
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}