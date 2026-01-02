import { createSuksDir } from './util/dataStore';

export default {
    onCreate() {
        console.info('Application onCreate');

        createSuksDir();
    },
    onDestroy() {
        console.info('Application onDestroy');
    }
};
