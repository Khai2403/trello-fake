<template>
    <div class="header">
        <div class="header__logo">
            <NuxtLink to="/">
                <v-img :width="120" aspect-ratio="4/3" cover :src="logo" :lazy-src="logo" alt="logo"></v-img>
            </NuxtLink>
        </div>

    </div>
</template>

<script setup>
import logo from "../assets/images/logo.gif"
</script>

<style lang="scss" scoped>
.header {
    position: fixed;
    padding: 0 20px 0 10px;
    width: 100%;
    height: 64px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #ccc;
    z-index: 999;
    background-color: #201e1f;

    .header__logo {
        padding: 8px;
    }
}
</style>