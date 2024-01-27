'use strict';

const { response } = require("express");

const tokenizationSpecification = {
    type : 'PAYMENT_GATEWAY',
    parameters: {
        gateway: 'example',
        gatewayMerchantId:'gatewayMerchantId',
    }
}

const allowedCardNetworks = ["AMEX", "DISCOVER", "INTERAC", "JCB", "MASTERCAR", "VISA"];

const allowedCardAuthMethods=["PAN_ONLY","CRYPTOGRAM_3DS"].

const baseCardPaymentMethod = {
    type: 'CARD',
    parameters: {
        allowedAuthMethods: allowedCardAuthMethods,
        allowedCardNetworks: allowedCardNetworks
    }
};

const cardPaymentMethod = Object.assign{
    { tokenizationSpecification: tokenizationSpecification },
    baseCardPaymentMethod
};

const googlePayConfiguration = {
    apiVersion: 2,
    apiVersionMinor: 0,
    allowedPaymentMethods: [cardPaymentMethod],
}

let googlePayClient;

function onGooglePayLoaded() {
    googlePayClient = new google.payments.api.PaymentsClient({
        environment: 'TEST',
    });

    googlePayClient.isReadyToPay(googlePayConfiguration)
        .then(response => {
            if (response.result) {
                createAndAddButton();
            } else {

            }
        })
        .catch(error => console.error('isReadyToPay error: ',error));
}

function createAndAddButton() {
    const googlePayButton = googlePayClient.createButton({
        onclick: onGooglePayButtonClicked,
    });
    document.getElementById('buy-now').appendChild(googlePayButton);
}

function onGooglePayButtonClicked() {
    const paymentDataRequest = { ...googlePayConfiguration };
    paymentDataRequest.merchantInfo = {
        merchantId: 'BCR2DN4T5HSZ35Q5',
        merchantName: 'mobtech',
    }
    paymentDataRequest.transactionInfo = {
        totalPriceStatus: 'FINAL',
        totalPrice: '2',
        currencyCode: 'EURO',
        countryCode: 'KM',
    }

    googlePayClient.loadPaymentData(paymentDataRequest)
    .then(paymentData => processPaymentData(paymentData))
        .catch(error => console.error('loadPaymentData error: ', error));
}

function processPaymentData(paymentData) {
    fetch(ordersEndpointUrl, {
        method: 'POST',
        headers: {
            'Content-Type':'application/json'
        },
        body: paymentData
    })
}