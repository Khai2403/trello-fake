<template>
    <div class="header">
        <div class="header__logo">
            <NuxtLink to="/dashboard">
                <v-img :width="120" aspect-ratio="4/3" cover :src="logo" :lazy-src="logo" alt="logo"></v-img>
            </NuxtLink>
        </div>
        <div class="header__user">
            <v-btn @click="showLogout" icon="mdi-account" size="40px" class="user-btn">
            </v-btn>
            <div v-if="isShowLogout" class="logout-modal" v-click-outside="closeLogoutModal">
                <v-card>
                    <v-card-text>
                        <div class="mx-auto text-center">
                            <h3>{{ user.displayName }}</h3>
                            <p class="text-caption mt-1">
                                {{ user.email }}
                            </p>
                            <v-divider class="my-3"></v-divider>
                            <v-btn @click="logout" rounded variant="text" prepend-icon="mdi-logout-variant">
                                Đăng xuất
                            </v-btn>
                        </div>
                    </v-card-text>
                </v-card>
            </div>
            <div v-if="isShowLogout" class="border-triangle"></div>
        </div>
        <v-dialog v-model="isPending" persistent>
            <div class="d-flex justify-center align-center">
                <v-progress-circular indeterminate :size="64"></v-progress-circular>
            </div>
        </v-dialog>
    </div>
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