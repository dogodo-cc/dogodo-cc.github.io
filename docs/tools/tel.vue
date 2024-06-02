<template>
    <div class="tel-check">
        <div class="logo-section">
            <img width="200px" src="./logo-konghao.png" alt="" />
        </div>
        <div class="import-section">
            <VPButton @click="clickImportBtn" :theme="buttonType" :text="buttonText" size="medium"> </VPButton>
            <input :disabled="isChecking" type="file" @change="importExcel" id="excelFileInput" accept=".xls,.xlsx" style="display: none" />
        </div>
        <div class="process">
            <ProcessItem step-title="导入" :process="process.pickXlsx.process" :showProcessBar="false" />
            <ProcessItem step-title="读取" :process="process.readXlsx.process" />
            <ProcessItem step-title="检测" :process="process.checkTelNumber.process" />
            <ProcessItem step-title="生成" :process="process.createXlsx.process" />
        </div>
        <div class="download-section" v-if="tasks.length">
            <fieldset>
                <legend>解析列表</legend>

                <ul>
                    <li v-for="item in tasks" :key="item.downloadUrl" :class="{ done: !!item.downloadUrl }">
                        <span>{{ item.filename }}</span>
                        <button v-if="item.downloadUrl" @click="download(item.downloadUrl, item.filename)">下载</button>
                        <button v-else>解析中</button>
                    </li>
                </ul>
            </fieldset>
        </div>

        <VPFeatures :features="features" />
        <!-- <button @click="test2">test2</button> -->
    </div>
</template>

<script setup>
import { VPButton } from 'vitepress/theme';
import VPFeatures from 'vitepress/dist/client/theme-default/components/VPFeatures.vue';
import ProcessItem from './components/process-item.vue';
import { ref, reactive, computed, onMounted, onUnmounted } from 'vue';
import { eventMap, download } from './utils';

const features = reactive([
    {
        title: '本地操作',
        details: '解析和生成表格都是在浏览器本地完成，省去远程上传和下载的过程，避免因为网络问题浪费您的时间',
    },
    {
        title: '准备率高',
        details: '准确率高达 95% 以上， 可以轻松筛选出空号，沉默号以及风险号，以极低成本帮您获取更高的推广效率和极低的营销费用。',
    },
    {
        title: '无需注册',
        details: '您无需注册登录，无需预充值，随到随用，按检测量单次付费，方便快捷。',
    },
]);

const tasks = reactive([]);

// 用来控制当前只能有一个表格进行解析
const isChecking = ref(false);

const buttonText = computed(() => {
    return isChecking.value ? '解析中....' : '选择 Excel 文件';
});
const buttonType = computed(() => {
    return isChecking.value ? 'sponsor' : 'brand';
});

let worker = null;
class WorkerManger {
    worker = null;
    constructor() {
        this.init();
    }
    init() {
        this.worker = new Worker('./worker/worker-xlsx.js');

        // 监听来自 worker 的消息
        this.worker.onmessage = function (e) {
            const message = e.data;

            switch (message.type) {
                case eventMap['read-xlsx-success']:
                    process.value.readXlsx.process = 1;
                    break;
                case eventMap['number-check-ing']:
                    process.value.checkTelNumber.process = message.data;
                    break;
                case eventMap['create-new-xlsx-start']:
                    process.value.createXlsx.process = 0.2;
                    break;
                case eventMap['create-new-xlsx-update']:
                    // 共 5 个 sheet 所以，每次解析完成一个 sheet 加个 0.1 不会超额，且体验更好
                    process.value.createXlsx.process += 0.1;
                    break;
                case eventMap['create-new-xlsx-done']:
                    process.value.createXlsx.process = 1;
                    isChecking.value = false;

                    // 当前的任务就是任务列表的最后一个，当前设计是一个一个的解析
                    // 后期可能需要改成 通过 filename 来 find
                    tasks[tasks.length - 1].downloadUrl = message.data;
                    break;
                default:
                    console.log('未识别的消息类型:', message.type);
            }
        };
    }
    send(message, transfer) {
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Web_Workers_API/Transferable_objects
        // https://developer.mozilla.org/zh-CN/docs/Web/API/Worker/postMessage 利用可转移对象传输大数据
        this.worker.postMessage(message, transfer);
    }
    destroy() {
        this.worker.terminate();
    }
}

class ProcessManger {
    pickXlsx = {
        process: 0,
    };

    readXlsx = {
        process: 0,
        resultMsg: '',
    };

    checkTelNumber = {
        process: 0,
        resultMsg: '',
    };

    createXlsx = {
        process: 0,
        resultMsg: '',
    };

    reset() {
        this.pickXlsx.process = 0;
        this.readXlsx.process = 0;
        this.checkTelNumber.process = 0;
        this.createXlsx.process = 0;
    }
}

const process = ref(new ProcessManger());

onMounted(() => {
    worker = new WorkerManger();
});
onUnmounted(() => {
    worker.destroy();
    worker = null;
});

function clickImportBtn() {
    if (isChecking.value) {
        return;
    } else {
        document.querySelector('#excelFileInput').click();
    }
}

function importExcel(event) {
    if (!event.target.value) return;

    process.value.reset();
    // 选中了文件直接高亮第一个 step
    process.value.pickXlsx.process = 1;

    isChecking.value = true;

    const file = event.target.files[0];

    // 先不处理重复导入，原则上我们允许这样做
    tasks.push({
        filename: file.name,
        downloadUrl: '',
    });

    mockImportProcess(); // 读取文件没有实际进度，模拟一个

    if (true) {
        const reader = new FileReader();

        reader.onload = async function (e) {
            event.target.value = ''; // 重置 input

            const data = e.target.result;
            worker.send(
                {
                    type: eventMap['read-xlsx-buffer'],
                    data: data,
                },
                [data]
            );
        };

        reader.readAsArrayBuffer(file);
    } else {
        const url = URL.createObjectURL(file);
        worker.send({
            type: eventMap['read-xlsx-url'],
            data: url,
        });
    }
}

function mockImportProcess() {
    if (process.value.readXlsx.process < 0.8) {
        process.value.readXlsx.process += 0.05;
        window.setTimeout(mockImportProcess, 500);
    }
}

// function test2() {
//     fetchPost('http://localhost:3000/tel-check', { mobiles: '18650998366,18650998366,18650998366,18650998366,18650998366', type: 0 })
//         .then((res) => console.log(res))
//         .catch((e) => console.log(e));
// }
</script>

<style scoped>
.tel-check {
    width: 1200px;
    margin: 30px auto;
    text-align: center;

    & .logo-section {
        margin-bottom: 70px;
        display: flex;
        justify-content: center;
    }

    & .import-section {
        margin-bottom: 60px;
    }

    & .process {
        display: flex;
        align-items: center;
        justify-content: center;
    }

    & .download-section {
        margin: 80px auto 0;
        width: 500px;

        & fieldset {
            border: 1px solid var(--vp-c-divider);
            border-radius: 8px;
            padding: 12px;
        }

        & li {
            display: flex;
            justify-content: space-between;
            margin-bottom: 12px;
            color: var(--vp-c-text-2);
            &.done {
                color: var(--vp-c-text-1);
            }
            & button {
                border: 1px solid var(--vp-input-border-color);
                border-radius: 8px;
                padding: 0 10px;
            }
        }
    }

    & .VPFeatures {
        margin-top: 160px;
        text-align: left;
    }
}

@media (max-width: 750px) {
    .tel-check {
        width: 100%;
    }
}
</style>
