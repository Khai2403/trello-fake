<template>
    <div>
        <MainHeader />
        <div class="space"></div>
        <slot />
        <MainFooter />
    </div>
</template>

<script setup>
import MainHeader from "~~/components/MainHeader.vue";
import MainFooter from "~~/components/MainFooter.vue";

</script>

<style lang="scss" scoped>
.space {
    height: 64px;
}
</style>