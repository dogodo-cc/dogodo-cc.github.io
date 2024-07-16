<template>
    <div class="pictures-scroll-x">
        <slot />
    </div>
</template>
<style>
.pictures-scroll-x {
    display: flex;
    width: 100%;
    overflow-x: auto;
    align-items: end;
    & img {
        width: 200px;
    }
}
</style>
