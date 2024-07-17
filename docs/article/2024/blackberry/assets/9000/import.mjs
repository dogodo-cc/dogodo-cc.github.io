let count = 1;
let str = '';
const vars = [];
while (count < 35) {
    const v = `pic_${count}`;
    str += `import ${v} from './assets/9000/screenshot/${count}.jpg';\n`;
    count++;
    vars.push(v);
}
console.log(str);

const pictures = `const pictures = [${vars.join()}];`;

console.log(pictures);
