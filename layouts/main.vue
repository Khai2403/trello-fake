<template lang="pug">
MainHeader
.space
slot
</template>

<script setup>
import MainHeader from "~~/components/MainHeader.vue";
</script>

<style lang="scss" scoped>
.space {
    height: 64px;
}
</style>
