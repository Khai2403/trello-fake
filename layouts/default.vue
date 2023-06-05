<template lang="pug">
HomeHeader
.space
slot
MainFooter
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