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

var jsonData = [];
const getJsonData = async () => {
    await fetch("assets/json/registrations.json")
        .then((response) => response.json())
        .then((json) => {
            console.log(json)
            jsonData = json;
        });
}

const showLoader = document.getElementById('showLoader');
getJsonData();

const qrScanApi = async (decodedText, scanObject) => {
    showLoader.style.display = 'flex';
    if (eventName === 'none') {
        showLoader.style.display = 'none';
        swal({
            title: "Event is not selected",
            text: `Decoded Text : ${decodedText} \n`,
            icon: "info",
        }).then(() => {
            scanObject.lastResult = undefined;
            scanObject.countResults = 0;
        })
    }
    else {
        try {
            var i;
            var studentDetails;
            for (i = 0; i < jsonData.length; i++) {
                studentDetails = jsonData[i];
                if (studentDetails.email === decodedText) {
                    showLoader.style.display = 'none';
                    break;
                }
            }
            if (i === jsonData.length) {
                showLoader.style.display = 'none'
                swal({
                    title: `Email address not found`,
                    text: `Decoded text : ${decodedText}`,
                    icon: "error",
                }).then(() => {
                    scanObject.lastResult = undefined;
                    scanObject.countResults = 0;
                })
            }
            else{
                swal({
                    title: `Name : ${studentDetails.name}`,
                    text: `Email : ${studentDetails.email} \n Mobile : ${studentDetails.mobile} \n Institute : ${studentDetails.institute}`,
                    icon: "success",
                }).then(() => {
                    scanObject.lastResult = undefined;
                    scanObject.countResults = 0;
                })
            }
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
            qrScanApi(decodedText, scanObject);
        }
    }

    var html5QrcodeScanner = new Html5QrcodeScanner(
        "qr-reader", { fps: 10, qrbox: 250 });
    html5QrcodeScanner.render(onScanSuccess);
});