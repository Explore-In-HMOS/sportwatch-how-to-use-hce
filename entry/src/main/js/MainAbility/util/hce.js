import { deleteSuk, getCard, getNextSuk, hasCard, numberOfSuks } from './dataStore';
import cardEmulation from '@ohos.nfc.cardEmulation';
import router from '../common/js/router';

// TODO: this must match with config.json
const paymentAid = [
    '325041592E5359532E4444463031',
    'A0000000031010',
    'A0000000041010'
];

let card;
let sukIndex;
let sukData;

function initialize() {
    card = getCard();
    let { index, suk } = getNextSuk();
    sukIndex = index;
    sukData = suk;
    console.info(`initialize | ${JSON.stringify(card)} | ${sukIndex} | ${JSON.stringify(sukData)}`);
}

export function deleteHce() {
    card = sukIndex = sukData = null;
}

export function hce() {
    if (!card && hasCard()) {
        console.info('initialize');
        initialize();
    }

    let hce = new cardEmulation.HceService();
    hce.stop('com.hmosdemos.hcepaymentlite');
    hce.start('com.hmosdemos.hcepaymentlite', paymentAid);

    hce.on('hceCmd', async (data, err) => {
        console.info(`hceCmd: ${data}`);

        if (err) {
            console.error(err);
            throw new Error('Error!');
        }

        if (card && sukData) {
            console.info('make payment');
            // TODO: make payment
            // Basically payment is just a communication with the POS machine.
            // You just need to know what to send.
            // GOOD LUCK :)

            // send a dummy response
            const response = [0x47, 0x4F, 0x4F, 0x44, 0x20, 0x4C, 0x55, 0x43, 0x4B, 0x20, 0x3A, 0x29, 0x90, 0x00];
            hce.transmit(response, () => {
            });

            // simulate success
            // delete last suk
            deleteSuk(sukIndex);
            deleteHce();
            console.info(`payment success remaining suk: ${numberOfSuks()}`);

            // route to success page
            router.go('pages/cardTransferSuccess/cardTransferSuccess', { sukCount: numberOfSuks() });
        } else if (card) {
            console.info('route to no suk');
            // route to no suk page
            router.go('pages/noSuk/noSuk');
        } else {
            console.info(`no card | no suk | ${JSON.stringify(card)} | ${JSON.stringify(sukData)}`);
        }
    });
}