async function fetchPost(url = '', data = {}) {
    // Default options are marked with *
    const response = await fetch(url, {
        method: 'POST',
        mode: 'cors', // no-cors, *cors, same-origin
        cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
        credentials: 'same-origin', // include, *same-origin, omit
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
            'X-APISpace-Token': 'cdf18gvycalkmeqnqzqz7tm4xx04e3m0',
        },
        redirect: 'follow', // manual, *follow, error
        referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
        body: Object.entries(data)
            .map(([k, v]) => {
                return `${encodeURIComponent(k)}=${encodeURIComponent(v)}`;
            })
            .join('&'),
    });
    return response.json(); // parses JSON response into native JavaScript objects
}

const regTelString = /(电话|手机｜)/;
const regTel = /^1[3-9]\d{9}$/;

// 通过第一行 或者 第二行的数据 判断出手机号码是在第几列
function getTelIndex(firstRow = [], secondRow = []) {
    let index = firstRow.findIndex((v) => regTelString.test(v.trim()));
    if (index === -1) {
        index = secondRow.findIndex((v) => regTel.test(v));
    }
    return index;
}

const codeMap = {
    0: '空号',
    1: '实号',
    2: '停机号',
    3: '库无',
    4: '沉默号',
    5: '风险号',
};

const eventMap = {
    'read-xlsx-buffer': 'READ_XLSX_BUFFER', // 读取 Excel 文件 通过 buffer
    'read-xlsx-url': 'READ_XLSX_URL', // 读取 Excel 文件 通过 url

    'read-xlsx-success': 'READ_XLSX_SUCCESS', // 读取 Excel 文件成功
    'read-xlsx-failed': 'READ_XLSX_FAILED', // 读取 Excel 文件失败

    'number-check-success': 'NUMBER_CHECK_SUCCESS', // 号码验证成功
    'number-check-update': 'NUMBER_CHECK_UPDATE', // 号码验证进行中
    'number-check-failed': 'NUMBER_CHECK_FAILED', // 号码验证失败

    'create-new-xlsx-start': 'CREATE_NEW_XLSX_START', // 开始创建新的表格
    'create-new-xlsx-update': 'CREATE_NEW_XLSX_UPDATE',
    'create-new-xlsx-done': 'CREATE_NEW_XLSX_DONE', // 完成创建新的表格
};
