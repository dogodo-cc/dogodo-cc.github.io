export const base64Reg = /^[\s\S]*data:[a-z]+\/[a-z0-9-+.]+;base64,[\s\S]*$/;

// 金额校验（最多可以有两位小数）
export const amountReg = /^[0-9]+(.[0-9]{1,2})?$/;
