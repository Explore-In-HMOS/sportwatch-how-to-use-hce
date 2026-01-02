import router from '@ohos.router';

export default {
    /**
     * go('pages/page/page', { param: 'param' })
     */
    go(to, params) {
        router.replace({
            uri: to,
            params: params
        });
    }
};