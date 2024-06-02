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
