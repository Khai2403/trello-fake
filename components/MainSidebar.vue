<template lang="pug">
.dashboard(:style="`color: ${isDetail ? 'white' : 'black'};background-color:${isDetail ? 'rgba(0, 0, 0, 0.6)' : 'white'};`")
    v-row.dashboard__title(no-gutters='')
        v-col.dashboard__title__logo(cols='2')
            .w-100
                nuxt-link.text-white.text-decoration-none.d-flex.justify-center(to='/dashboard')
                    | T
        v-col.ml-2(cols='8')
            nuxt-link.text-decoration-none(to='/dashboard', :style="`color: ${isDetail ? 'white' : 'black'};`")
                .font-weight-bold.text-subtitle-1
                    | Trello Không gian làm việc
                .text-subtitle-2
                    | Miễn phí
        v-col(cols='3')
            v-btn(icon='mdi-chevron-left', flat='', @click='hideSidebar', color='transparent')
    v-divider(:thickness='2')
    .ml-3.mr-3
        v-btn.w-100.d-flex.justify-start.mt-2(variant='text', to='/dashboard')
            v-icon.mr-2(icon='mdi-trello')
            | Bảng
        .d-flex.justify-space-between.mt-2
            p.text-subtitle-1 Các bảng của bạn
            v-icon.add-board(icon='mdi-plus', @click='addBoard = true')
        .overflow-y-auto.board-group(v-if='isBoard')
            div(v-for='board in boards', :key='board.id')
                v-hover(v-slot='{ isHovering, props }')
                    .board.d-flex.align-center.w-100.mt-2(v-bind='props')
                        v-btn.board__btn.d-flex.justify-start.align-center(variant='text', :to='`/dashboard/${board.id}`')
                            .d-flex.align-center.board__title
                                .board__img(:style="`background-color: ${board?.backgroundColor}; background-image: url('${board?.img ? board?.img : ''}')`")
                                | {{ board?.title }}
                        .delete__board__btn.d-flex.align-center.justify-center(v-if='isHovering')
                            v-icon(icon='mdi-delete', @click.prevent='deleteBoard(board.id)')
        .mt-2(v-else='')
            span.text-caption Bạn chưa có bảng nào
        v-dialog.rounded-lg(v-model='addBoard', :max-width='450', persistent='')
            AddBoardModal(@close-add-board='addBoard = false', @status='handelStatus')
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
    v-dialog.d-flex.align-center.justify-center(v-model='loadingProgress', persistent='', :max-width='200')
        .d-flex.justify-center.align-center
            v-progress-circular(color='success', :size='60', indeterminate='')
</template>

<script setup>
import AddBoardModal from './AddBoardModal.vue';
import { useBoards } from '~~/store/useBoard';
import { useDelete } from '~~/composable/useFirebase';

const { isDetail, activeWorkId } = defineProps(['isDetail', 'activeWorkId']);
const emit = defineEmits(['hideSidebar'])
const boards = ref([]);
const addBoard = ref(false);
const isSuccess = ref(false);
const isFalse = ref(false);
const loadingProgress = ref(false);
const isBoard = ref(false);

const { boardStore } = await useBoards();

boards.value = boardStore.value;
if (boardStore.value.length !== 0) {
    isBoard.value = true;
} else {
    isBoard.value = false;
}

watch(boardStore, async () => {
    const { boardStore } = await useBoards();
    boards.value = boardStore.value;
    if (boardStore.value.length !== 0) {
        isBoard.value = true;
    } else {
        isBoard.value = false;
    }
});

function hideSidebar () {
    emit('hideSidebar');
};

function handelStatus (event) {
    if (event) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
};
async function deleteBoard (deleteBoardId) {
    loadingProgress.value = true;
    const { error } = await useDelete("dashboard", deleteBoardId);
    if (activeWorkId == deleteBoardId) {
        navigateTo('/dashboard');
    }
    if (!error.value) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
    loadingProgress.value = false;
};
</script>

<style lang="scss" scoped>
.dashboard {
    min-width: 300px;
    max-width: 300px;

    .dashboard__title {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        margin: 8px 12px;

        .dashboard__title__logo {
            max-width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            color: white;
            background: linear-gradient(#6E5DC6, #0C66E4);
            font-weight: bold;
            font-size: 1.25rem;
            border-radius: 4px;
        }
    }

    .v-btn {
        text-transform: none;
    }

    .add-board:hover {
        background-color: rgba($color: #ccc, $alpha: 0.6);
        cursor: pointer;
        border-radius: 4px;
    }


    .board-group {
        max-height: 410px;

        .board:hover {
            background-color: rgba($color: #ccc, $alpha: 0.2);
            border-radius: 4px;
        }

        .board__img {
            min-height: 20px;
            min-width: 24px;
            background-size: cover;
            margin-right: 8px;
            border-radius: 4px;
        }

        .delete__board__btn {
            flex: 1;

            .v-icon:hover {
                cursor: pointer;
                background-color: rgba($color: #ccc, $alpha: 0.6);
                border-radius: 4px;
            }
        }

        .board__btn {
            width: 85%;

            &:hover {
                background-color: rgba($color: #ccc, $alpha: 0.2);
            }
        }
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
</style>