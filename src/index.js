import Quagga from 'quagga'; // ES6

const makeBox = (boxe, canvas, color) => {
    if (color == undefined) {
        color = "#FF5733"
    }

    const ctxReact = canvas.getContext("2d");
    ctxReact.lineWidth = 2;
    ctxReact.strokeStyle = color;

    const createLine = (form, to) => {
        ctxReact.beginPath();
        ctxReact.moveTo(form[0], form[1]);
        ctxReact.lineTo(to[0], to[1])
        ctxReact.stroke();
    };

    createLine(boxe[0], boxe[1]);
    createLine(boxe[1], boxe[2]);
    createLine(boxe[2], boxe[3]);
    createLine(boxe[3], boxe[0]);

    const colors = [
        "red",
        "yellow",
        "blue",
        "green",
    ];

    const ctxPoint = canvas.getContext("2d");

    boxe.forEach((point, index) => {
        ctxPoint.beginPath();
        ctxPoint.fillStyle = colors[index];
        ctxPoint.fillRect(point[0], point[1], 5, 5);
        ctxPoint.stroke();
    })
};

const handleProcessed = result => {
    const canvas = document.querySelector("#reader canvas");
    canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);

    if (result) {
        result.boxes.forEach(boxe => makeBox(boxe, canvas));
    }
};

Quagga.init({
    inputStream : {
        name : "Live",
        type : "LiveStream",
        target: document.querySelector('#reader')    // Or '#reader' (optional)
    },
    decoder : {
        readers : [
            "code_128_reader"
        ]
    }
}, function(err) {
    if (err) {
        console.log(err);
        return
    }
    console.log("Initialization finished. Ready to start");
    Quagga.start();
    Quagga.onProcessed(handleProcessed)
    Quagga.onDetected((result) => {
        if(result.codeResult) {
            document.getElementById('result').innerText = result.codeResult.code;
            console.log("result", result.codeResult);
            console.log("result", result);
            makeBox(result.box, document.querySelector("#reader canvas"), "green")
        } else {
            console.log("not detected");
        }
    })
});
