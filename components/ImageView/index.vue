<template>
    <div :class="bem()" @mousemove="setControlBox" :style="containStyle">
        <div
            @click="goTo('next')"
            :class="[bem('page-btn'), 'next', currentIndex === images.length - 1 ? 'disabled' : '']">
            <icon :width="31" :height="54" name="icon_arrow_right" color="#C0C4CC"/>
        </div>
        <div
            @click="goTo('prev')"
            :class="[bem('page-btn'), 'prev', currentIndex === 0 ? 'disabled' : '']">
            <icon :width="31" :height="54" name="icon_arrow_left" color="#C0C4CC"/>
        </div>
        <div
            :class="bem('image-contain')"
            @dragstart="dragStart"
            @wheel="wheel"
            @click.self="clickModalClose && $emit('imageViewClose')">
            <template v-if="images.length">
                <Loading v-if="loading" color="#fff"/>
                <img
                    v-else
                    draggable="false"
                    @mousedown.self.stop="mousedown"
                    @mousemove.prevent="drag"
                    @mouseup="mouseup"
                    @dragstart="dragStart"
                    :src="currentImg"
                    alt="picture"
                    :class="{'transparent': transparent}"
                    :style="imgStyle">
            </template>
            <span v-else class="empty-tip">
                你未传入任何图片
            </span>
        </div>
        <div @click="setControlBox" :class="[bem('control'), showControlBox ? 'show': '']">
            <div @click="zoom('zoomOut')">
                <icon :width="16" :height="16" color="#fff" name="icon_narrow"/>
            </div>
            <div @click="zoom('zoomIn')">
                <icon :width="16" :height="16" color="#fff" name="icon_enlarge"/>
            </div>
            <div @click="showFull">
                <icon :width="16" :height="16" color="#fff" :name="isFull ? 'icon_full' : 'icon_original'"/>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { loadImg } from '@uxms/shared/services';
import { Component, VC, Prop } from '../VC';
import Loading from '../Loading/index.vue';
function rafThrottle(fn) {
    let locked = false;
    return function(...args) {
        if (locked) return;
        locked = true;
        window.requestAnimationFrame(_ => {
            fn.apply(this, args);
            locked = false;
        });
    };
}

@Component({
    name: 'imageView',
    components: { Loading },
    watch: {
        currentImg: {
            handler(v) {
                if (!v) return;
                this.loading = true;
                this.isFull = false;
                loadImg(v).finally(() => {
                    this.loading = false;
                    this.init();
                });
            },
            immediate: true
        },
        width: {
            handler() {
                this.init();
            }
        },
        height: {
            handler() {
                this.init();
            }
        },
        initIndex(v) {
            this.currentIndex = v;
        }
    }
})
export default class ImageView extends VC {
    // 图片数组
    @Prop({ default: () => [{ src: '', filename: '下载名称' }] })
    public images!: [];

    // 默认的图片索引
    @Prop({ default: 0 })
    public initIndex!: number;

    // 容器宽度
     @Prop({ default: 600 })
    public width!: number;

     // 容器高度
     @Prop({ default: 500 })
     public height!: number;

     // 点击遮罩关闭
     @Prop({ default: false })
     public clickModalClose!: boolean;

     private currentIndex: number = 0; // 当前图片的索引
     private loading: boolean = true; // 图片是否加载中
     private isFull: boolean = false; // 是否全屏
     private timer: number = 0;
     private showControlBox: boolean = false; // 是否显示控制栏
     private isDragging: boolean = false;
     private clientX: number = 0;
     private clientY: number = 0;
     private transform = {
         scale: 1,
         deg: 0,
         offsetX: 0,
         offsetY: 0,
         enableTransition: true
     }

     get imgStyle() {
         const { scale, deg, offsetX, offsetY, enableTransition } = this.transform;
         const style: any = {
             transform: `scale(${scale}) rotate(${deg}deg)`,
             transition: enableTransition ? 'transform .3s' : '',
             'margin-left': `${offsetX}px`,
             'margin-top': `${offsetY}px`
         };
         if (!this.isFull) {
             style.maxWidth = style.maxHeight = '100%';
         }
         return style;
     }

     // 容器的样式
     get containStyle() {
         return {
             width: this.width + 'px',
             height: this.height + 'px'
         };
     }

     // 当前项
     get current() {
         return this.images[this.currentIndex];
     }

     // 当前图片
     get currentImg() {
         return this.current.src;
     }

     get transparent() {
         const { currentImg } = this;
         const suffix = currentImg.substr(currentImg.lastIndexOf('.') + 1);
         return ['svg', 'png'].includes(suffix) || currentImg.includes('blob:http');
     }

     goTo(dir: string) {
         if (dir === 'next') {
             (this.currentIndex < this.images.length - 1) && this.currentIndex++;
         } else if (dir === 'prev') {
             (this.currentIndex > 0) && this.currentIndex--;
         }
         this.$emit('imageViewChange', this.currentIndex);
     }

     zoom(type: string) {
         let { transform } = this;
         if (type === 'zoomIn') {
             transform.scale = parseFloat((transform.scale + 0.2).toFixed(3));
         } else {
             if (transform.scale > 0.2) {
                 transform.scale = parseFloat((transform.scale - 0.2).toFixed(3));
             }
         }
     }
     // 点击全屏按钮
     showFull() {
         this.init();
         this.isFull = !this.isFull;
     }

     setControlBox() {
         this.showControlBox = true;
         if (this.timer) {
             window.clearTimeout(this.timer);
             this.timer = 0;
         }

         this.timer = window.setTimeout(() => {
             this.showControlBox = false;
         }, 1.5 * 1000);
     }

     created() {
         this.$nextTick(() => {
             document.addEventListener('keyup', this.bindKeyUp);
         });
         this.currentIndex = this.initIndex;
     }

     bindKeyUp(e) {
         const { keyCode } = e;
         if ([37, 38].includes(keyCode)) {
             this.goTo('prev');
         }
         if ([39, 40].includes(keyCode)) {
             this.goTo('next');
         }
     }

     wheel(e) {
         e.preventDefault();
         e.stopPropagation();
         // 当双指方向不同时 e.ctrlKey 为true 判断为缩放操作
         if (e.ctrlKey) {
             Math.abs(e.deltaY) > 2 && this.zoom(e.deltaY < 0 ? 'zoomIn' : 'zoomOut');
         } else {
             if (Math.abs(e.deltaX)) {
                 this.transform.offsetX += (e.deltaX < 0)
                     ? Math.abs(e.wheelDeltaX || 3)
                     : -Math.abs(e.wheelDeltaX || 3);
             }

             if (Math.abs(e.deltaY)) {
                 this.transform.offsetY += (e.deltaY < 0)
                     ? Math.abs(e.wheelDeltaY || 3)
                     : -Math.abs(e.wheelDeltaY || 3);
             }
         }
     }

     dragStart(e) {
         // only for firefox ,otherwise it will open a new tab, fuck!!
         e.preventDefault();
         e.stopPropagation();
     }

     // 鼠标按下
     mousedown(e) {
         this.isDragging = true;
         const { clientX, clientY } = e;
         this.clientX = clientX;
         this.clientY = clientY;
     }
     // 鼠标移动
     drag = rafThrottle(function(e: any) {
         if (!this.isDragging) return;
         const { clientX, clientY } = e;
         const x = clientX - this.clientX;
         const y = clientY - this.clientY;
         this.transform.offsetX += x;
         this.transform.offsetY += y;
         this.clientX = clientX;
         this.clientY = clientY;
     })
     // 鼠标抬起
     mouseup() {
         this.isDragging = false;
     }

     init() {
         this.transform = {
             scale: 1,
             deg: 0,
             offsetX: 0,
             offsetY: 0,
             enableTransition: true
         };
     }

     beforeDestroy() {
         document.removeEventListener('keyup', this.bindKeyUp);
     }
}
</script>

<style scope lang="less">
    @b: imageView;

    .@{b} {
        position: relative;
        user-select:none;
        &__page-btn {
            width: 88px;
            height: 88px;
            position: absolute;
            z-index: 999;
            top: 50%;
            margin-top: -44px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
            cursor: pointer;
            &:hover {
                background-color: #606266;
            }
            &.disabled {
                visibility: hidden;
            }
            &.next {
                right: 0;
            }
            &.prev {
                left: 0;
            }
        }
        &__image-contain {
            width: 100%;
            height: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            img {
                cursor:grabbing;
                flex-shrink: 0; // 防止在firefox下，自动进行缩放
                &.transparent {
                    background: url('./images/1.png') left top repeat;
                    background-size: 8px 8px;
                }
            }
            .empty-tip {
                color: #fff;
            }
        }
        &__control {
            &.show {
                opacity: 1;
            }
            opacity: 0;
            transition: opacity .3s linear;
            z-index: 995;
            position: absolute;
            bottom: 80px;
            left: 50%;
            transform: translateX(-50%);
            display: flex;
            border-radius:4px;
            overflow: hidden;
            > div {
                width:40px;
                height:40px;
                background:rgba(0,0,0,0.8);
                display: flex;
                justify-content: center;
                align-items: center;
                cursor: pointer;
            }
        }
    }
</style>
