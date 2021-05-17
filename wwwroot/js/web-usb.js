$(document).ready(function () {    

});

var counter = 0;

async function oku() {
    navigator.usb.requestDevice({ filters: [] }).then(devices => {});
}

async function listele() {
    $("#devices").html("");
    $("#algilanan").html("Okunuyor...");
    counter = 0;
    navigator.usb.getDevices().then(function (devices) {
        devices.forEach(device => {
            console.log(device);
            $("#devices").append("<tr><td>" + counter++ + " </td><td>  " + device.productName +
                " </td><td> " + device.serialNumber + "</td><td> " + device.manufacturerName + "</td><td> " + device.productId + "</td></tr>");
        });
        $("#algilanan").html("Algılanan: " + counter);

    });
   

}


navigator.usb.addEventListener('connect', event => {
    alert("Cihaz Bağlandı");
});

navigator.usb.addEventListener('disconnect', event => {
    alert("Cihaz Ayrıldı");
});