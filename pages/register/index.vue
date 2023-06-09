<template lang="pug">
.d-flex.justify-center.align-center
    v-sheet.mx-auto.register-wrapper(:width='480')
        p.register-title.d-flex.justify-center Đăng ký tài khoản
        v-form(v-model='form', @submit.prevent='register')
            v-row
                v-col(cols='6')
                    v-text-field(v-model='firstName', label='Họ', :rules='rules', :readonly='loading')
                v-col(cols='6')
                    v-text-field(v-model='lastName', label='Tên', :rules='rules', :readonly='loading')
            v-text-field(v-model='email', label='Email', :rules='rules', :readonly='loading')
            v-text-field(v-model='password', label='Mật khẩu', :rules='rules', :append-inner-icon="showPassword ? 'mdi-eye' : 'mdi-eye-off'", @click:append-inner='togglePassword', :type="showPassword ? 'text' : 'password'", :readonly='loading')
            v-btn.register-btn.mt-2(:disabled='!form', :loading='loading', type='submit') Đăng ký
            v-card-text.text-error(v-if='errorRegister') Something went wrong!!!
        .register.float-right.mt-5
            span.mr-1 Bạn đã có tài khoản?
            nuxt-link.redirect-btn(to='/login') Đăng nhập
</template>

<script setup>
import { useSignUp } from "~~/composable/useFirebase";
import { toast } from "vue3-toastify";

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
const showPassword = ref(false);

async function register () {
    loading.value = true;
    const fullName = ref(`${lastName.value} ${firstName.value}`);
    const initialsName = ref(`${lastName.value.charAt(0).toUpperCase()}${firstName.value.charAt(0).toUpperCase()}`);
    const { error, response } = await useSignUp(email.value, password.value, fullName.value, initialsName.value);
    errorRegister.value = error.value;
    if (!error.value) {
        await navigateTo('/login');
        toast.success("Đăng ký thành công");
    } else {
        toast.error("Đăng ký thất bại");
    }
    loading.value = false;
}

function togglePassword () {
    showPassword.value = !showPassword.value;
}

</script>

<style lang="scss" scoped>
.register-wrapper {
    padding: 25px 40px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 2px 2px 5px 5px #ccc;

    .register-title {
        color: #5e6c84;
        font-weight: 600;
        margin: 10px 0 25px;
    }

    .register-btn {
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