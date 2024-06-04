<template>
  <div class="star-bg"></div>
</template>

<script>
export default {
  name: "star-bg"
}
</script>

<style lang="scss">
.star-bg {
  // position: fixed;
  // width: 400vw;
  // height: 400vh;
  // top: 50%;
  // left: 50%;
  // margin-top: -200vh;
  // margin-left: -200vw;
  position: relative;
  top: 50%;
  left: 50%;
  width: 200%;
  height: 200%;
  margin-top: -100%;
  margin-left: -100%;
  animation: logo-rotate 200s linear infinite;
  background-size: 240px;
  backface-visibility: visible;
  background-image: url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHZpZXdCb3g9IjAgMCAyNDAgMjQwIj48cGF0aCBmaWxsPSIjRkZGIiBkPSJNMTA2IDkwaDJ2MmgtMnpNNzQgNjNoMXYxaC0xek0yMyA2NmgxdjFoLTF6TTUwIDExMGgxdjFoLTF6TTYzIDEyOGgxdjFoLTF6TTQ1IDE0OWgxdjFoLTF6TTkyIDE1MWgxdjFoLTF6TTU4IDhoMXYxaC0xek0xNDcgMzNoMnYyaC0yek05MSA0M2gxdjFoLTF6TTE2OSAyOWgxdjFoLTF6TTE4MiAxOWgxdjFoLTF6TTE2MSA1OWgxdjFoLTF6TTEzOCA5NWgxdjFoLTF6TTE5OSA3MWgzdjNoLTN6TTIxMyAxNTNoMnYyaC0yek0xMjggMTYzaDF2MWgtMXpNMjA1IDE3NGgxdjFoLTF6TTE1MiAyMDBoMXYxaC0xek01MiAyMTFoMnYyaC0yek0wIDE5MWgxdjFIMHpNMTEwIDE4NGgxdjFoLTF6Ii8+PC9zdmc+');
}
@keyframes logo-rotate {
  to {
    transform: rotate(-136deg);
  }
}
</style>