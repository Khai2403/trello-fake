<template lang="pug">
.header
    .header__logo
        nuxt-link(to='/dashboard')
            v-img(:width='120', aspect-ratio='4/3', cover='', :src='logo', :lazy-src='logo', alt='logo')
    .header__user
        v-btn(@click='showLogout', size='40px', rounded='')
            v-avatar(color='white')
                span.text-h6 {{ user?.photoURL }}
        .logout-modal(v-if='isShowLogout', v-click-outside='closeLogoutModal')
            v-card
                v-card-text
                    .mx-auto.text-center
                        h3 {{ user?.displayName }}
                        p.text-caption.mt-1
                            | {{ user?.email }}
                        v-divider.my-3
                        v-btn(@click='logout', rounded='', variant='text', prepend-icon='mdi-logout-variant')
                            | Đăng xuất
        .border-triangle(v-if='isShowLogout')
    v-dialog(v-model='isPending', persistent='')
        .d-flex.justify-center.align-center
            v-progress-circular(indeterminate='', :size='64')
</template>

<script setup>
import logo from "../assets/images/logo.gif"
import { useUser, useLogout } from '~~/composable/useFirebase'

const user = ref(null);
(async () => {
    const { user: userCurr } = await useUser();
    user.value = userCurr.value;
})();

const isShowLogout = ref(false);
const isPending = ref(false);

function showLogout () {
    isShowLogout.value = !isShowLogout.value;
}

function closeLogoutModal () {
    isShowLogout.value = false;
}

async function logout () {
    isPending.value = true;
    const { error, response } = await useLogout();
    if (!error.value) {
        navigateTo('/login');
    }
    isPending.value = false;
}
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

    .header__user {
        position: relative;

        .logout-modal {
            position: absolute;
            right: 0;
            top: 48px;

            .v-btn {
                text-transform: none;
            }
        }

        .border-triangle {
            position: absolute;
            right: 10px;
            top: 40px;
            border-right: 10px solid transparent;
            border-left: 10px solid transparent;
            border-bottom: 10px solid white;
            //width = border-right + border-left => right
        }
    }


}
</style>