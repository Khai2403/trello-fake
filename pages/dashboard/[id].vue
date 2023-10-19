<template lang="pug">
.dashboard-wrapper.d-flex(:style="`background-image: url('${board?.img}');background-color: ${board?.backgroundColor}; background-size: cover; background-position: center;`")
    MainSidebar(:active-board-id='id')
    .d-flex.overflow-x-auto.overflow-y-hidden
        draggable.work-list(v-model='workList', @change='draggableWork($event)', ghost-class='ghostWork', handle='.work', item-key='id')
            v-card.work.mr-5.rounded-lg(:draggable='true', v-for='(work, index) in workList', :key='work.id')
                workVue(:work-id='work.id', :board-id='id', :work-index='index', @is-status='handleStatus($event)', @is-delete-status='handleDeletedStatus', @added-drag-card = 'handelAddDragCard', @removed-drag-card = 'handelRemoveDragCard')
        .mt-4.mr-5
            div(v-if='!isAddWork')
                v-btn.add-work-btn.d-flex.align-center.rounded-lg.pa-6(min-width='300', @click='showAddWork')
                    v-icon.mr-1(icon='mdi-plus')
                    | Thêm danh sách khác
            v-form(v-if='isAddWork', v-model='formAddWork', @submit.prevent='addWork')
                v-card.new-board.rounded-lg.pa-2.h-auto(v-click-outside='closeAddWork', min-width='300')
                    v-card-title Tạo danh sách mới
                    v-card-text
                        v-text-field(v-model='newWorktitle', :readonly='loading', :disabled='loading', :rules='rules', density='comfortable', label='Tiêu đề', :autofocus='true')
                        .d-flex.float-right.mb-1
                            v-btn.mr-2(color='error', :disabled='loading', @click='closeAddWork') Đóng
                            v-btn(:disabled='!formAddWork', :loading='loading', type='submit', color='success') Tạo
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
    v-dialog.d-flex.align-center.justify-center(v-model='loadingProgress', :persistent='true', :max-width='200')
        .d-flex.justify-center.align-center
            v-progress-circular(color='success', :size='60', indeterminate='')
</template>

<script setup>
import { useBoards } from '~~/store/useBoard';
import { useWorkList } from '~~/store/useWork';
import { addActivity } from '~~/store/useCard';
import { useCollection, useUser } from '~~/composable/useFirebase';
import workVue from '~~/features/board/work.vue';
import MainSidebar from "~~/features/sidebar/MainSidebar.vue";

definePageMeta({
    layout: 'main',
    middleware: 'auth',
});

// useHead({
//   title: `${}`
// })

const workList = ref([]);          //nên để là mảng
const { id } = useRoute().params;
const formAddWork = ref(null);
const loading = ref(false);
const loadingProgress = ref(false);
const isAddWork = ref(false);
const newWorktitle = ref(null);
const isSuccess = ref(false);
const isFalse = ref(false);
const addedCardId = ref(null);
const removedCardId = ref(null);
const addedCardTitle = ref(null);
const removedCardTitle = ref(null);
const rules = [(value) => !!value || "Required!!!"];
const { user } = await useUser();

const { workListStore, updateWorkRank, updateDeletedWorkRank } = await useWorkList(id);
workList.value = workListStore.value;
watch(workListStore, async () => {
    const { workListStore: workListCurrent } = await useWorkList(id);
    if (workListCurrent !== null) {
        workList.value = workListCurrent.value;
    } else {
        workList.value = [];
    }
});

watchEffect(async () => {
    if (addedCardId.value === removedCardId.value && addedCardTitle.value && removedCardTitle.value) {
        const date = new Date();
        const createdAt = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()} ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        const actitvity = {
            activity: 'đã di chuyển thẻ này từ',
            moveFrom: removedCardTitle.value,
            moveTo: addedCardTitle.value,
            time: createdAt,
            userName: user.value.displayName,
            userEmail: user.value.email,
            userInitialName: user.value.photoURL
        }
        const { error } = await addActivity(addedCardId.value, actitvity);
        if (error.value) {
            isFalse.value = true;
        }
        addedCardId.value = null;
        removedCardId.value = null;
        addedCardTitle.value = null;
        removedCardTitle.value = null;
    }
});

const { boardDetail } = await useBoards();
const { board } = boardDetail(id);

useHead({
  title: `${board.value.title} | Trello`
})
async function draggableWork (event) {
    const { error } = await updateWorkRank(event.moved.oldIndex, event.moved.newIndex);
}

async function addWork () {
    loading.value = true;
    loadingProgress.value = true;
    const { error, addRecord } = useCollection('work-list');
    const newWork = {
        boardId: board.value.id,
        cards: [],
        rank: workList.value.length + 1,
        title: newWorktitle.value,
    }
    await addRecord(newWork);
    loading.value = false;
    isAddWork.value = false;
    loadingProgress.value = false;
    if (!error.value) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
}

function showAddWork () {
    isAddWork.value = true;
    newWorktitle.value = "";
}

function closeAddWork () {
    isAddWork.value = false;
    newWorktitle.value = '';
}
function handelAddDragCard (event1, event2) {
    addedCardId.value = event1;
    addedCardTitle.value = event2;
}

function handelRemoveDragCard (event1, event2) {
    removedCardId.value = event1;
    removedCardTitle.value = event2;
}

function handleStatus (event) {
    if (event) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
}

async function handleDeletedStatus (event, workRank) {
    if (event) {
        isSuccess.value = true;
        const { error } = await updateDeletedWorkRank(workRank);
    } else {
        isFalse.value = true;
    }
}
</script>

<style lang="scss" scoped>
.dashboard-wrapper {
    height: calc(100vh - 64px);

    ::-webkit-scrollbar {
        height: 15px;
        background-color: transparent;
    }

    &::-webkit-scrollbar-track {
        background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #888;
        border-radius: 10px;
    }

    .work-list {
        height: 100vh;
        display: flex;
        padding: 16px 0 16px 16px;
        flex: 1;

        &>.v-card {
            height: fit-content;
        }

        .work {
            min-width: 300px;
            max-width: 500px;
            height: fit-content;
            display: flex;
            flex-direction: column;

            ::-webkit-scrollbar {
                width: 6px;
                background-color: transparent;
            }
        }

    }

    .new-board {
        height: fit-content !important;
        max-height: 90vh;
        animation: fade 0.3s ease-in;
    }

    .add-work-btn {
        animation: fade 0.3s ease-in;
    }
}

.v-btn {
    text-transform: none;
}

@keyframes fade {
    from {
        opacity: 0;
    }

    to {
        opacity: 1;
    }
}

.ghostWork {
    background: #f1f1f1;
}

.ghostWork hr,
.ghostWork .workTitleWrapper,
.ghostWork>div {
    visibility: hidden;
}
</style>
