const orderObject = {
    order: {
        orderId: '6905',
        orderDate: '2021-08-10',
        courier: 'Postnord Med Omdeling'
    },

    invoiceAdress: {
        company: 'B.E. INSTALLATION',
        name: 'Mads Dam',
        phone: '+45 52240215',
        address: 'Lundvej 50',
        city: 'Viborg',
        zip: 8800
    },

    shippingAdress: {
        company: 'B.E. INSTALLATION',
        name: 'Mads Dam',
        phone: '+45 52240215',
        address: 'Lundvej 50',
        city: 'Viborg',
        zip: 8800
    },

    products: [
        {
            imgUrl: 'https://svane-el.dk/456-medium_default/dobbelt-relae-12v-transistorstyret-forside-20002222.jpg',
            number: '20002222',
            name: 'DOBBELT RELÆ 12V TRANSISTORSTYRET',
            qty: 5
        },
        {
            imgUrl: 'https://svane-el.dk/1223-medium_default/klaebefdder-2mm-25-stk-tilbehr-20008224.jpg',
            number: '20008224',
            name: 'KLÆBEFØDDER 2MM 25 STK',
            qty: 4
        }
    ]
}

exports.orderObject = orderObject;