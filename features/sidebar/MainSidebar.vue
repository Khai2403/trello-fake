<template lang="pug">
v-fade-transition(v-if='!hideSidebar')
  .dashboard(v-show='!hideSidebar', :style="`color: ${activeBoardId ? 'white' : 'black'};background-color:${activeBoardId ? 'rgba(0, 0, 0, 0.6)' : 'white'};`")
    v-row.dashboard__title(no-gutters='')
        v-col.dashboard__title__logo(cols='2')
            .w-100
                nuxt-link.text-white.text-decoration-none.d-flex.justify-center(to='/dashboard')
                    | T
        v-col.ml-2(cols='8')
            nuxt-link.text-decoration-none(to='/dashboard', :style="`color: ${activeBoardId ? 'white' : 'black'};`")
                .font-weight-bold.text-subtitle-1
                    | Trello Không gian làm việc
                .text-subtitle-2
                    | Miễn phí
        v-col(cols='3')
            v-btn(icon='mdi-chevron-left', flat='', @click='handleShowSidebar', color='transparent')
    v-divider(:thickness='2')
    .ml-3.mr-3
        v-btn.w-100.d-flex.justify-start.mt-2(variant='text', to='/dashboard')
            v-icon.mr-2(icon='mdi-trello')
            | Bảng
        .d-flex.justify-space-between.mt-2
            p.text-subtitle-1 Các bảng của bạn
            v-icon.add-board(icon='mdi-plus', @click='isAddBoard = true')
        .overflow-y-auto.board-group(v-if='isBoard')
            div(v-for='board in boards', :key='board.id')
                BoardSidebar(:board="board", :active-board-id="activeBoardId", @is-status="handleStatus")
        .mt-2(v-else='')
            span.text-caption Bạn chưa có bảng nào
        v-dialog.rounded-lg(v-model='isAddBoard', :max-width='450', persistent='')
            AddBoardModal(@close-add-board='isAddBoard = false', @status='handleStatus')
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
.d-flex.flex-column.mr-3(v-if='hideSidebar')
  .sidebar(@click='handleShowSidebar')
    .chevron-right
      v-icon(icon='mdi-chevron-right')
v-divider(:thickness='2', vertical='', v-if='!hideSidebar')
</template>

<script setup>
import AddBoardModal from '~~/features/board/AddBoardModal.vue';
import BoardSidebar from '~~/features/sidebar/BoardSidebar.vue';
import { useBoards } from '~~/store/useBoard';

const { activeBoardId } = defineProps(['activeBoardId']);
const boards = ref([]);
const isAddBoard = ref(false);
const isSuccess = ref(false);
const isFalse = ref(false);
const isBoard = ref(false);
const hideSidebar = ref(false);

const { boardStore } = await useBoards();

boards.value = boardStore.value;
isBoard.value = boardStore.value?.length !== 0;

watch(boardStore, async () => {
    const { boardStore } = await useBoards();
    boards.value = boardStore.value;
    isBoard.value = boardStore.value?.length !== 0;
});

function handleShowSidebar () {
  hideSidebar.value = !hideSidebar.value;
}

function handleStatus (event) {
    if (event) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
}
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
.sidebar {
  height: 100%;
  width: 16px;
  background-color: rgba(0, 0, 0, 0.4);
  cursor: pointer;
  animation: left-2-right .3s ease-in-out;

  .chevron-right {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    border-radius: 50%;
    margin: 16px 0 0 4px;
    background-color: rgba(0, 0, 0, 0.2);
    color: white;

    &:hover {
      background-color: rgba(0, 0, 0, 0.4);
    }
  }

  &:hover,
  &:hover .chevron-right {
    background-color: rgba(0, 0, 0, 0.4);

  }
}
</style>
