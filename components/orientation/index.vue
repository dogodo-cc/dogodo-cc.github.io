<template>
  <div id="landscape_hinter">
    <div class="hinter_phone" />
    <div class="hinter_rotate" />
    <div class="hinter_text">
      请使用横屏模式
    </div>
  </div>
</template>
<script>
export default {
  name: 'Orientation'
}
</script>

<style lang="postcss">
#landscape_hinter {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #131313;
  z-index: 999;
  display: none;
  & .hinter_phone {
    width: 60px;
    height: 114px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -57px 0 0 -30px;
    /* background: url(./assets/portrait_phone.png) center center no-repeat; */
    background-size: 60px 114px;
    animation: rotateHint 2.6s ease-in infinite;
  }
  & .hinter_rotate {
    width: 30px;
    height: 155px;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -77px 0 0 -15px;
    /* background: url('./assets/portrait_hint.png') center center no-repeat; */
    background-size: 30px 155px;
  }
  & .hinter_text {
    position: absolute;
    right: 0;
    bottom: 15%;
    left: 0;
    color: #bbb;
    font-size: 14px;
    font-weight: 400;
    text-align: center;
    line-height: 1;
  }
}
@keyframes rotateHint {
  0% {
    -webkit-transform: rotate(0);
    transform: rotate(0);
    opacity: 0.2;
  }
  50% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
    opacity: 1;
  }
  100% {
    -webkit-transform: rotate(90deg);
    transform: rotate(90deg);
    opacity: 0;
  }
}

@media screen and (orientation: portrait) {
  /* landscape*/
  #landscape_hinter {
    display: block;
  }
}
</style>
