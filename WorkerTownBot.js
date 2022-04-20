import fetch from 'node-fetch';

const kuki = "_ga=GA1.1.1347802490.1649865193; _ga_P9DQW7WC46=GS1.1.1650416115.44.1.1650416144.0; XSRF-TOKEN=eyJpdiI6InFaSEJtTWd1NUtUODZONFFabkNrWUE9PSIsInZhbHVlIjoiZmtMNlRHaDJscFU1K2FOdS9zcldnS1ZWU3E5dXpTaVZwVWhBcGNDVzI0ZFdJa2lVaEhJMXFCOFR3NCswMkFrRW5mM204Y3YySGFsOUs5VjJhbGx0MThoOE5QYTRxR3ZUdXJTaEFNa3pYMkhUdTRwa1pveW8yMXpPeEhJazJkeWwiLCJtYWMiOiIyOTc3MmM1OTc0OWU1MDUyOTE1ZTc2MTVhMWUyOTRjM2IwMWI5MzdiZTQ2YTdmMzJhYTU1YjlhZmYyNTQ3NTRmIiwidGFnIjoiIn0%3D; workertown_session=eyJpdiI6Ii82bmNXUHdFVDg3SHlIWHBXY0ZqMXc9PSIsInZhbHVlIjoiNXNNR3I1a21XQlhLbldqcVBrdWU1NjB6OHg2bjhlb05QMVRXZkFXalpwSUNxeTJQaVljZ09ORjRlNXd6aXh0SjdveFdJVmd1aVVPcno3by8rb3JKY095YUJ1UERsY0h0ZVlSQ2VNYlpTdVBDdHNYVUlWOWZMOFQzMWs0NG5vQVciLCJtYWMiOiI0ZDFiNDVjMzMwMzc0ZjhhNjNlMmQwM2YyMWZkM2ZjZDNjNzAzYjFhOTNkNTM1YzBlMzU3MjhkMTg1YjIwYzUxIiwidGFnIjoiIn0%3D";
const csrfToken = "MutIwdvOiqv16PqrhFse1xFSjH6m87Bz6E63u29Z";

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
    "x-csrf-token": csrfToken,
    "x-requested-with": "XMLHttpRequest",
    "cookie": kuki
}

while (true) {
    try {
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
                    await postData("https://game.worker.town/api/workers/rest", {
                        "worker_id": 5284,
                        "house_id": 5990,
                        "slot": 1
                    })
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
        console.log("WAITING 15 MINUTES \n", new Date());
        await sleep(1000 * 60 * 15);
    } catch (e) {
        console.log(e);
    }
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