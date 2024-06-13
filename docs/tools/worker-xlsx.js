// 经典的导入方式，代码无法共用，采用 type: module 的方式
// self.importScripts('./xlsx.full.min.js');
// self.importScripts('./worker-utils.js');

// https://docs.sheetjs.com/
import * as XLSX from 'xlsx';
import { eventMap, getTelIndex, regTel, codeMap, fetchPost } from './utils';

self.addEventListener(
    'message',
    async function (e) {
        const message = e.data;

        switch (message.type) {
            case eventMap['read-xlsx-buffer']:
                readXlsxFile(message.data);
                break;
            case eventMap['read-xlsx-url']:
                const arrayBuffer = await fetch(message.data).then((res) => res.arrayBuffer());
                readXlsxFile(arrayBuffer);
                break;
            default:
                console.log('未识别的消息类型:', message.type);
        }
    },
    false
);

async function readXlsxFile(data) {
    console.time('===> readxlsx');
    var workbook = XLSX.read(data, { type: 'buffer' });

    var sheetName = workbook.SheetNames[1]; // 获取第几个 sheet
    var sheetData = XLSX.utils.sheet_to_json(workbook.Sheets[sheetName], { header: 1 }); // 转为 json 二维数组

    self.postMessage({ type: eventMap['read-xlsx-success'] });
    console.timeEnd('===> readxlsx');

    const rowHeader = sheetData.shift(); // 第一列是标题，切掉
    const telIndex = getTelIndex(rowHeader, sheetData[0]);
    if (telIndex === -1) {
        console.error('没有找到手机号码的数据');
        return;
    }

    rowHeader.push('号码归属地区');
    rowHeader.push('号码归属运营商');
    rowHeader.push('号码当前状态');

    // 根据状态码划分 sheet
    const newSheets = {
        0: [rowHeader],
        1: [rowHeader],
        2: [rowHeader],
        3: [rowHeader],
        4: [rowHeader],
        5: [rowHeader],
    };

    console.time('===> check');
    const lengthCache = sheetData.length;
    while (sheetData.length > 0) {
        const list = sheetData.splice(0, 450).filter((row) => regTel.test(row[telIndex])); // 把不合法的号码过滤掉

        const mobiles = list.map((row) => row[telIndex]).join(',');

        await fetchPost('http://39.101.76.167:3003/tel-check', { mobiles: mobiles, type: 0 })
            .then((res) => {
                res.data.forEach((result, index) => {
                    newSheets[result.status].push([...list[index], result.area, result.numberType, codeMap[result.status]]);
                });

                self.postMessage({ type: eventMap['number-check-ing'], data: (lengthCache - sheetData.length) / lengthCache });
            })
            .catch((e) => {
                self.postMessage({ type: eventMap['number-check-failed'] });
                console.log(e);
            });
    }
    console.timeEnd('===> check');

    console.time('===> newxlxs');

    const hasData = Object.values(newSheets).some((v) => v.length > 1);
    if (!hasData) {
        console.log('没有新的数据');
        return;
    }

    // 创建一个新的表格，并将所有 sheet 添加到该表格
    self.postMessage({ type: eventMap['create-new-xlsx-start'] });
    const newWorkbook = XLSX.utils.book_new();
    Object.entries(newSheets).forEach(([_sheetName, _sheetData]) => {
        if (_sheetData.length > 1) {
            const worksheet = XLSX.utils.aoa_to_sheet(_sheetData);
            XLSX.utils.book_append_sheet(newWorkbook, worksheet, codeMap[_sheetName]);
            self.postMessage({ type: eventMap['create-new-xlsx-update'] });
        }
    });

    // https://docs.sheetjs.com/docs/demos/bigdata/worker/#creating-a-local-file
    const u8 = XLSX.write(newWorkbook, { bookType: 'xlsx', type: 'buffer', compression: true }); // xlsb 的内存更小，但是不知道为什么在 mac 的wps 打开失败

    const newXlsxUrl = URL.createObjectURL(new Blob([u8]));
    // 通知主进程进行下载
    self.postMessage({
        type: eventMap['create-new-xlsx-done'],
        data: newXlsxUrl,
    });
    console.timeEnd('===> newxlxs');
}
