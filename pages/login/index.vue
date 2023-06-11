<template lang="pug">
.d-flex.justify-center.align-center
    v-sheet.mx-auto.login-wrapper(:width='480')
        p.login-title.d-flex.justify-center Đăng nhập vào Trello
        v-form(v-model='form', @submit.prevent='login')
            v-text-field(v-model='email', label='Email', :rules='rules', :readonly='loading')
            v-text-field(v-model='password', label='Mật khẩu', :rules='rules', :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'", @click:append-inner='togglePassword', :type="showPassword ? 'text' : 'password'", :readonly='loading')
            v-btn.login-btn.mt-2(:disabled='!form', :loading='loading', type='submit') Đăng nhập
            v-card-text.text-error(v-if='errorLogin') Something went wrong!!!
            div.edit(contenteditable="true", @input="updateText", v-html="renderedHTML")
        .register.float-right.mt-5
            span.mr-1 Bạn chưa có tài khoản?
            nuxt-link.redirect-btn(to='/register') Đăng ký ngay
</template>
 
<script setup>
import { useSignIn } from '~~/composable/useFirebase';
import { toast } from "vue3-toastify";
import MarkdownIt from 'markdown-it';

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

// const markdownText = ref("");
const renderedHTML = ref("");
const md = new MarkdownIt();
function updateText (event) {
    const reversedStr = event.target.innerText.split('').reverse().join('');
    renderedHTML.value = md.render(reversedStr);
    console.log(renderedHTML.value);
}

async function login () {
    loading.value = true;
    const { error, response } = await useSignIn(email.value, password.value);
    errorLogin.value = error.value;
    if (!error.value) {
        await navigateTo('/dashboard');
        toast.success("Đăng nhập thành công");
    } else {
        toast.error("Đăng nhập thất bại");
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

.edit {
    height: 100px;
}
</style>