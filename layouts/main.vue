<template lang="pug">
MainHeader
.space
slot
MainFooter
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