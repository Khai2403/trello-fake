<template lang="pug">
HomeHeader
.space
slot
Footer
</template>

<script setup>
import HomeHeader from "~~/components/HomeHeader.vue";
import Footer from "~~/components/Footer.vue";
</script>

<style lang="scss" scoped>
.space {
    height: 64px;
}
</style>