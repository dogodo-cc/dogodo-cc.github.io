/* eslint-disable no-console */
/* eslint-disable no-undef */
const fs = require("fs");
const path = require('path');
const http = require("http");

const project = process.argv.splice(2)[0] || '湾峡泉';

if(!fs.existsSync(__dirname + `/${project}`)){
  return console.error(`项目： "${project}" 不存在！`)
}

// 根据图片文件夹生成侧边栏数据
const navArr = [];
fs.readdirSync(project).forEach(folder => {
  if (folder === ".DS_Store") return;   // 忽略mac的解压文件

  let filePath = __dirname + `/${project}/` + folder; // 每个文件夹路径
  let isDir = fs.lstatSync(filePath); // 是否文件夹
  if(isDir.isDirectory()){
    let data = {
      name: folder,
      child: []
    };
    fs.readdirSync(filePath).forEach(subFiles => {
      if (subFiles === ".DS_Store") return;
      data.child.push(subFiles);
    })
    navArr.push(data);
  }
});

const dataContent = `// 此文件由 app.js 自动生成
export const project = '${project}';
export const data = ${JSON.stringify(navArr, null, 2)};
`;

fs.writeFile(path.join(__dirname,'data.js'), dataContent, err => {
  if(err) return console.error(err);
});

// 启动静态服务器
const typeMap = {
  "html":"text/html",
  "js":"application/x-javascript" ,
  "jpg":"image/jpeg" ,
  "css":"text/css" ,
  "zip":"application/zip" ,
  "json":"application/json"
}
const PORT = 8008;

http.createServer((req, res) => {
  let _url = req.url === '/' ? 'index.html' : decodeURIComponent(req.url);
  let dataPath = path.join(__dirname, _url);
  let dataType = _url.substr(_url.lastIndexOf('.') + 1);

  fs.readFile(dataPath, (err, data) => {
      if (err) {
          res.writeHeader(404, {
              'content-type': 'text/html;charset="utf-8"'
          })
          res.write(
              `<center>
              <h1>404错误</h1>
              <p>${err}</p>
              </center>`);
          res.end();
      } else {
          res.writeHeader(200, {
              'content-type': `${typeMap[dataType]};charset="utf-8"`
          })
          res.write(data);
          res.end();
      }
  })
}).listen(PORT, () => {
    console.log(`=> server listening at: http://localhost:${PORT}`);
});
