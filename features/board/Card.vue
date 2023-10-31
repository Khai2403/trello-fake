<template lang="pug">
.overflow-y-auto(v-if='authorizationCard')
    v-hover(v-slot='{ isHovering, props }')
        v-card.pa-3(v-bind='props', :draggable='true', variant='text')
            div.w-100
                div.w-100.pa-2.card(@click='showDetailCard')
                    v-sheet.ml-1.d-flex.flex-wrap.card__label(v-if="card?.label")
                        v-sheet.mr-2.mb-2.card__label__content(v-for='(label, i) in card?.label' :key="i")
                            v-fade-transition
                                div.pl-2.pr-2(v-if='!showLabelTitle', :style="`background-color: ${label?.color}; height: 8px; width: 40px; border-radius: 6px; cursor: pointer;`", @click.stop='showLabelTitle = true')
                            v-scale-transition
                                div.pl-2.pr-2(v-if='showLabelTitle', :style="`background-color: ${label?.color}; height: 18px;min-width: 50px; max-width: 450px;border-radius: 6px; cursor: pointer;`", @click.stop='showLabelTitle = false')
                                    p.text-caption.text-center.text-white.text-truncate {{ label?.title }}
                    div.d-flex
                        .ml-1.text-subtitle-1.text-truncate.card__title {{ card?.title }}   
                        div
                            .align-center.justify-end.delete__card__btn(v-if='isHovering', @click.stop='deleteCard')
                                v-icon(icon='mdi-delete')
    v-divider(:thickness='1')
    v-dialog.d-flex.align-center.justify-center(v-model='loadingProgress', persistent='', :max-width='200')
        .d-flex.justify-center.align-center
            v-progress-circular(color='success', :size='60', indeterminate='')
    v-dialog.detail-modal(v-model="showDetailModal",persistent='')
        CardDetail(:work-title='workTitle', :board-id='boardId', :card-id='cardId', @close-detail-modal='showDetailModal = false', @is-status='handleStatus')
</template>

<script setup>
import { workDetail, updateCard } from '~~/store/useWork';
import { cardDetail } from '~~/store/useCard';
import { useUser, useDelete } from "~~/composable/useFirebase";
import CardDetail from '~~/features/board/CardDetail.vue';

const { workId, index, cardId, boardId } = defineProps(['workId', 'index', 'cardId', 'boardId']);
const emit = defineEmits(['isStatus']);
const loadingProgress = ref(false);
const cardsOfWork = ref([]);
const showLabelTitle = ref(false);
const showDetailModal = ref(false);
const workTitle = ref(null);
const rules = [(value) => !!value || "Required!!!"];
const card = ref(null);
const { work } = await workDetail(workId);
const { card: cardCurr } = await cardDetail(cardId);
card.value = cardCurr.value;
const { user } = await useUser();
const authorizationCard = ref(true);

if (!card.value.userId.includes(user.value.uid)) {
    authorizationCard.value = false;
} else {
    authorizationCard.value = true;
}

workTitle.value = work.value.title;
watch(work, async () => {
    const { work: workCurrent } = await workDetail(workId);
    workTitle.value = workCurrent.value.title;
    const cardIdTem = workCurrent.value.cards[index];
    if (cardIdTem !== null && cardIdTem !== undefined) {
        const { card: cardCurr } = await cardDetail(cardIdTem);
        card.value = cardCurr.value;
    }
});

watch(cardCurr, async () => {
    const cardIdTem = work.value.cards[index];
    if (cardIdTem !== null && cardIdTem !== undefined) {
        const { card: cardCurr } = await cardDetail(cardIdTem);
        card.value = cardCurr.value;
    }
    if (!card.value.userId.includes(user.value.uid)) {
        authorizationCard.value = false;
    } else {
        authorizationCard.value = true;
    }
})

function showDetailCard () {
    showDetailModal.value = true;
}

async function editTitleCard () {
    loadingProgress.value = true;
    const { work: workCurrent } = await workDetail(workId);
    cardsOfWork.value = workCurrent.value.cards;
    cardsOfWork.value[index] = cardTitleEdit.value;
    const { error } = await updateCard(workId, cardsOfWork.value);
    loadingProgress.value = false;
    cardTitleEdit.value = "";
    panel.value = [];
    if (!error.value) {
        emit('isStatus', true);
    } else {
        emit('isStatus', false);
    }
}

async function deleteCard () {
    loadingProgress.value = true;
    const { work: workCurrent } = await workDetail(workId);
    cardsOfWork.value = workCurrent.value.cards;
    const { error: errorDelete } = await useDelete("card", cardsOfWork.value[index]);
    if (errorDelete.value) {
        emit('isStatus', false);
        return;
    }
    cardsOfWork.value.splice(index, 1);
    const { error: errorUpdate } = await updateCard(workId, cardsOfWork.value);

    loadingProgress.value = false;
    if (!errorUpdate.value) {
        emit('isStatus', true);
    } else {
        emit('isStatus', false);
    }
};

function handleStatus (event) {
    if (event) {
        if (!card.value.userId.includes(user.value.uid)) {
            authorizationCard.value = false;
        } else {
            authorizationCard.value = true;
        }
        emit('isStatus', true);
    } else {
        emit('isStatus', false);
    }
}
</script>

<style lang="scss" scoped>
.card {
    cursor: pointer;

    &:hover {
        background-color: #f1f1f1;
        border-radius: 6px;

        .card__label {
            background-color: #f1f1f1;
        }
    }

    &:not(:hover) {
        .card__label {
            background-color: #fff;
        }
    }

    .card__label__content {
        background-color: #f1f1f1;
        animation: scaleUp 0.4s ease;
    }

    .card__title {
        width: 90%;
    }

    .delete__card__btn {
        &:hover {
            cursor: pointer;
            background-color: #ccc;
            border-radius: 6px;
        }
    }
}

.detail-modal {
    max-width: 85%;
    max-height: 85vh;

    ::-webkit-scrollbar {
        width: 12px;
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

.v-btn {
    text-transform: none;
}

@keyframes scaleUp {
    from {
        transform: scale(0);
    }

    to {
        transform: scale(1);
    }
}
</style>