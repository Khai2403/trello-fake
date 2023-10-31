<template lang="pug">
div
    v-hover(v-slot='{ isHovering, props }')
        label.workTitleWrapper.d-flex(v-bind='props', :for='workId')
            input.workTitle(type='text', :id='workId', :value='work.title', @change='onChangeTitle($event)')
            .d-flex.justify-center.align-center.ml-2.mr-2(v-if='!isHovering')
                v-badge(color='success', :content='amountOfCard')
                    v-icon(icon='mdi-card-multiple')
            .ml-2.mr-2.delete-btn.d-flex.align-center.justify-center(v-if='isHovering', @click.prevent='deleteWork()')
                v-icon(icon='mdi-window-close')
    v-divider(:thickness='1')
    .overflow-y-auto.card-group
        draggable(v-model='work.cards', group='cards', @change='draggableCard($event)', ghost-class='ghost', @add='addDraggableCard(workId, $event)', @remove='removeDraggableCard(workId, $event)')
            .card(v-for='(cardId, i) in work?.cards', :key='i')
                CardVue(:work-id='workId', :index='i', :card-id='cardId', :board-id='boardId', @is-status='handleStatus($event)')
    .d-flex.justify-center.mt-1.mb-2
        v-btn.add-card-btn.d-flex.algin-center.justify-center.pa-2.pl-2.rounded-lg(variant='text', @click='showAddCard()')
            v-icon.mr-1(icon='mdi-plus')
            | Thêm thẻ
    v-dialog(v-model='isAddCard', persistent='', :max-width='600')
        v-form(v-model='formAddCard', @submit.prevent='addCard')
            v-card.pa-3
                v-card-title
                    p.text-h6.mb-3 Thêm thẻ cho bảng "{{ work?.title }}"
                v-card-text
                    v-text-field(color='blue', v-model='cardTitle', :autofocus='true', :rules='rules', :disabled='loading', placeholder='Nhập tiêu đề cho thẻ này...', label='Tiêu đề', :readonly='loading')
                v-card-actions.float-right
                    v-spacer
                    v-btn(color='blue', :disabled='loading', @click='closeAddCard') Đóng
                    v-btn(color='blue', :disabled='!formAddCard', :loading='loading', type='submit') Thêm
    v-dialog.d-flex.align-center.justify-center(v-model='loadingProgress', persistent='', :max-width='200')
        .d-flex.justify-center.align-center
            v-progress-circular(color='success', :size='60', indeterminate='')
</template>

<script setup>
import { workDetail, editWorkTitle, updateCard } from '~~/store/useWork';
import { useCollection, useUser, useDelete } from '~~/composable/useFirebase';
import { numberOfCards } from '~~/store/useCard';
import CardVue from '~~/features/board/Card.vue';

const { workId, boardId } = defineProps(['workId', 'boardId']);
const emit = defineEmits(['isStatus', 'isDeleteStatus', 'addedDragCard', 'removedDragCard']);
const amountOfCard = ref(null);
const formAddCard = ref(null);
const isAddCard = ref(false);
const cardsOfWork = ref([]);
const cardTitle = ref(null);
const work = ref(null);
const loading = ref(false);
const loadingProgress = ref(false);
const rules = [(value) => !!value || "Required!!!"];

const { work: workCurr } = await workDetail(workId);
work.value = workCurr.value;
const { total } = await numberOfCards(work.value.cards);
amountOfCard.value = total.value;

watch(workCurr, async () => {
    const { work: workCurrent } = await workDetail(workId);
    work.value = workCurrent.value;
    const { total } = await numberOfCards(work.value.cards);
    amountOfCard.value = total.value;
});

watch(total, async () => {
    const { total } = await numberOfCards(work.value.cards);
    amountOfCard.value = total.value;
});

async function onChangeTitle (event) {
    loadingProgress.value = true;
    const { error } = await editWorkTitle(workId, event.target.value);
    if (!error.value) {
        emit('isStatus', true);
    } else {
        emit('isStatus', false);
    }
    loadingProgress.value = false;
};

async function deleteWork () {
    loadingProgress.value = true;
    const { error } = await useDelete("work-list", workId);
    if (!error.value) {
        emit('isDeleteStatus', true, work.value.rank);
    } else {
        emit('isDeleteStatus', false, work.value.rank);
    }
    loadingProgress.value = false;
};

function showAddCard () {
    isAddCard.value = true;
    cardTitle.value = "";
};

async function draggableCard (event) {
    if (!event.removed && !event.added) {
        const { work: workCurrent } = await workDetail(workId);
        cardsOfWork.value = workCurrent.value.cards;
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
        const { error } = await updateCard(workId, cardsOfWork.value);
    } else if (event.added) {
        return;
    }
}

async function addDraggableCard (addedId, event) {
    const { work: workCurrent } = await workDetail(addedId);
    cardsOfWork.value = workCurrent.value.cards;
    const addedCardTitle = workCurrent.value.title;
    const newIndex = event.newIndex;
    const addedCardId = event.item._underlying_vm_;
    cardsOfWork.value.splice(newIndex, 0, addedCardId);
    const { error } = await updateCard(addedId, cardsOfWork.value);
    emit('addedDragCard', addedCardId, addedCardTitle)
    if (error.value) {
        emit('isStatus', false);
    }
}

async function removeDraggableCard (removedId, event) {
    const { work: workCurrent } = await workDetail(removedId);
    cardsOfWork.value = workCurrent.value.cards;
    const removedCardTitle = workCurrent.value.title;
    const oldIndex = event.oldIndex;
    const removedCardId = event.item._underlying_vm_;
    cardsOfWork.value.splice(oldIndex, 1);
    const { error } = await updateCard(removedId, cardsOfWork.value);
    emit('removedDragCard', removedCardId, removedCardTitle);
    if (error.value) {
        emit('isStatus', false);
    }
}

async function addCard () {
    loading.value = true;
    const { user } = await useUser();
    const { error: errorCard, addRecord } = useCollection('card');
    const date = new Date();
    const createdAt = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()} ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const card = {
        title: cardTitle.value,
        userId: [user.value.uid],
        label: [],
        description: '',
        createAt: createdAt,
        activityLog: [{
            activity: `đã thêm thẻ vào danh sách ${work.value.title}.`,
            moveFrom: '',
            moveTo: '',
            time: createdAt,
            userName: user.value.displayName,
            userEmail: user.value.email,
            userInitialName: user.value.photoURL
        }],
    }
    const response = await addRecord(card);
    if (errorCard.value) {
        emit('isStatus', false);
        cardTitle.value = "";
        return;
    }
    const { work: workCurrent } = await workDetail(workId);
    cardsOfWork.value = workCurrent.value.cards;
    cardsOfWork.value.push(response.id);
    const { error: errorWork } = await updateCard(workId, cardsOfWork.value);
    isAddCard.value = false;
    loading.value = false;
    if (!errorWork.value) {
        emit('isStatus', true)
    } else {
        emit('isStatus', false);
    }
    cardTitle.value = "";
}

function closeAddCard () {
    isAddCard.value = false;
    cardTitle.value = "";
};
async function handleStatus (event) {
    if (event) {
        const { total } = await numberOfCards(work.value.cards);
        amountOfCard.value = total.value;
        emit('isStatus', true)
    } else {
        emit('isStatus', false)
    }
}
</script>

<style lang="scss" scoped>
.workTitleWrapper {
    cursor: pointer;
    padding: 8px;
    width: 100%;
    display: flex;

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

    .delete-btn {
        &:hover {
            cursor: pointer;
            padding: 3px 0px;
            background-color: #ccc;
            border-radius: 6px;
        }
    }
}

.card-group {
    height: fit-content;
    max-height: 70vh;
}

.add-card-btn {
    width: 90%;

    &:hover {
        background-color: #ebebeb;
    }
}

.v-btn {
    text-transform: none;
}

.ghost {
    background: #f1f1f1;
}

.ghost>div {
    visibility: hidden;
}
</style>
