<template>
    <div class="d-flex justify-center align-center">
        <v-sheet :width="480" class="mx-auto wrapper">
            <p class="login-title d-flex justify-center">Đăng ký tài khoản</p>
            <v-form v-model="form" @submit.prevent="register">
                <v-row>
                    <v-col cols="6">
                        <v-text-field v-model="firstName" label="Họ" :rules="rules" :readonly="loading"
                            clearable></v-text-field>
                    </v-col>
                    <v-col cols="6">
                        <v-text-field v-model="lastName" label="Tên" :rules="rules" :readonly="loading"
                            clearable></v-text-field>
                    </v-col>
                </v-row>
                <v-text-field v-model="email" label="Email" :rules="rules" :readonly="loading" clearable></v-text-field>
                <v-text-field v-model="password" label="Mật khẩu" type="password" :rules="rules" :readonly="loading"
                    clearable></v-text-field>
                <v-btn :disabled="!form" :loading="loading" type="submit" class="login-btn mt-2">Đăng ký</v-btn>
                <v-card-text v-if="errorRegister" class="text-error">Something went wrong!!!</v-card-text>
            </v-form>
            <div class="register float-right mt-5">
                <span class="mr-1">Bạn đã có tài khoản? </span>
                <nuxt-link to="/login" class="redirect-btn">Đăng nhập</nuxt-link>
            </div>
        </v-sheet>
    </div>
</template>

<script setup>
import { useSignUp } from "~~/composable/useFirebase"

definePageMeta({
    layout: 'auth',
});
const rules = [(value) => !!value || "Required!!!"]

const form = ref(null);
const firstName = ref(null);
const lastName = ref(null);
const email = ref(null);
const password = ref(null);
const loading = ref(false);
const errorRegister = ref(null);

async function register () {
    loading.value = true;
    const fullName = ref(`${lastName.value} ${firstName.value}`)
    const { error, response } = await useSignUp(email.value, password.value, fullName.value);
    errorRegister.value = error.value;
    if (!error.value) {
        navigateTo('/login');
    }
    loading.value = false;
}

</script>

<style lang="scss"></style>