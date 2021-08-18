const express = require('express');
const app = express();
const http = require('http');
const server = http.createServer(app);

const { orderObject } = require('./src/components/orderObject');

const fs = require('fs')
const createHTML = require('create-html');

const qr = require("qrcode");
// const Barc = require('barcode-generator');
// const barc = new Barc()
const JsBarcode = require('jsbarcode');
const initIndexHtml = async() => {
    const body = await makeDeliverySlip_body()
    const html = createHTML({
        title: 'Delivery_Slip',
        head: makeDeliverySlip_header(),
        body: body,
    })
    fs.writeFile('index.html', html, function (err) {
        if (err) console.log(err)
    })
}

const generateQrCode = (url) => 
    new Promise((resolve, rejected) => 
        qr.toDataURL(url, (err, src) => {
            if(err) 
                return rejected(err)
            return resolve(src)
        })
);

const getBarcode = (id) => {
    console.log("really?", id)
    const { createCanvas } = require('canvas')
    const canvas = createCanvas(200, 200)
    JsBarcode(canvas, id)
    console.log(canvas)
    return canvas.toDataURL("image/png");
}

// var buf = barc.code128('6905', 300, 200);
// fs.writeFile(__dirname + '/example.png', buf, function(){
//     console.log('wrote it');
// });

initIndexHtml()

server.listen(3000, () => {
    console.log('listening on *:3000');
});

function makeDeliverySlip_header() {
    return `
        <meta charset="UTF-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Delivery Slip</title>
        
        <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/css/bootstrap.min.css">
        
        <link rel="stylesheet" href="https://use.fontawesome.com/releases/v5.6.3/css/all.css" integrity="sha384-UHRtZLI+pbxtHCWp1t77Bi1L4ZtiqrqD80Kn4Z8NTSRyMA2Fd33n5dQ8lWUE00s/" crossorigin="anonymous">
        
        <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.5.1/jquery.min.js"></script>
        
        <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.16.0/umd/popper.min.js"></script>
        
        <script src="https://maxcdn.bootstrapcdn.com/bootstrap/4.5.2/js/bootstrap.min.js"></script>

        <script src="https://cdnjs.cloudflare.com/ajax/libs/jsbarcode/3.11.0/JsBarcode.all.min.js"></script>
    `
}

async function makeDeliverySlip_body() {

    let orderRows = "";
    for(const i in orderObject.products) {
        const item = orderObject.products[i] 
        let qr;
        try {
            qr = await generateQrCode(`https://svane-el.dk/${item.number}`)
        } catch (error) {
            qr = ""
        }

        orderRows += `<tr>
            <td style="width: 15%; text-align: center; vertical-align: middle;">
                <img src="${qr}" alt="Qr code">
            </td>
            <td style="width: 15%; text-align: center; vertical-align: middle;">
                <img style="width: 80px; height: 80px;" src="${item.imgUrl}" alt="">
            </td>
            <td style="width: 15%; text-align: center; vertical-align: middle;">
                ${item.number}
            </td>
            <td style="width: 15%; text-align: center; vertical-align: middle;">
                ${item.name}
            </td>
            <td style="width: 15%; text-align: center; vertical-align: middle;">
                ${item.qty}
            </td>
        </tr>`
    }

    return  `
        <div style="width: 1240px; height: 100%; position: absolute; top: 0; left: 0; right: 0; bottom: 0;
            margin-left: 175px;"
            class="container-fluid">

            <div style="padding: 170px 120px 30px 100px;">
                <div class="row">
                    <div class="col-8">
                        <img src="./Screenshot_3.jpg" alt="">
                    </div>
                    <div class="col-4" style="margin-top: -30px; position: absolute; right: -40px; line-height: 15px;">
                        <h4><b>FØLGESEDDEL</b></h4>
                        <p>ORDRE # / <b>${orderObject.order.orderId}</b></p>
                        <p>ORDRE DATO / ${orderObject.order.orderDate}</p>
                    </div>
                </div>
                <br><br><br>
                <div class="row">
                    <div class="col-4" style="line-height: normal;">
                        <h5 style="font-weight: bold;">FAKTURERET TIL</h5>
                        <p>${orderObject.invoiceAdress.company}</p>
                        <p>${orderObject.invoiceAdress.name}</p>
                        <p>${orderObject.invoiceAdress.address}</p>
                        <p>${orderObject.invoiceAdress.city} - ${orderObject.invoiceAdress.zip}</p>
                    </div>
                    <div class="col-4" style="line-height: normal;">
                        <h5 style="font-weight: bold;">SENDT TIL</h5>
                        <p>&nbsp;</p>
                        <p>${orderObject.shippingAdress.name}</p>
                        <p>${orderObject.shippingAdress.address}</p>
                        <p>${orderObject.shippingAdress.city} - ${orderObject.shippingAdress.zip}</p>
                    </div>
                    <div class="col-4" style="line-height: normal;">
                        <h5 style="font-weight: bold;">FORSENDELSE</h5>
                        <p><i>${orderObject.order.courier}</i></p>
                    </div>
                </div>
                <br><br><br>
                <div class="row">
                    <div class="col-12" style="height: 100%;">
                        <table class="table table-borderless" style="border-top: 5px solid black;">
                            <thead>
                                <th style="text-align: center;"></th>
                                <th style="text-align: center;">BILLEDE</th>
                                <th style="text-align: center;">VARE NR.</th>
                                <th style="text-align: center;">VARE NAVN</th>
                                <th style="text-align: center;">ANTAL</th>
                            </thead>
                            <tbody>
                                ${orderRows}
                            </tbody>
                        </table>
                    </div>
                </div>

                <hr><br><br><br><br><br><br><br><br>

                <div class="row">
                    <div class="col-12">
                        <p style="text-align: center; font-weight: bold; font-size: 25px;">FIND MANUALER OG PRODUKT VIDEOER PÅ VORES HJEMMESIDE</p>
                        <a href="https://svane-el.dk/en/" style="text-decoration: none;">
                            <p style="font-size: 25px; text-align: center; font-weight: bold; color: #212529;">WWW.SVANE-EL.DK</p>
                        </a>
                        <div class="row">
                            <div class="col-6" style="border-right: 1px solid gray;">
                                <div style="float: right;">
                                    <p>Svane Eletronic ApS</p>
                                    <p>Arildsvej 27</p>
                                    <p>7442 Engesvang</p>
                                    <p>CVR 10320305</p>
                                </div>
                            </div>
                            <div class="col-6" style="border-left: 1px solid gray;">
                                <div style="float: left;">
                                    <p><i class="fa fa-phone" style="font-size: 35px;"></i> <span>&nbsp;+45 70 25 30 10</span></p>
                                    <p><i class="fa fa-envelope" style="font-size: 35px;"></i>
                                        <a href="mailto:kunde@svane-el.com"  style="text-decoration: none;">
                                            <span  style="font-size: 1rem; text-align: center; font-weight: bold; color: #212529;">&nbsp;kunde@svane-el.com</span>
                                        </a>
                                    </p>
                                    <p><i class="fab fa-facebook-f" style="font-size: 35px;"></i>
                                        <a href="https://facebook.com/ssihuset"  style="text-decoration: none;">
                                            <span  style="font-size: 1rem; text-align: center; font-weight: bold; color: #212529;">&nbsp;&nbsp;&nbsp;&nbsp;https://facebook.com/ssihuset</span>
                                        </a>
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <br>
                <div class="row">
                    <div class="col-12" style="text-align: center;">
                        
                        <img src=${getBarcode(orderObject.order.orderId)} style="width: 200px; height: 100px"/>
                    </div>
                </div>
            </div>
        </div>
    `
}