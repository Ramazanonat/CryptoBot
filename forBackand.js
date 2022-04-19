import fetch from 'node-fetch';

while (true) {
    await fetch("https://game.worker.town/api/workers", {
        headers: {
            "Host": "game.worker.town",
            "User-Agent": "Mozilla/5.0 (X11; Linux x86_64; rv:99.0) Gecko/20100101 Firefox/99.0",
            "Accept": "*/*",
            "Accept-Language": "tr-TR,tr;q=0.8,en-US;q=0.5,en;q=0.3",
            "Accept-Encoding": "gzip, deflate, br",
            "Referer": "https://game.worker.town/tavern",
            "Connection": "keep-alive",
            "Cookie": "_ga_P9DQW7WC46=GS1.1.1650330004.4.0.1650330005.0; _ga=GA1.1.654598011.1650089324; XSRF-TOKEN=eyJpdiI6Ii84NFFwODExZ094eE9ocitDNmRkT3c9PSIsInZhbHVlIjoiTDA3QVloUStHMlowRjcwT0J4UEVvbUhzMzEzMFJPUWJsclNJOFkvY1RWbmVRWVN1TmVmQ1ZaRDN1Tmdkc0xxbTN2SWI2OFVSTnVjeTRid242U2xvNy92K2xnbW1DYXJrRWJXT2pRaHVKYTVzMEMxTjM4WmhNeG1zN1BJbGd4OUUiLCJtYWMiOiI2ZWFjMTI3NTM2NjhlODI4OGQ3NmVjNzk0ZDg0ZjViYTAxYzkxN2QzODIxMTA4NTFjMThjNTBmNzI5MmM0N2NmIiwidGFnIjoiIn0%3D; workertown_session=eyJpdiI6IllmMWdWa3NxUkVuYmdDb2pHenZXMFE9PSIsInZhbHVlIjoiWjU4dXJrU01PS1V0VEdnWk5jVWoxVVhXVEZzZCtOMGh2WXc1MlBPOUpKQlFVYnRvUUlsYzA3enJwdnBZUm9jMm1iQ21mVkltVGV6ZFlMT0NIbkpkR0pwT2JYZ0R5Q01PRlFGNTBYMmkwUTRqNy9ZbTdQa2tKV0RWWUZSV05EUk0iLCJtYWMiOiI0MTU1MjZiZTY0ODNlNzA4NGE2MGFhNWIwZTQ2ODliNjhiMGQ1Zjc5MjI1N2IwYjRhMjRkYjFmZGQ1ODg1OTA2IiwidGFnIjoiIn0%3D",
            "Sec-Fetch-Dest": "empty",
            "Sec-Fetch-Mode": "cors",
            "Sec-Fetch-Site": "same-origin",
            "TE": "trailers"
        }, method: "get", credentials: "same-origin",
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
                console.log("REST")
            } else if (response[0].working_until != null && Math.floor(new Date(response[0].working_until).getTime() / 1000) <= Math.floor(Date.now() / 1000)) {
                await postData("https://game.worker.town/api/workers/rest/callback", {"worker_id": "5284"})
                console.log("WORK")

            } else if (response[0].working_until != null && Math.floor(new Date(response[0].working_until).getTime() / 1000) >= Math.floor(Date.now() / 1000)) {
                console.log("else")
                if (Math.floor(new Date(response[0].shift.shift_1_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && response[0].shift.shift_1_eaten === 0) {
                    await postData('https://game.worker.town/api/workers/feed', {"worker_id": "5284", "shift": 1})
                    console.log("SHIFT 1")
                } else if (Math.floor(new Date(response[0].shift.shift_2_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && response[0].shift.shift_2_eaten === 0) {
                    console.log("SHIFT 2")
                    await postData('https://game.worker.town/api/workers/feed', {"worker_id": "5284", "shift": 2})
                } else if (Math.floor(new Date(response[0].shift.shift_3_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && response[0].shift.shift_3_eaten === 0) {
                    // postData('https://game.worker.town/api/workers/feed', {"worker_id": "5284", "shift": 3})
                    console.log("SHIFT 3")

                } else if (Math.floor(new Date(response[0].shift.shift_4_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && response[0].shift.shift_4_eaten === 0) {
                    // postData('https://game.worker.town/api/workers/feed', {"worker_id": "5284", "shift": 4})
                    console.log("SHIFT 4")
                }
            }
            console.log("30M")
            await sleep(30000);
        });
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
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
            "x-requested-with": "XMLHttpRequest",
            "cookie" :"_ga=GA1.1.1306033600.1650327321; _ga_P9DQW7WC46=GS1.1.1650327320.1.0.1650327321.0; XSRF-TOKEN=eyJpdiI6Iis0QXZJUzZVYUxTa3NQaDV1K0xZUEE9PSIsInZhbHVlIjoiWXIrNUtyQlg1Q1hjN3VIZHpzRHYrL2pIazVQeHhnMW9Ua1JEUDc5OWl3VDd2Lzh3RkVQbEpvRGJxNkJpVURLSDRGU3pkS01RVDFLVStMK01ndFc0SkpVNkpCbW9OZEtVZWV2SkNoeXJBck40dnNSZ2lnSUtVb1hxRjJwc3UyakMiLCJtYWMiOiI0NTkyY2M4ZmZmOGNmMjE3NjMwMWI1OGJkY2YzYzY1N2QwOGIxZWJiYzJmMDg3OWJlNGEwZGI0YzMzZTNjMDdkIiwidGFnIjoiIn0%3D; workertown_session=eyJpdiI6IjlIb1NTZ0JCVTVRRWFDeXFVWFJ3QlE9PSIsInZhbHVlIjoiK1djWSt3VFdxbm9kNDArbE9rNWltYlByM2dMdFMzVE02UU1mZzRiZlBtV0hXVGVqWjI5eW8vKzRzVHdxQjJMSVA4RFdrUysrOHFpZWxVQ2tteGoyR2FZMFFBSWpBa2x2QUpYbTkyZk51MGhlRGlWUzAxUUZrZGVYeUdqL2hXUHAiLCJtYWMiOiJhMTQ2NzM5Yzk1YTUzYWIwNTExOGY1ODVhOGI0MzIwNjJkZTg1ZGUyMmQyZTU0YzJhOWRlYWQ3MDViYmM0ZjUzIiwidGFnIjoiIn0%3D"
        },
        body: JSON.stringify(data)
    });
    return response.json();
}

function sleep(ms) {
    return new Promise((resolve) => {
        setTimeout(resolve, ms);
    });
}