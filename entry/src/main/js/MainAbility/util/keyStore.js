import storage from '@system.storage';


export function readValue(key) {
    let res;

    storage.get({
        key: key,
        success: function (data) {
            console.info(`readValue success: ${data}`);
            res = data;
        },
        fail: function (data, code) {
            console.error(`readValue fail, code: ${code}, data: ${data}`);
        }
    });

    return res;
}

export function writeValue(key, value) {
    storage.set({
        key: key,
        value: value,
        success: function () {
            console.info(`writeValue success`);
        },
        fail: function (data, code) {
            console.error(`writeValue fail, code: ${code}, data: ${data}`);
        }
    });
}

export function deleteValue(key) {
    storage.delete({
        key: key,
        success: function () {
            console.info(`deleteValue success`);
        },
        fail: function (data, code) {
            console.error(`deleteValue fail, code: ${code}, data: ${data}`);
        }
    });
}


