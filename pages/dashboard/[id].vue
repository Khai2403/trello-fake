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
            <draggable class="work-list" :list="workList" @change="draggableWork($event)" drag-class="drag"
                ghost-class="ghostWork" handle=".work">
                <v-card :draggable="true" v-for="(work, index) in workList" :key="work.id" class="work mr-5 rounded-lg">
                    <v-hover v-slot="{ isHovering, props }">
                        <label v-bind="props" :for="work.id" class="workTitleWrapper d-flex">
                            <input type="text" :id="work.id" class="workTitle" :value="work.title"
                                @change="onChangeTitle(work.id, $event)">
                            <div class="d-flex justify-center align-center ml-2 mr-2">
                                <v-badge v-if="!isHovering" color="success" :content="numberOfCards[index]">
                                    <v-icon icon="mdi-card-multiple"></v-icon>
                                </v-badge>
                            </div>
                            <div v-if="isHovering" class="ml-2 mr-2 delete-btn d-flex align-center justify-center"
                                @click.prevent="deleteBoard(work.id)">
                                <v-icon icon="mdi-window-close"></v-icon>
                            </div>
                        </label>
                    </v-hover>
                    <v-divider :thickness="1"></v-divider>
                    <div class="overflow-y-auto">
                        <draggable :list="work.cards" @change="draggableCard(work.id, $event)" ghost-class="ghost">
                            <div v-for="(card, i) in work.cards" :key="i">
                                <v-hover v-slot="{ isHovering, props }">
                                    <v-card v-bind="props" :draggable="true" variant="text"
                                        class="d-flex align-center pa-2">
                                        <v-expansion-panels v-model="panels">
                                            <v-expansion-panel :value="cardTitleEdit[index][i]?.panelValue">
                                                <v-expansion-panel-title @click="showEditCardTitle(index, i)">
                                                    <template v-slot:actions="{ expanded }">
                                                        <v-icon :color="!expanded ? 'teal' : ''"
                                                            :icon="expanded ? 'mdi-pencil' : 'mdi-chevron-down'"></v-icon>
                                                    </template>
                                                    <div class="text-subtitle-1">{{ card }}</div>
                                                </v-expansion-panel-title>
                                                <v-expansion-panel-text>
                                                    <v-form v-model="formEditTitleCard"
                                                        @submit.prevent="editTitleCard(work.id, index, i)">
                                                        <v-text-field v-model="cardTitleEdit[index][i].title"
                                                            label="Tiêu đề" :rules="rules"></v-text-field>
                                                        <v-spacer></v-spacer>
                                                        <div class="d-flex justify-end">
                                                            <v-btn :disabled="!formEditTitleCard" color="success"
                                                                class="mr-3" width="100" type="submit">Chỉnh
                                                                sửa</v-btn>
                                                            <v-btn color="error" width="60"
                                                                @click.prevent="deleteCard(work.id, i)">Xóa</v-btn>
                                                        </div>
                                                    </v-form>
                                                </v-expansion-panel-text>
                                            </v-expansion-panel>
                                        </v-expansion-panels>
                                        <v-divider color="rgba(0,0,0,1)" v-if="isHovering" :thickness="2"
                                            vertical></v-divider>
                                        <div>
                                            <div v-if="isHovering && !cardTitleEdit[index][i]?.isEdit"
                                                class="ml-2 delete-btn" @click.prevent="deleteCard(work.id, i)">
                                                <v-icon icon="mdi-delete"></v-icon>
                                            </div>
                                        </div>
                                    </v-card>
                                    <v-divider :thickness="1"></v-divider>
                                </v-hover>
                            </div>
                        </draggable>
                    </div>
                    <div class="d-flex justify-center mt-1 mb-2">
                        <v-btn class="d-flex algin-center justify-center pa-2 pl-2 rounded-lg" variant="text"
                            @click="showAddCard(work.id)">
                            <v-icon icon="mdi-plus" class="mr-1"></v-icon>
                            Thêm thẻ
                        </v-btn>
                    </div>
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
                                density="comfortable" label="Tiêu đề"></v-text-field>
                            <div class="float-right mb-1">
                                <v-btn color="error" class="mr-2" @click="closeAddWork">Đóng</v-btn>
                                <v-btn :disabled="!formAddWork" :loading="loading" type="submit" color="success">Tạo</v-btn>
                            </div>
                        </v-card-text>
                    </v-card>
                </v-form>
            </div>
        </div>
        <v-dialog v-model="isAddCard" persistent :max-width="600">
            <v-form v-model="formAddCard" @submit.prevent="addCard">
                <v-card class="pa-3">
                    <v-card-title>
                        <p class="text-h6 mb-3">Thêm thẻ cho bảng "{{ specificalWork?.title }}"</p>
                    </v-card-title>
                    <v-card-text>
                        <v-text-field color="blue" v-model="cardTitle" :autofocus="true" :rules="rules" :disabled="loading"
                            placeholder="Nhập tiêu đề cho thẻ này..." label="Tiêu đề" :readonly="loading"></v-text-field>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="blue" :disabled="loading" @click="closeAddCard">Đóng</v-btn>
                        <v-btn color="blue" :disabled="!formAddCard" :loading="loading" type="submit">Thêm</v-btn>
                    </v-card-actions>
                </v-card>
            </v-form>
        </v-dialog>
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
import { useCollection, useDelete } from '~~/composable/useFirebase';
import { useWorkList, useBoards, updateCard, editWorkTitle } from '~~/store/useBoard';
import MainSidebar from "~~/components/MainSidebar.vue";

definePageMeta({
    layout: 'main',
    middleware: 'auth',
});

const isDetail = ref(true);
const { id } = useRoute().params;
const hideSidebar = ref(false);
const workList = ref([]);          //nên để là mảng
const isAddCard = ref(false);
const formAddWork = ref(null);
const formAddCard = ref(null);
const formEditTitleCard = ref(null);
const cardTitle = ref(null);
const cardTitleEdit = ref([]);
const workId = ref(null);
const loading = ref(false);
const loadingProgress = ref(false);
const specificalWork = ref(null);
const isAddWork = ref(false);
const newWorktitle = ref(null);
const isSuccess = ref(false);
const isFalse = ref(false);
const cardsOfWork = ref([]);
const panels = ref([]);
const numberOfCards = ref([]);
const rules = [(value) => !!value || "Required!!!"];

const { workListStore, workDetail, updateWorkRank } = await useWorkList(id);
workList.value = workListStore.value;
watch(workListStore, async () => {
    const { workListStore } = await useWorkList(id);
    workList.value = workListStore.value;
    for (let i = 0; i < workList.value.length; i++) {
        cardTitleEdit.value[i] = [];
        numberOfCards.value[i] = workList.value[i].cards.length;
        for (let j = 0; j < workList.value[i].cards.length; j++) {
            cardTitleEdit.value[i][j] = {
                isEdit: false,
                title: "",
                panelValue: i.toString() + j.toString(),
            };
        }
    }
});

for (let i = 0; i < workList.value.length; i++) {
    cardTitleEdit.value[i] = [];
    numberOfCards.value[i] = workList.value[i].cards.length;
    for (let j = 0; j < workList.value[i].cards.length; j++) {
        cardTitleEdit.value[i][j] = {
            isEdit: false,
            title: "",
            panelValue: i.toString() + j.toString(),
        };
    }
}

const { boardDetail } = await useBoards();
const { board } = boardDetail(id);

function handelHideSidebar () {
    hideSidebar.value = true;
}

async function onChangeTitle (editWorkId, event) {
    loadingProgress.value = true;
    const { error } = await editWorkTitle(editWorkId, event.target.value);
    if (!error.value) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
    loadingProgress.value = false;
};

async function draggableCard (draggableCardId, event) {
    const { work } = workDetail(draggableCardId);
    cardsOfWork.value = work.value.cards;
    const oldIndex = event.moved.oldIndex;
    const newIndex = event.moved.newIndex;
    const tmp = cardsOfWork.value[oldIndex];
    if (oldIndex < newIndex) {
        for (let i = oldIndex; i < newIndex; i++) {
            cardsOfWork.value[i] = cardsOfWork.value[i + 1];
        }
    } else {
        for (let i = oldIndex; i > newIndex; i--) {
            cardsOfWork.value[i] = cardsOfWork.value[i - 1];
        }
    }
    cardsOfWork.value[newIndex] = tmp;
    const { error } = await updateCard(draggableCardId, cardsOfWork.value);
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

async function addCard () {
    loading.value = true;
    cardsOfWork.value.push(cardTitle.value);
    const { error } = await updateCard(workId.value, cardsOfWork.value);
    isAddCard.value = false;
    loading.value = false;
    if (!error.value) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
    panels.value = [];
    cardTitle.value = "";
}

function showAddCard (event) {
    isAddCard.value = true;
    cardTitle.value = "";
    workId.value = event;
};

function closeAddCard () {
    isAddCard.value = false;
    cardTitle.value = "";
};

async function editTitleCard (editWorkId, workIndex, cardIndex) {
    loadingProgress.value = true;
    const { work } = workDetail(editWorkId);
    cardsOfWork.value = work.value.cards;
    cardsOfWork.value[cardIndex] = cardTitleEdit.value[workIndex][cardIndex].title;
    const { error } = await updateCard(editWorkId, cardsOfWork.value);
    loadingProgress.value = false;
    cardTitleEdit.value[workIndex][cardIndex].title = "";
    panels.value = [];
    if (!error.value) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
}

async function deleteCard (deleteWordId, cardIndex) {
    loadingProgress.value = true;
    const { work } = workDetail(deleteWordId);
    cardsOfWork.value = work.value.cards;
    cardsOfWork.value.splice(cardIndex, 1);
    const { error } = await updateCard(deleteWordId, cardsOfWork.value);
    loadingProgress.value = false;
    panels.value = [];
    if (!error.value) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
}

async function deleteBoard (deleteWorkId) {
    loadingProgress.value = true;
    const { error } = await useDelete("work-list", deleteWorkId);
    if (!error.value) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
    loadingProgress.value = false;
}

function showAddWork () {
    isAddWork.value = true;
    newWorktitle.value = "";
}

function closeAddWork () {
    isAddWork.value = false;
    newWorktitle.value = '';
}
function showEditCardTitle (workIndex, cardIndex) {
    cardTitleEdit.value[workIndex][cardIndex].isEdit = !cardTitleEdit.value[workIndex][cardIndex].isEdit;
    if (cardTitleEdit.value[workIndex][cardIndex].title) {
        cardTitleEdit.value[workIndex][cardIndex].title = "";
    }
    if (cardTitleEdit.value[workIndex][cardIndex].isEdit) {
        for (let i = 0; i < workList.value.length; i++) {
            for (let j = 0; j < workList.value[i].cards.length; j++) {
                if (i !== workIndex || j !== cardIndex) {
                    cardTitleEdit.value[i][j].isEdit = false;
                }
            }
        }
    }
}
watchEffect(() => {
    if (workId.value) {
        const { work } = workDetail(workId.value);
        specificalWork.value = work.value;
        cardsOfWork.value = specificalWork.value.cards;
    }
});
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
            max-height: 90vh;
            display: flex;
            flex-direction: column;

            ::-webkit-scrollbar {
                width: 6px;
                background-color: transparent;
            }

            .workTitleWrapper {
                cursor: pointer;
                padding: 8px;
                width: 100%;

                .workTitle {
                    flex: 1;
                    cursor: pointer;
                    padding: 4px;
                    font-size: 1.125rem;
                    font-weight: 600;
                    letter-spacing: 1px;
                }

                .workTitle:focus {
                    border: 2px solid #1D7AFC;
                    outline: none;
                    border-radius: 4px;
                }
            }

            .delete-btn {
                &:hover {
                    cursor: pointer;
                    padding: 3px 0px;
                    background-color: #ccc;
                    border-radius: 6px;
                }
            }

            .v-btn {
                text-transform: none;
                width: 90%;

                &:hover {
                    background-color: #ebebeb;
                }
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

.drag>.work {
    transform: rotate(100deg);
}

.ghostWork,
.ghost {
    background: #f1f1f1;
}

.ghostWork input,
.ghostWork hr,
.ghostWork>div {
    visibility: hidden;
}

.ghost>div {
    visibility: hidden;
}
</style>