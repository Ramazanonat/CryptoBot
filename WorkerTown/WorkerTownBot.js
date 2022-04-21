import fetch from 'node-fetch';

const kuki = "_ga=GA1.1.1347802490.1649865193; XSRF-TOKEN=eyJpdiI6Ijd6ZVF4RytIZEx4QVgvS2hXSlZxTnc9PSIsInZhbHVlIjoiWXBJOFR3dCs2cEg0Q0w1QmtHMjdNUnhjckpzUGpHQ3lVSmh2MUhxc2dEOVdIRWxnemc0M2RWdXdTeGI4dGladVozejlveGs5TmhOVkx3cC9nL1RuUXVNZGw5ZUxVK09kUTdjcGVrMTlMWEhqZU5ZaEFiMUszVmdsVTBsVGVheUgiLCJtYWMiOiIzNDc4NDVhODVlYzczMmFjYzAyM2ZmMDA4M2I1NzVkNjdlOWM4YTQzYTU3YWRhYzMxNmVjYjY0Nzc2YWFmNGE5IiwidGFnIjoiIn0=; workertown_session=eyJpdiI6IllEV25GVS9sVURWaHJFY3JpR3hXTEE9PSIsInZhbHVlIjoiS0x1VHBYdTdBVExMLzBRbTFudEx0QzF3Q3dGenN5MUt2M1RXRnd3QlNDZFQrbldUOUlxa00zRnJFeGliMGo5S1FzN0I2SnFxM3BmRkpjS0tRcHg2c1NxKzFXLzN1Mlh0VVVDMDVxQXRiWVlwbjdCY2FVclpVaFQxd1NjQkYvTEwiLCJtYWMiOiIxOTA1NDQyYzIyNjhhYzRmYzc3Zjc0NTg0NmQ3MzYyNTc4ZWEwM2U3ZmMyNmVmMDY2YzZjYzY1YTNjOGM3Y2M2IiwidGFnIjoiIn0=; _ga_P9DQW7WC46=GS1.1.1650572868.51.1.1650576080.0";
const csrfToken = "WtDW52BzaAsxiVJD7mWeL7rKwSuGIaFKKcwvOEPP";

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

while (true) {
    try {
        await fetch("https://game.worker.town/api/workers", {
            headers: customHeader, method: "get", credentials: "same-origin",
        })
            .then(res => res.json())
            .catch(error => console.error('Error:', error))
            .then(async response => {
                for (let worker of response) {
                    let workerId = worker.id;
                    if (worker.resting_until == null && worker.working_until == null) {
                        await postData("https://game.worker.town/api/workers/work", {"worker_id": workerId})
                        console.log("IDLE" + workerId)
                    } else if (worker.resting_until != null && Math.floor(new Date(worker.resting_until).getTime() / 1000) <= Math.floor(Date.now() / 1000)) {
                        await postData("https://game.worker.town/api/workers/rest/callback", {"worker_id": workerId})
                        console.log("GO TO WORK" + workerId)
                        await postData("https://game.worker.town/api/workers/work", {"worker_id": workerId})
                    } else if (worker.working_until != null && Math.floor(new Date(worker.working_until).getTime() / 1000) <= Math.floor(Date.now() / 1000)) {
                        await postData("https://game.worker.town/api/workers/work/callback", {"worker_id": workerId})
                        console.log("GO TO RESTING" + workerId)
                        await postData("https://game.worker.town/api/workers/rest", {
                            "worker_id": workerId,
                            "house_id": 5990,
                            "slot": 1
                        })
                    } else if (worker.working_until != null && Math.floor(new Date(worker.working_until).getTime() / 1000) >= Math.floor(Date.now() / 1000)) {
                        if (Math.floor(new Date(worker.shift.shift_1_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && worker.shift.shift_1_eaten === 0) {
                            await postData('https://game.worker.town/api/workers/feed', {
                                "worker_id": workerId,
                                "shift": 1
                            })
                            console.log("SHIFT 1 |" + workerId)
                        } else if (Math.floor(new Date(worker.shift.shift_2_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && worker.shift.shift_2_eaten === 0) {
                            await postData('https://game.worker.town/api/workers/feed', {
                                "worker_id": workerId,
                                "shift": 2
                            })
                            console.log("SHIFT 2 |" + workerId)
                        } else if (Math.floor(new Date(worker.shift.shift_3_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && worker.shift.shift_3_eaten === 0) {
                            await postData('https://game.worker.town/api/workers/feed', {
                                "worker_id": workerId,
                                "shift": 3
                            })
                            console.log("SHIFT 3 |" + workerId)
                        } else if (Math.floor(new Date(worker.shift.shift_4_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && worker.shift.shift_4_eaten === 0) {
                            await postData('https://game.worker.town/api/workers/feed', {
                                "worker_id": workerId,
                                "shift": 4
                            })
                            console.log("SHIFT 4 |" + workerId)
                        }
                    }
                    if (worker.resting_until != null && Math.floor(new Date(worker.resting_until).getTime() / 1000) >= Math.floor(Date.now() / 1000)) {
                        console.log(workerId + " RESTING !")
                    } else if (worker.working_until != null && Math.floor(new Date(worker.working_until).getTime() / 1000) >= Math.floor(Date.now() / 1000)) {
                        if (worker.shift.shift_1_eaten === 0) {
                            console.log(workerId + " WORKING ! | SHIFT 1")
                        } else if (worker.shift.shift_2_eaten === 0) {
                            console.log(workerId + " WORKING ! | SHIFT 1")
                        } else if (worker.shift.shift_3_eaten === 0) {
                            console.log(workerId + " WORKING ! | SHIFT 2")
                        } else if (worker.shift.shift_4_eaten === 0) {
                            console.log(workerId + " WORKING ! | SHIFT 3")
                        } else {
                            console.log(workerId + " WORKING ! | SHIFT 4")
                        }
                    } else {
                        console.log(workerId + "IDLE")
                    }
                }
            });

        console.log("WAITING 10 MINUTES | CHECKED TIME => " + new Date().toLocaleString("tr-TR", {timeZone: 'Europe/Istanbul'}));
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