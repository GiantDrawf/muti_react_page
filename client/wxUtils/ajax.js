const creatXhr = function creatXhr() {
    if (typeof XMLHttpRequest !== 'undefined') {
        return new XMLHttpRequest();
    } else if (typeof ActiveXObject !== 'undefined') {
        if (typeof creatXhr.activeXString !== 'string') {
            const versions = ['MSXML2.XMLHttp.6.0', 'MSXML2.XMLHttp.3.0', 'MSXML2.XMLHttp'];

            for (const key of versions) {
                try {
                    /* eslint-disable no-undef */
                    new ActiveXObject(key);
                    /* eslint-enable no-undef */
                    creatXhr.activeXString = key;
                    break;
                } catch (e) {
                    console.log(e);
                }
            }
        }

        /* eslint-disable no-undef */
        return new ActiveXObject(creatXhr.activeXString);
        /* eslint-enable no-undef */
    } else {
        throw new Error('不支持 XMLHttpRequest');
    }
};

let timestampIndex = 0;

/**
 * 创建一个ajax请求，该请求返回一个promise对象
 * @param {String} url 请求地址
 * @param {Object} options 扩展参数，参数内容如下
 *   @param {Object} data 需要传给服务器的参数，
 *   注意：参数会进行encodeURIComponent编码
 *   @param {String} type ajax 请求类别 默认为 get，可选值为 get | post
 *   @param {String} dataType ajax 返回值类型，默认为 json，可选值为 json | text
 *   @param {Number || Boolean} cache 只能是数字类型，如果是false，则不会拼接该参数
 *   @param {Number} timeout 超时时间，默认为60000毫秒
 *   @param {Number} benchmarkTime api请求基准时间，默认为1000毫秒
 *   @param {Boolean} async 请求是否异步，默认为true，异步请求，一般不建议改动该值
 */
export default function(
    url,
    {
        data = {},
        type = 'get',
        dataType = 'json',
        cache = `${new Date().valueOf()}${timestampIndex++}`,
        timeout = 60000,
        async = true,
    } = {},
) {
    return Promise.race([
        new Promise((resolve, reject) => {
            const xhr = creatXhr();

            // 对参数进行处理
            const params = [];

            if (typeof data === 'object') {
                for (const key of Object.keys(data)) {
                    params.push(`${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`);
                }
            } else {
                reject(new Error('typeError|data必须为一个对象'));

                return;
            }

            const caches = [];

            if (cache) {
                caches.push(`_=${cache}`);
            }

            if (type.toLocaleLowerCase() === 'get') {
                if (url.includes('?')) {
                    url = `${url}&${[...params, ...caches].join('&')}`;
                } else {
                    url = `${url}?${[...params, ...caches].join('&')}`;
                }
            } else if (url.includes('?')) {
                url = `${url}&${caches.join('&')}`;
            } else {
                url = `${url}?${caches.join('&')}`;
            }

            xhr.open(type, url, async);
            if (type.toLocaleLowerCase() === 'post') {
                xhr.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded');
            }
            xhr.onreadystatechange = () => {
                if (xhr.readyState === 4) {
                    if ((xhr.status >= 200 && xhr.status < 300) || xhr.status === 304) {
                        switch (dataType) {
                            case 'json':
                                try {
                                    const result = new Function(`return ${xhr.responseText}`)();

                                    if (typeof result === 'object') {
                                        resolve(result);
                                    } else {
                                        reject(
                                            new Error(
                                                `typeError|json 不是对象|${encodeURIComponent(xhr.responseText)}`,
                                            ),
                                        );
                                    }
                                } catch (e) {
                                    reject(
                                        new Error(`typeError|json 解析错误|${encodeURIComponent(xhr.responseText)}`),
                                    );
                                }
                                break;
                            default:
                                resolve(xhr.responseText);
                        }
                    } else {
                        reject(new Error(`requestError|请求失败|${xhr.status}`));
                    }
                }
            };
            xhr.send(type.toLocaleLowerCase() === 'get' ? null : params.join('&'));
        }),
        new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error(`timeout|请求超时${timeout}`));
            }, timeout);
        }),
    ]);
}
