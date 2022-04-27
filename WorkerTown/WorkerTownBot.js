import fetch from 'node-fetch';
import * as fs from 'fs';


const kuki = "_ga=GA1.1.47641056.1649914779; XSRF-TOKEN=eyJpdiI6IjRFenU5MG9xSklwL2F1c3NOWjBEOFE9PSIsInZhbHVlIjoiUk14eW1JSzZWTkdBdHVUcXZMNEFTaXlJem5hM0MyR082bGV0ajFXTUVVUU9YaU1Hekc2ZkQrOFN3dHpvOEJ4eEZSK1Q4SVMzdDIvSWk0dEVRZnNPUkppeFZ6TDZSWjJCQTdFa3lob2UyL3ljMDZRaTM3dDBMWXJZOHVmenhPSloiLCJtYWMiOiI0ZWY1NDczODM5OTg1MDM1ODM1ZGVjYmU3NjdmODYxMzcyMjgxMTZhN2NhODNjNjlkNjE3NzdjYWYyZWNlMTg0IiwidGFnIjoiIn0%3D; workertown_session=eyJpdiI6Imw0Slp4UjdEcEFBaEgzT0Z0bXJFY0E9PSIsInZhbHVlIjoicm1MYUdFZ24wRlI4VlNOSkliOG1wVHJObDZPVkVna0M5K0JidEVoSER5d00va0JMdTN6V3FrOHcxUmc5SGRRK0RwV0h0Vjk0MXM5US9vZ0VwcE01YTVQVTdZL2gzMjU4S1h3TmZZdTVYRHRUanNKSTZEdjRTRVpVZEJxRjZnRXUiLCJtYWMiOiI5NDY5ODNkOTkyMDQ0ZDNiYzUxZTEzODY3YzBlODk4OTRmMzg3N2JmODIzOGRjM2U0NThiMjI0NTY0MGE0MzJhIiwidGFnIjoiIn0%3D; _ga_P9DQW7WC46=GS1.1.1651048709.45.0.1651048709.0";

const csrfToken = "fifT74oxAP93JhLQFJPphyN7Rjnh27Y9wJQloxnC";

const customHeader = {
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
};

let dailyIncome = 0;
const today = new Date()

while (true) {
    let time = today.getHours() + ":" + today.getMinutes()

    if (time === "23:59") {
        dailyIncome = 0;
    }
    try {
        await fetch("https://game.worker.town/api/workers", {
            headers: customHeader, method: "get", credentials: "same-origin",
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(async response => {
                for (const worker of response) {
                    const workerId = worker.id;
                    switch (worker.status_id) {
                        case 1:
                            console.log(worker.id + " IDLE !");
                            await postData("https://game.worker.town/api/workers/work", {"worker_id": workerId})
                            break;
                        case 2:
                            console.log(worker.id + " Working ! UNTIL: " + worker.working_until);

                            if (worker.shift.shift_1_eaten === 0) {
                                await postData('https://game.worker.town/api/workers/feed', {
                                    "worker_id": workerId,
                                    "shift": 1
                                });
                                console.log("SHIFT 1 | " + workerId)
                            } else if (worker.shift.shift_2_eaten === 0) {
                                await postData('https://game.worker.town/api/workers/feed', {
                                    "worker_id": workerId,
                                    "shift": 2
                                });
                                console.log("SHIFT 2 | " + workerId)
                            } else if (worker.shift.shift_3_eaten === 0) {
                                await postData('https://game.worker.town/api/workers/feed', {
                                    "worker_id": workerId,
                                    "shift": 3
                                });
                                console.log("SHIFT 3 | " + workerId)
                            } else if (worker.shift.shift_4_eaten === 0) {
                                await postData('https://game.worker.town/api/workers/feed', {
                                    "worker_id": workerId,
                                    "shift": 4
                                });
                                console.log("SHIFT 4 | " + workerId)
                            }
                            if (Math.floor(new Date(worker.working_until).getTime() / 1000) <= Math.floor(Date.now() / 1000)) {
                                await postData("https://game.worker.town/api/workers/work/callback", {"worker_id": workerId});
                                dailyIncome += 169;
                                fs.writeFile('incomeLog.txt', workerId + " WORKERS COME WORK! " + today.getDate() + ":" + today.getHours() + ":" + today.getMinutes() + " DAILY INCOMED COIN :" + dailyIncome, err => {
                                    if (err) {
                                        console.error(err);
                                    }
                                });
                                await postData("https://game.worker.town/api/workers/rest", {
                                    "worker_id": workerId,
                                    "house_id": 5990,
                                    "slot": 1
                                });
                            }

                            break;
                        case 3:
                            console.log(worker.id + " Exhausted !");
                            await postData("https://game.worker.town/api/workers/rest", {
                                "worker_id": workerId,
                                "house_id": 5990,
                                "slot": 1
                            });

                            break;
                        case 4:
                            console.log(worker.id + " Resting ! UNTIL: " + worker.resting_until);

                            if (Math.floor(new Date(worker.resting_until).getTime() / 1000) <= Math.floor(Date.now() / 1000)) {
                                await postData("https://game.worker.town/api/workers/rest/callback", {"worker_id": workerId})
                                await postData("https://game.worker.town/api/workers/work", {"worker_id": workerId})
                            }

                            break;
                        case 5:
                            console.log(worker.id + " Questing !");
                            break;
                        case 6:
                            console.log(worker.id + " WorldBossing !");
                            break;
                    }
                }
            });

        console.log("WAITING 15 MINUTES | CHECKED TIME => " + new Date());
        await sleep(1000 * 60 * 15);
    } catch (e) {
        console.log(e);
    }
}

async function postData(url = '', data = {}) {
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