const { APPID } = require('./base.js');

export default class wxSDK {
    constructor() {
        this.isWeiXin = window.navigator.userAgent.match(/MicroMessenger/i) === 'MicroMessenger';
        this.token = '';
    }

    /**
     * 获取session
     * @param {String} sname session name
     */
    getSession(sname) {
        return sessionStorage.getItem(sname) || '';
    }

    /**
     * 设置session
     * @param {String} sname session name
     * @param {any} value session value
     */
    setSession(sname, value) {
        sessionStorage.setItem(sname, value);

        return false;
    }

    /**
     * 判断用户是否登录
     */
    async isLogin() {
        //
        if (!this.isWeiXin) {
            this.token = 'F8155bc545f84d9652f1012ef2bdfb6ebz3LH07cXh4k1d54OCq58p0cg331iyir8r2Qlzg4E25';

            return Promise.resolve();
        }
        const access_token = this.getSession('access_token');
        const link = window.location.href;

        if (access_token != null && access_token !== '') {
            this.token = access_token;
        } else {
            const tag = link.indexOf('code=') >= 0;

            if (tag) {
                // 存在code，直接获取token
                const obj = {};
                const arr = window.location.search.substring(1).split('&');

                arr.forEach(item => {
                    const p = item.split('=');

                    obj[p[0]] = p[1];
                });
                await this.getAccessToken(obj.code);

                return Promise.resolve();
            } else {
                // 去微信拿code
                this.login(link);

                return Promise.reject();
            }
        }
    }

    /**
     * 微信登录方法
     * @param {URL} url 重定向地址
     */
    login(url) {
        window.location.href = `https://open.weixin.qq.com/connect/oauth2/authorize?appid=${APPID}&redirect_uri=${encodeURI(
            url,
        )}&response_type=code&scope=snsapi_userinfo&state=STATE#wechat_redirect`;
    }

    /**
     *
     * @param {String} code 票据
     */
    async getAccessToken(code) {}
}
