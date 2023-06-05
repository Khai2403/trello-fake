<template lang="pug">
.d-flex.justify-center.align-center
    nuxt-link(to='/')
        .mt-15.mb-15
            v-img(:width='250', aspect-ratio='16/9', :cover="true", :src='ColorLogo', :lazy-src='ColorLogo', alt='logo')
slot
</template>

<script setup>
import ColorLogo from "~~/assets/images/color-logo.png"

</script>

<style lang="scss"></style>