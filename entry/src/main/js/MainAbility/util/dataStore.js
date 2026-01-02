import file from '@system.file';
import { deleteValue, writeValue } from './keyStore';

const cardPath = 'internal://app/card.json';

export function addCard(cardData) {
    deleteCard();

    file.writeText({
        uri: cardPath,
        text: JSON.stringify(cardData),
        success: () => {
            console.info('addCard success');

            // store card name in key store for easy access
            writeValue('cardName', cardData.name);
        },
        fail: (data, code) => {
            console.error(`addCard fail, code: ${code}, data: ${data}`);
        }
    });
};

export function deleteCard() {
    file.delete({
        uri: cardPath,
        success: () => {
            console.info('deleteCard success');

            // delete card name from key store
            deleteValue('cardName');
        },
        fail: (data, code) => {
            console.error(`deleteCard fail, code: ${code}, data: ${data}`);
        }
    });

    deleteSuks();
}

export function getCard() {
    let card;

    file.readText({
        uri: cardPath,
        success: (data) => {
            console.info(`getCard success ${data.text}`);

            card = JSON.parse(data.text);
        },
        fail: (data, code) => {
            console.error(`getCard fail, code: ${code}, data: ${data}`);
        }
    });

    console.info(`getCard ${JSON.stringify(card)}`);

    return card;
}

export function hasCard() {
    let hasCard = false;

    file.get({
        uri: cardPath,
        success: (_) => {
            console.info(`hasCard success`);

            hasCard = true;
        },
        fail: (data, code) => {
            console.error(`hasCard fail, code: ${code}, data: ${data}`);
        }
    });

    return hasCard;
}

const suksPath = 'internal://app/suks/';
const sukFileExt = '.json';

function sukUriToIndex(uri) {
    const index = uri.split('.')[0];
    return parseInt(index);
}

function sukIndex(first = false) {
    let result = 0;
    file.list({
        uri: 'internal://app/suks/',
        success: (data) => {
            console.info('sukIndex success');

            if (data.fileList.length !== 0) {
                result = data.fileList.map(suk => suk.uri).map((b) => sukUriToIndex(b))
                    .sort((a, b) => first ? a - b : b - a)[0];
            }
        },
        fail: (data, code) => {
            console.error(`sukIndex fail, code: ${code}, data: ${data}`);
        }
    });
    console.info(`sukIndex: ${result}`);
    return result;
}

function newSukPath() {
    return 'internal://app/suks/' + `${sukIndex() + 1}` + '.json';
}

export function addSuks(suks) {
    for (let i = 0; i < suks.length; i++) {
        const suk = suks[i];

        file.writeText({
            uri: newSukPath(),
            text: JSON.stringify(suk),
            success: () => {
                console.info(`addSuks success ${i}`);
            },
            fail: (data, code) => {
                console.error(`addSuks fail, code: ${code}, data: ${data}`);
            }
        });
    }
}

function deleteSuks() {
    file.rmdir({
        recursive: true,
        uri: 'internal://app/suks/',
        success: () => {
            console.info('deleteSuks success');
        },
        fail: (data, code) => {
            console.error(`deleteSuks fail, code: ${code}, data: ${data}`);
        }
    });

    createSuksDir();
}

export function deleteSuk(index) {
    file.delete({
        uri: suksPath + index + sukFileExt,
        success: () => {
            console.info('deleteSuk success');
        },
        fail: (data, code) => {
            console.error(`deleteSuk fail, code: ${code}, data: ${data}`);
        }
    });
};

export function getNextSuk() {
    const index = sukIndex(true);

    if (index && index !== 0) {
        let suk;

        file.readText({
            uri: suksPath + index + sukFileExt,
            success: (data) => {
                console.info(`getNextSuk success`);

                suk = JSON.parse(data.text);
            },
            fail: (data, code) => {
                console.error(`getNextSuk fail, code: ${code}, data: ${data}`);
            }
        });

        console.info(`getNextSuk ${index} | ${JSON.stringify(suk)}`);
        return { index, suk };
    } else {
        return { index: 0, suk: null };
    }
}

export function numberOfSuks() {
    let sukCount = 0;

    file.list({
        uri: suksPath,
        success: (data) => {
            console.info(`numberOfSuks success`);

            sukCount = data.fileList.length;
        },
        fail: (data, code) => {
            console.error(`numberOfSuks fail, code: ${code}, data: ${data}`);
        }
    });

    console.info(`numberOfSuks: ${sukCount}`);
    return sukCount;
}

export function createSuksDir() {
    file.mkdir({
        uri: suksPath,
        success: () => {
            console.info('createSuksDir success');
        },
        fail: (data, code) => {
            console.error(`createSuksDir fail, code: ${code}, data: ${data}`);
        }
    });
}