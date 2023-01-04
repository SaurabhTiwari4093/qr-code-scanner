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

const qrScanApi = async (data) => {
    showLoader.style.display = 'flex';
    if (data.eventName === '') {
        showLoader.style.display = 'none'
        swal({
            title: "Event is not selected",
            text: `Decoded Text : ${data.studentEmail}`,
            icon: "info",
        })
    }
    else {
        try {
            const formData = {
                eventName: data.eventName,
                studentEmail: data.studentEmail,
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
                            text: `Decoded Text : ${data.studentEmail}`,
                            icon: "success",
                        })
                    }
                    else {
                        showLoader.style.display = 'none'
                        swal({
                            title: data.message,
                            text: `Decoded Text : ${data.studentEmail}`,
                            icon: "error",
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
    var lastResult, countResults = 0;
    function onScanSuccess(decodedText, decodedResult) {
        if (decodedText !== lastResult) {
            ++countResults;
            lastResult = decodedText;

            // Handle on success condition with the decoded message.
            console.log(`Scan result ${decodedText}`, decodedResult);
            const requestData = {
                eventName: "InaugrationSession",
                studentEmail: decodedText,
            }
            qrScanApi(requestData);
        }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
});