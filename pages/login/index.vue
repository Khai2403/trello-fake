<template>
    <div class="d-flex justify-center align-center">
        <v-sheet :width="480" class="mx-auto login-wrapper">
            <p class="login-title d-flex justify-center">Đăng nhập vào Trello</p>
            <v-form v-model="form" @submit.prevent="login">
                <v-text-field v-model="email" label="Email" :rules="rules" :readonly="loading"></v-text-field>
                <v-text-field v-model="password" label="Mật khẩu" :rules="rules"
                    :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'" @click:append-inner="togglePassword"
                    :type="showPassword ? 'text' : 'password'" :readonly="loading"></v-text-field>
                <v-btn :disabled="!form" :loading="loading" type="submit" class="login-btn mt-2">Đăng nhập</v-btn>
                <v-card-text v-if="errorLogin" class="text-error">Something went wrong!!!</v-card-text>
            </v-form>
            <div class="register float-right mt-5">
                <span class="mr-1">Bạn chưa có tài khoản? </span>
                <nuxt-link to="/register" class="redirect-btn">Đăng ký ngay</nuxt-link>
            </div>
        </v-sheet>
    </div>
</template>

<script setup>
import { useSignIn } from '~~/composable/useFirebase'
definePageMeta({
    layout: 'auth',
});
const rules = [(value) => !!value || "Required!!!"]
const form = ref(null);
const email = ref(null);
const password = ref(null);
const loading = ref(false);
const errorLogin = ref(null);
const showPassword = ref(false);

async function login () {
    loading.value = true;
    const { error, response } = await useSignIn(email.value, password.value);
    errorLogin.value = error.value;
    if (!error.value) {
        navigateTo('/dashboard');
    }
    loading.value = false;
}

function togglePassword () {
    showPassword.value = !showPassword.value;
}

</script>

<style lang="scss" scoped>
.login-wrapper {
    padding: 25px 40px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 2px 2px 5px 5px #ccc;

    .login-title {
        color: #5e6c84;
        font-weight: 600;
        margin: 10px 0 25px;
    }

    .login-btn {
        color: white;
        background-color: #5aac44;
        width: 100%;
        padding: 8px;
    }

    .redirect-btn {
        text-decoration: none;
        color: black;

        &:hover {
            text-decoration: underline;
        }
    }
}
</style>