<template lang="pug">
.dashboard-wrapper.d-flex
    MainSidebar
    .board-list
        v-row
            v-col.card(cols='12', sm='6', md='4', lg='3', xl='3', xxl='2', v-for='board in boards', :key='board.id')
                nuxt-link.text-decoration-none(:to='`/dashboard/${board.id}`')
                    v-card.ml-3.rounded-lg.text-white(:style="`background-color: ${board?.backgroundColor}; background-image: url('${board?.img}');background-size: cover;background-position: center;`")
                        p.d-flex.justify-start.mt-1.ml-2 {{ board.title }}
                        p.d-flex.justify-start.ml-2 {{ board.createdAt }}
            v-col.card(cols='12', sm='6', md='4', lg='3', xl='3', xxl='2')
                v-card.ml-3.d-flex.justify-center.align-center(@click='addBoard = true')
                    p Tạo bảng mới
        v-dialog.rounded-lg(v-model='addBoard', :max-width='450', persistent='')
            add-board-modal(@close-add-board='addBoard = false', @status='handelStatus')
        v-snackbar(v-model='isSuccess', color='success', :timeout='3000')
            | Success!!!
            template(v-slot:actions='')
                v-btn(variant='text', @click='isSuccess = false')
                    | Close
        v-snackbar(v-model='isFalse', color='error', :timeout='3000')
            | Failure!!!
            template(v-slot:actions='')
                v-btn(variant='text', @click='isFalse = false')
                    | Close
</template>

<script setup>
import AddBoardModal from '~~/features/board/AddBoardModal.vue';
import MainSidebar from "~~/features/sidebar/MainSidebar.vue";
import { useBoards } from '~~/store/useBoard';

definePageMeta({
    layout: 'main',
    middleware: 'auth',
});
useHead({
  title: "Trello Không gian làm việc"
})

const boards = ref([]);
const addBoard = ref(false);
const isSuccess = ref(false);
const isFalse = ref(false);

const { boardStore } = await useBoards();

boards.value = boardStore.value;

watch(boardStore, async () => {
    const { boardStore } = await useBoards();
    boards.value = boardStore.value;
})
function handelStatus (event) {
    if (event) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
};
</script>

<style lang="scss" scoped>
.dashboard-wrapper {
    height: calc(100vh - 64px);
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

    .board-list {
        height: 100%;
        overflow: auto;
        padding: 16px;
        flex: 1;

        .card {
            cursor: pointer;

            .v-card {
                min-height: 120px;
                box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
            }

            &:hover .v-card {
                background-color: #ccc;
            }

            &>.v-card {
                background-color: #ebebeb;
            }
        }
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
