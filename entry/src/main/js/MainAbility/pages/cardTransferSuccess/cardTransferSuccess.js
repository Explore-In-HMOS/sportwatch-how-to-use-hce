import router from '../../common/js/router';

export default {
    data: {
        sukCount: 0
    },
    onInit() {
    },
    goBack(event) {
        if (event.direction === 'right') {
            router.go('pages/index/index');
        }
    }
};
