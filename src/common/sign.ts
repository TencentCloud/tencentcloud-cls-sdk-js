import * as crypto from "crypto"

let getParamKeylist = function (obj: Map<string, string>) {
    let list = [];
    for(let key of obj.keys()) {
        if (obj.has(key)) {
            list.push(key);
        }
    }

    return list.sort(function (a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a === b ? 0 : (a > b ? 1 : -1);
    });
}

let getHeaderKeylist = function (obj: Map<string, string>) {
    let list = [];

    for(let key of obj.keys()) {
        var lowerKey = key.toLowerCase();
        if (obj.has(key) && (lowerKey === "content-type" || lowerKey === "content-md5" || lowerKey === "host" || lowerKey[0] === 'x')) {
            list.push(key);
        }
    }
    
    return list.sort(function (a, b) {
        a = a.toLowerCase();
        b = b.toLowerCase();
        return a === b ? 0 : (a > b ? 1 : -1);
    });
}

let camSafeUrlEncode = function (str: string) {
    return encodeURIComponent(str)
        .replace(/!/g, '%21')
        .replace(/'/g, '%27')
        .replace(/\(/g, '%28')
        .replace(/\)/g, '%29')
        .replace(/\*/g, '%2A');
}


let map2str = function (obj: Map<string, string>, getKeylist: Function) {
    var i, key, val;
    var list = [];
    var keyList = getKeylist(obj);
    for (i = 0; i < keyList.length; i++) {
        key = keyList[i];
        val = (obj.get(key) === undefined) ? '' : ('' + obj.get(key));
        key = key.toLowerCase();
        key = camSafeUrlEncode(key);
        val = camSafeUrlEncode(val) || '';
        list.push(key + '=' + val)
    }
    return list.join('&');
}


export function signature(secretId: string, secretKey: string, method: string, path: string, params: Map<string, string>, headers: Map<string, string>, expire: number): string {
    // 签名有效起止时间
    let now = Math.floor(Date.now()/1000);
    let exp = now + expire;
    now = now - 60;

    // 要用到的 Authorization 参数列表
    let qSignAlgorithm = 'sha1';
    let qAk = secretId;
    let qSignTime = now + ';' + exp;
    let qpathTime = qSignTime;
    let qHeaderList = getHeaderKeylist(headers)?.join(';').toLowerCase();
    let qUrlParamList = getParamKeylist(params)?.join(';').toLowerCase();

    // 步骤一：计算 Signpath
    let signpath = crypto.createHmac('sha1', secretKey).update(qpathTime).digest('hex');

    // 步骤二：构成 FormatString
    var formatString = [method.toLowerCase(), path, map2str(params, getParamKeylist), map2str(headers, getHeaderKeylist), ''].join('\n');

    // 步骤三：计算 StringToSign
    var res = crypto.createHash('sha1').update(formatString).digest('hex');
    var stringToSign = ['sha1', qSignTime, res, ''].join('\n');

    // 步骤四：计算 Signature
    var qSignature = crypto.createHmac('sha1', signpath).update(stringToSign).digest('hex');

    // 步骤五：构造 Authorization
    var authorization = [
         'q-sign-algorithm=' + qSignAlgorithm,
         'q-ak=' + qAk,
         'q-sign-time=' + qSignTime,
         'q-key-time=' + qpathTime,
         'q-header-list=' + qHeaderList,
         'q-url-param-list=' + qUrlParamList,
         'q-signature=' + qSignature
    ].join('&');

    return authorization;
}


