function sleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

async function postData(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST', // *GET, POST, PUT, DELETE, etc.
        headers: {
            'x-csrf-token': csrfToken,
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data) // body data type must match "Content-Type" header
    });
    console.log(response);

    return response.json(); // parses JSON response into native JavaScript objects
}


while (true) {
    try {
        const response = await fetch('api/workers/');

        if (!response.ok) {
            throw new Error(`Error! status: ${response.status}`);
        }
        const result = await response.json();
        if (result[0].resting_until == null && result[0].working_until == null) {
            postData("api/workers/work", {"worker_id": "5284"})
            console.log("IDLE")
            sleep(5000)
        } else if (result[0].resting_until != null && Math.floor(new Date(result[0].resting_until).getTime() / 1000) <= Math.floor(Date.now() / 1000)) {
            postData("api/workers/rest/callback", {"worker_id": "5284"})
            console.log("REST")
            sleep(5000)
        } else if (result[0].working_until != null && Math.floor(new Date(result[0].working_until).getTime() / 1000) <= Math.floor(Date.now() / 1000)) {
            postData("api/workers/rest/callback", {"worker_id": "5284"})
            console.log("WORK")

            sleep(5000)
        } else if (result[0].working_until != null && Math.floor(new Date(result[0].working_until).getTime() / 1000) >= Math.floor(Date.now() / 1000)) {
            if (Math.floor(new Date(result[0].shift.shift_1_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && result[0].shift.shift_1_eaten == 0) {
                postData("api/workers/feed", {"worker_id": "5284", "shift": 1})
                console.log("SHIFT 1")
                sleep(50000)
            } else if (Math.floor(new Date(result[0].shift.shift_2_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && result[0].shift.shift_2_eaten == 0) {
                postData("api/workers/feed", {"worker_id": "5284", "shift": 2})
                console.log("SHIFT 2")
                sleep(50000)

            } else if (Math.floor(new Date(result[0].shift.shift_3_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && result[0].shift.shift_3_eaten == 0) {
                postData("api/workers/feed", {"worker_id": "5284", "shift": 3})
                console.log("SHIFT 3")
                sleep(50000)

            } else if (Math.floor(new Date(result[0].shift.shift_4_time).getTime() / 1000) <= Math.floor(Date.now() / 1000) && result[0].shift.shift_4_eaten == 0) {
                postData("api/workers/feed", {"worker_id": "5284", "shift": 4})
                console.log("SHIFT 4")
                sleep(50000)

            } else {
                sleep(300000)
            }
        }
        console.log("20M")
        sleep(20000)


    } catch (err) {
        console.log(err);
    }
}