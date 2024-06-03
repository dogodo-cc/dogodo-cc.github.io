export const eventMap = {
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

export function renameFileWithSuffix(originalFileName, suffix) {
    // 使用lastIndexOf方法找到最后一个.的位置，从而确定扩展名的起始位置
    const dotPosition = originalFileName.lastIndexOf('.');

    // 如果找到了扩展名（"."的位置不为-1），则分别处理前后两部分
    if (dotPosition !== -1) {
        // 获取文件名部分（不包括扩展名）
        const namePart = originalFileName.substring(0, dotPosition);
        // 获取扩展名部分（包括点）
        const extensionPart = originalFileName.substring(dotPosition);

        // 返回新文件名：原始名+后缀+扩展名
        return `${namePart}${suffix}${extensionPart}`;
    } else {
        // 如果没有找到扩展名，直接在末尾添加后缀
        return `${originalFileName}${suffix}`;
    }
}

export function download(url, filename) {
    const a = document.createElement('a');
    a.download = renameFileWithSuffix(filename, '-空号检测完成');
    a.href = url;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
}

export async function fetchPost(url = '', data = {}) {
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

export const regTelString = /(电话|手机｜)/;
export const regTel = /^1[3-9]\d{9}$/;

// 通过第一行 或者 第二行的数据 判断出手机号码是在第几列
export function getTelIndex(firstRow = [], secondRow = []) {
    let index = firstRow.findIndex((v) => regTelString.test(v.trim()));
    if (index === -1) {
        index = secondRow.findIndex((v) => regTel.test(v));
    }
    return index;
}

export const codeMap = {
    0: '空号',
    1: '实号',
    2: '停机号',
    3: '库无',
    4: '沉默号',
    5: '风险号',
};
