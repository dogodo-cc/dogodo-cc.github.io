# 自动生成树ID


我们业务中之前有一份树形结构的json数据是人工维护的，开发人员在每次更新节点数据的时候还需要手动维护一下该节点的id，这样非常容易出错，也不符合程序员思维

以下是模拟原数据：

```json
[
  {
    "name": "中国",
    "nodes": [
      {
        "name": "福建省",
        "nodes": [
          {
            "name": "厦门市"
          },
          {
            "name": "南平市",
            "nodes": [
              {
                "name": "建瓯市"
              }
            ]
          }
        ]
      },
      {
        "name": "浙江省"
      }
    ]
  }
]
```

写一段小小的脚本

```js
/* eslint-disable no-console */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const data = require('../ram-tree.json');

const makeTreeDataId = (data = [], id = []) => {
    return data.map((v, index) => {
        let _id = id.length ? [...id, ++index] : [++index];
        v = { id: _id.join('-'), ...v };

        if(v.nodes) {
            v.nodes = makeTreeDataId(v.nodes, _id);
        }
        return v;
    });
};

const tree = makeTreeDataId(data);


fs.writeFile(path.join(__dirname, 'ram-tree.json'), JSON.stringify(tree, null, 2), err => {
    if(err) throw err;
    console.log('done !');
});

```

通过脚本生成后的代码

```json
[
  {
    "id": "1",
    "name": "中国",
    "nodes": [
      {
        "id": "1-1",
        "name": "福建省",
        "nodes": [
          {
            "id": "1-1-1",
            "name": "厦门市"
          },
          {
            "id": "1-1-2",
            "name": "南平市",
            "nodes": [
              {
                "id": "1-1-2-1",
                "name": "建瓯市"
              }
            ]
          }
        ]
      },
      {
        "id": "1-2",
        "name": "浙江省"
      }
    ]
  }
]
```
