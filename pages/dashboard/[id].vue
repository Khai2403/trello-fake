<template>
    <div class="dashboard-wrapper"
        :style="`background-image: url('${board?.img}');background-color: ${board?.backgroundColor}; background-size: cover; background-position: center;`">
        <v-fade-transition v-if="!hideSidebar">
            <MainSidebar v-show="!hideSidebar" @hide-sidebar="handelHideSidebar" :is-detail="isDetail"
                :active-work-id="id" />
        </v-fade-transition>
        <div v-if="hideSidebar" class="d-flex flex-column mr-3">
            <div class="sidebar" @click="hideSidebar = false">
                <div class="chevron-right">
                    <v-icon icon="mdi-chevron-right"></v-icon>
                </div>
            </div>
        </div>
        <v-divider :thickness="2" vertical v-if="!hideSidebar"
            :style="`color: ${isDetail ? 'white' : 'black'};`"></v-divider>
        <div class="d-flex overflow-x-auto overflow-y-hidden">
            <draggable class="work-list" :list="workList" @change="draggableWork($event)" ghost-class="ghostWork"
                handle=".work" item-key="id">
                <v-card :draggable="true" v-for="(work, index) in workList" :key="work.id" class="work mr-5 rounded-lg">
                    <workVue :work-id="work.id" :work-index="index" :board-id="id" @is-status="handleStatus($event)"
                        @is-delete-status="handleDeletedStatus">
                    </workVue>
                </v-card>
            </draggable>
            <div class="mt-4 mr-5">
                <div v-if="!isAddWork">
                    <v-btn class="add-work-btn d-flex align-center rounded-lg pa-6" min-width="300" @click="showAddWork">
                        <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                        Thêm danh sách khác
                    </v-btn>
                </div>
                <v-form v-if="isAddWork" v-model="formAddWork" @submit.prevent="addWork">
                    <v-card v-click-outside="closeAddWork" class="new-board rounded-lg pa-2 h-auto" min-width="300">
                        <v-card-title>Tạo danh sách mới</v-card-title>
                        <v-card-text>
                            <v-text-field v-model="newWorktitle" :readonly="loading" :disabled="loading" :rules="rules"
                                density="comfortable" label="Tiêu đề" :autofocus="true"></v-text-field>
                            <div class="d-flex float-right mb-1">
                                <v-btn color="error" class="mr-2" @click="closeAddWork">Đóng</v-btn>
                                <v-btn :disabled="!formAddWork" :loading="loading" type="submit" color="success">Tạo</v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-form>
            </div>
        </div>

        <v-snackbar v-model="isSuccess" color="success" :timeout="3000">
            Success!!!

            <template v-slot:actions>
                <v-btn variant="text" @click="isSuccess = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <v-snackbar v-model="isFalse" color="error" :timeout="3000">
            Failure!!!

            <template v-slot:actions>
                <v-btn variant="text" @click="isFalse = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <v-dialog v-model="loadingProgress" persistent :max-width="200" class="d-flex align-center justify-center">
            <div class="d-flex justify-center align-center">
                <v-progress-circular color="success" :size="60" indeterminate></v-progress-circular>
            </div>
        </v-dialog>
    </div>
</template>

<script setup>
import { useWorkList, useBoards } from '~~/store/useBoard';
import { useCollection } from '~~/composable/useFirebase';
import MainSidebar from "~~/components/MainSidebar.vue";
import workVue from '~~/components/work.vue';

definePageMeta({
    layout: 'main',
    middleware: 'auth',
});

const workList = ref([]);          //nên để là mảng
const isDetail = ref(true);
const { id } = useRoute().params;
const hideSidebar = ref(false);
const formAddWork = ref(null);
const loading = ref(false);
const loadingProgress = ref(false);
const isAddWork = ref(false);
const newWorktitle = ref(null);
const isSuccess = ref(false);
const isFalse = ref(false);
const rules = [(value) => !!value || "Required!!!"];

const { workListStore, updateWorkRank, updateDeletedWorkRank } = await useWorkList(id);
workList.value = workListStore.value;
watch(workListStore, async () => {
    const { workListStore } = await useWorkList(id);
    workList.value = workListStore.value;
});

const { boardDetail } = await useBoards();
const { board } = boardDetail(id);

function handelHideSidebar () {
    hideSidebar.value = true;
}

async function draggableWork (event) {
    const { error } = await updateWorkRank(event.moved.oldIndex, event.moved.newIndex);
}

async function addWork () {
    loading.value = true;
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
    height: 100vh;
    display: flex;

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
            background-color: rgba(0, 0, 0, 0.4);
            color: white;

            &:hover {
                background-color: rgba(0, 0, 0, 0.6);
            }
        }

        &:hover,
        &:hover .chevron-right {
            background-color: rgba(0, 0, 0, 0.6);

        }
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

@keyframes left-2-right {
    from {
        transform: translateX(-100%);
    }

    to {
        transform: translateX(0);
    }
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