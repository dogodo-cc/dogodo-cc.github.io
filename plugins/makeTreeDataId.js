/* eslint-disable no-console */
/* eslint-disable no-undef */
const fs = require('fs');
const path = require('path');
const data = [
  {
    name: '前台',
    children: [
      {
        name: '任务大厅',
        children: [
          {
            name: '任务详情'
          },
          {
            name: '任务创建'
          },
          {
            name: '任务修改'
          }
        ]
      },
      {
        name: '需求大厅',
        children: [
          {
            name: '需求详情'
          },
          {
            name: '需求创建'
          },
          {
            name: '需求修改'
          }
        ]
      },
      {
        name: '个人中心'
      }
    ]
  },
  {
    name: '后台',
    children: [
      {
        name: '角色管理',
        children: [
          {
            name: '角色创建'
          },
          {
            name: '角色删除'
          }
        ]
      }
    ]
  }
]


const makeTreeDataId = (data = [], id = []) => {
  return data.map((v,index) => {
    let _id = id.length ? [...id, ++index] : [++index];
    v = {id: _id.join('-'), ...v};

    if(v.children) {
      v.children = makeTreeDataId(v.children, _id);
    }    
    return v;
  })
}

const tree = makeTreeDataId(data);


fs.writeFile(path.join(__dirname, 'tree.json'), JSON.stringify(tree, null, 2), err => {
  if(err) console.log(err);
  console.log('done !');
})
