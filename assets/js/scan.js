function docReady(fn) {
    // see if DOM is already available
    if (document.readyState === "complete"
        || document.readyState === "interactive") {
        // call on next available tick
        setTimeout(fn, 1);
    } else {
        document.addEventListener("DOMContentLoaded", fn);
    }
}

const showLoader = document.getElementById('showLoader');
const eventNameDocument = document.getElementById('eventName');

const qrScanApi = async (eventName, decodedText, scanObject) => {
    showLoader.style.display = 'flex';
    if (eventName === 'none') {
        showLoader.style.display = 'none';
        swal({
            title: "Event is not selected",
            text: `Decoded Text : ${decodedText}`,
            icon: "info",
        }).then(() => {
            scanObject.lastResult = undefined;
            scanObject.countResults = 0;
        })
    }
    else {
        try {
            const formData = {
                eventName: eventName,
                studentEmail: decodedText,
            }
            const requestOptions = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(formData)
            }
            const url = `https://becon-edc.azurewebsites.net/api/event/qrScan`;
            await fetch(url, requestOptions)
                .then((response) => response.json())
                .then((data) => {
                    console.log(data)
                    if (data.status === 200) {
                        showLoader.style.display = 'none'
                        swal({
                            title: data.message,
                            text: `Student Name : ${data.studentDetails.studentName} \n Student Email : ${data.studentDetails.studentEmail}`,
                            icon: "success",
                        }).then(() => {
                            scanObject.lastResult = undefined;
                            scanObject.countResults = 0;
                        })
                    }
                    else {
                        showLoader.style.display = 'none'
                        swal({
                            title: data.message,
                            text: `Decoded Text : ${decodedText}`,
                            icon: "error",
                        }).then(() => {
                            scanObject.lastResult = undefined;
                            scanObject.countResults = 0;
                        })
                    }
                })
        }
        catch (error) {
            console.log(error);
        }
    }
}

docReady(function () {
    var resultContainer = document.getElementById('qr-reader-results');
    const scanObject = {
        lastResult: undefined,
        countResults: 0
    }
    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== scanObject.lastResult) {
            ++scanObject.countResults;
            scanObject.lastResult = decodedText;

            // Handle on success condition with the decoded message.
            console.log(`Scan result ${decodedText}`, decodedResult);
            resultContainer.innerText = `Decoded Text : ${decodedText} \n Now searching student in database`;
            const eventName = eventNameDocument.value;
            qrScanApi(eventName, decodedText, scanObject);
        }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
});