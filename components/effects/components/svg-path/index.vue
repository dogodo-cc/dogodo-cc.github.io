<template>
  <div class="svg-path">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlns:xlink="http://www.w3.org/1999/xlink"
      x="0px"
      y="0px"
      viewBox="0 0 215 215"
      style="enable-background:new 0 0 215 215;"
      xml:space="preserve">
      <g>
          <path
            class="path path-1"
            d="M18,97c0.3,4.7,0.7,9.3,1,14c9,0.7,18,1.3,27,2c0.3,3,0.7,6,1,9c-7.7,0-15.3,0-23,0c0,1.7,0,3.3,0,5
              c5,0.7,10,1.3,15,2c4.3,0,8.7,0,13,0c0.7-6.3,1.3-12.7,2-19c-4.2-4-20.4-4.2-28-4c-0.3-2.3-0.7-4.7-1-7c7.8-5.5,19.4-2.3,29-5
              c0.7,0,1.3,0,2,0c0-2,0-4,0-6C34.4,87.6,30.9,88,18,97z"/>
          <path
            class="path path-2"
            d="M57,122c2.7,8.7,5.3,17.3,8,26c9.5,1.9,19.2-5.2,28-8c1.2-5.9-0.6-23.6-5-29C77.7,114.7,67.3,118.3,57,122z
              M70,141c-1.7-4.3-3.3-8.7-5-13c5.7-2.7,11.3-5.3,17-8c2.5,2.4,2.9,5,4,9C85.8,138.6,78.7,140.6,70,141z"/>    
          <path
            class="path path-3"
            d="M126,84c-10,0-20,0-30,0c1.3,14,2.7,28,4,42c2,0,4,0,6,0c-1-11.3-2-22.7-3-34c0.7-0.3,1.3-0.7,2-1
              c5.3,0,10.7,0,16,0c3,10,6,20,9,30c1.2,3.1,2,1.2,6,1c-3.3-12-6.7-24-10-36C126,85.3,126,84.7,126,84z"/>
          <path
            class="path path-4"
            d="M144,73c-1.3,0-2.7,0-4,0c-2.3,1-4.7,2-7,3c1.3,5.3,2.7,10.7,4,16c3.3-1,6.7-2,10-3
              C148.1,83.3,145.3,79.1,144,73z"/>
          <path
            class="path path-5"
            d="M146,96c-1.7,0.7-3.3,1.3-5,2c-2.1,11.1,6.7,23,9,34c3.4,0.8,5.1,0.7,8-1c1-0.3,2-0.7,3-1
              c-3.3-11.3-6.7-22.7-10-34C149.3,96,147.7,96,146,96z"/> 
          <path
            class="path path-6"
            d="M197,101c-7.9,2.1-13.8,8.2-25,5c-1.3-7.7-2.7-15.3-4-23c2.3-2.3,4.7-4.7,7-7c5.5-1.6,11.3-3.4,15,1
              c4.5-1.4,3.6-0.5,5-5c-3.7-1.7-7.3-3.3-11-5c-10.1,4.6-14.5,6.3-22,12c1.3,9.7,2.7,19.3,4,29c3.8,6.1,18.2,5.6,26,3
              c4.1-2,5-3.9,7-8C198.3,102.3,197.7,101.7,197,101z"/>
      </g>
    </svg>
  </div>
</template>

<script>
export default {
  name: 'svg-path'
}
</script>

<style lang="scss">
.svg-path {
  svg {
    width: 250px;
    height: 250px;
  }

  .path {
    fill: none;
    stroke-width:2;
    stroke:#30479B;
    stroke-dasharray: 0 250;
    animation: lineMove 5s ease-out 1;
    animation-fill-mode: forwards;
    &.path-2 {
      animation-delay: 5s;
    }
    &.path-3 {
      animation-delay: 10s;
    }
    &.path-4 {
      animation-delay: 15s;
    }
    &.path-5 {
      animation-delay: 20s;
    }
    &.path-6 {
      animation-delay: 25s;
    }
  }
}

@keyframes lineMove {
    0%{
        stroke-dasharray: 0, 250;
    }
    100%{
        stroke-dasharray: 250, 250;
    }
}

</style>