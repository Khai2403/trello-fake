<template>
    <div>
        <div class="d-flex justify-center align-center">
            <div class="mt-15 mb-15">
                <v-img :width="250" aspect-ratio="16/9" cover :src="ColorLogo" :lazy-src="ColorLogo" alt="logo"></v-img>
            </div>
        </div>
        <slot />
    </div>
</template>

<script setup>
import ColorLogo from "~~/assets/images/color-logo.png"

</script>

<style lang="scss"></style>