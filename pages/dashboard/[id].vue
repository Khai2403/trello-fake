<template>
    <div class="">
        <h1>board {{ id }}</h1>
    </div>
</template>

<script setup>
definePageMeta({
    layout: 'main',
    middleware: 'auth',
});

const { id } = useRoute().params;
</script>

<style lang="scss" scoped></style>