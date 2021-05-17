$(document).ready(function () {
    listele();
});

var counter = 0;
var currDevices;

function izinIste() {
    navigator.usb.requestDevice({ filters: [] }).then(devices => { currDevices = devices });
}

async function SecileneIzinIste(_vendorId) {
    $("#secilen").html("Seçilen Cihaz VendorId: " + _vendorId);
    let device;

    navigator.usb.requestDevice({ filters: [{ vendorId: _vendorId }] })
        .then(selectedDevice => {
            device = selectedDevice;
            return device.open(); // Begin a session.
        })

        .then(() => device.selectConfiguration(1)) // Select configuration #1 for the device. // bakılacak
        .then(() => device.claimInterface(2)) // Request exclusive control over interface #2. // bakılacak
        .then(() => device.controlTransferOut({
            requestType: 'class',
            recipient: 'interface',
            request: 0x22,
            value: 0x01,
            index: 0x02
        })) // Ready to receive data
        .then(() => device.transferIn(5, 64)) // Waiting for 64 bytes of data from endpoint #5. // dinamik veri alınabilir mi?
        .then(result => {
            const decoder = new TextDecoder();
            console.log('Received: ' + decoder.decode(result.data));
            alert('Received: ' + decoder.decode(result.data));
        })
        .catch(error => { console.error(error); });

}


async function listele() {
    $("#devices").html("");
    $("#algilanan").html("Okunuyor...");
    counter = 0;
    navigator.usb.getDevices().then(function (devices) {
        devices.forEach(device => {
            $("#devices").append(""
                + "<tr> <td class='p-1'>" + counter++
                + "</td><td class='p-1'>  " + " <button class='btnSec btn btn-sm btn-info' onclick=SecileneIzinIste(" + device.vendorId + ")> Seç</button>"
                + "</td><td class='p-1'>  " + device.productName
                + "</td><td class='p-1'>  " + device.vendorId
                + "</td><td class='p-1'> " + device.serialNumber
                + "</td><td class='p-1'> " + device.manufacturerName
                + "</td><td class='p-1'> " + device.productId + "</td></tr>");
        });
        $("#algilanan").html("Algılanan: " + counter);

    });


}


navigator.usb.addEventListener('connect', event => {
    izinIste()
});

navigator.usb.addEventListener('disconnect', event => {
    alert("Cihaz Ayrıldı");
});