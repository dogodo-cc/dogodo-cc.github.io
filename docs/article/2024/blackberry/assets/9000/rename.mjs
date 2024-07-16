import { readdir, rename } from 'node:fs/promises';
import { extname, join } from 'node:path';

const dir = '/Users/alan/Downloads/9000截图';

const pictures = (await readdir(dir)).filter((v) => extname(v) === '.jpg');

let i = 1;
for (const v of pictures) {
    await rename(join(dir, v), join(dir, v.replace('-', '')));
    i++;
}
