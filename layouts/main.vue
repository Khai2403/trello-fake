<template>
    <div>
        <MainHeader />
        <div class="space"></div>
        <div class="dashboard-wrapper">
            <v-fade-transition v-if="!hideSidebar">

                <MainSidebar v-show="!hideSidebar" @hide-sidebar="handelHideSidebar" />
            </v-fade-transition>
            <!-- <v-fade-transition> -->
            <div v-if="hideSidebar" class="d-flex flex-column mr-3">
                <div class="sidebar" @click="hideSidebar = false">
                    <div class="chevron-right">
                        <v-icon icon="mdi-chevron-right"></v-icon>
                    </div>
                </div>
            </div>

            <v-divider :thickness="2" vertical v-if="!hideSidebar"></v-divider>


            <!-- </v-fade-transition> -->
            <div class="board">
                <slot />
            </div>
        </div>
        <MainFooter />
    </div>
</template>

<script setup>
import MainHeader from "~~/components/MainHeader.vue";
import MainFooter from "~~/components/MainFooter.vue";
import MainSidebar from "../components/MainSidebar.vue";

const hideSidebar = ref(false);
function handelHideSidebar () {
    hideSidebar.value = true;
}

</script>

<style lang="scss" scoped>
.space {
    height: 64px;
}

.dashboard-wrapper {
    height: 600px;
    display: flex;

    .sidebar {
        height: 100%;
        width: 16px;
        background-color: rgba(0, 0, 0, 0.1);
        cursor: pointer;
        animation: appear .3s ease-in-out;

        .chevron-right {
            display: flex;
            align-items: center;
            justify-content: center;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            margin: 16px 0 0 4px;
            background-color: rgba(0, 0, 0, 0.1);

            &:hover {
                background-color: rgba(0, 0, 0, 0.2);

            }
        }

        &:hover,
        &:hover .chevron-right {
            background-color: rgba(0, 0, 0, 0.2);

        }
    }

    .board {
        flex: 1;
    }

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    ::-webkit-scrollbar-track {
        background-color: #eee;
        border-radius: 10px;

    }

    ::-webkit-scrollbar-thumb {
        background-color: #888;
        border: 2px solid #fff;
        border-radius: 10px;
    }
}

@keyframes appear {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
}
</style>