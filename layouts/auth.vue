<template lang="pug">
.d-flex.justify-center.align-center
    nuxt-link(to='/')
        .mt-15.mb-15
            v-img(:width='250', :min-height='55', aspect-ratio='16/9', :cover="true", :src='ColorLogo', :lazy-src='ColorLogo', alt='Logo')
                template(v-slot:placeholder='')
                    v-row.fill-height.ma-0(align='center', justify='center')
                        v-progress-circular(indeterminate='', color='grey-lighten-5')
slot
</template>

<script setup>
import ColorLogo from "~~/assets/images/color-logo.png"

</script>

<style lang="scss"></style>
