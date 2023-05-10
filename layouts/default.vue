<template>
    <div>
        <HomeHeader />
        <div class="space"></div>
        <slot />
        <MainFooter />
    </div>
</template>

<script setup>
import HomeHeader from "~~/components/HomeHeader.vue";
import MainFooter from "~~/components/MainFooter.vue";
</script>

<style lang="scss" scoped>
.space {
    height: 64px;
}
</style>