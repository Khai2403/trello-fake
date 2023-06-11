<template lang="pug">
.overflow-y-auto
    v-hover(v-slot='{ isHovering, props }')
        v-card.pa-3(v-bind='props', :draggable='true', variant='text')
            div.w-100
                div.w-100.pa-2.d-flex.card(@click='showDetailCard')
                    .ml-1.text-subtitle-1.text-truncate.card__title {{ card }}
                    div
                        .align-center.justify-end.delete__card__btn(v-if='isHovering', @click.prevent='deleteCard')
                            v-icon(icon='mdi-delete')
    v-divider(:thickness='1')
    v-dialog.d-flex.align-center.justify-center(v-model='loadingProgress', persistent='', :max-width='200')
        .d-flex.justify-center.align-center
            v-progress-circular(color='success', :size='60', indeterminate='')
    v-dialog.overflow-y-hidden.detail-modal(v-model="showDetailModal",persistent='')
        v-card.mb-4
            v-card-title
                div.d-flex.align-start
                    v-icon.mr-2(icon="mdi-card-text")
                    div.header__title
                        p.text-subtitle-1.font-weight-bold {{ card }}
                        span.text-subtitle-2 trong danh sách&nbsp
                        span.text-subtitle-2.text-decoration-underline {{ workTitle }}
                    div.header__close-btn(@click='showDetailModal = false')
                        v-icon(icon="mdi-window-close")
            v-card-text
                v-row
                    v-col(cols="9")
                        v-row
                            v-col.d-flex(cols="12")
                                div
                                    v-icon.mr-2(icon="mdi-text-box")
                                div.description-wrapper
                                    | Mô tả
                                    div.description.pa-1.mt-2(v-if="!showDescriptionForm", @click="showDescriptionForm=true")
                                        span.ml-2.text-subtitle-2 Thêm mô tả chi tiết hơn...
                                    DescriptionForm(v-if="showDescriptionForm", @cancel-description="showDescriptionForm=false")
                        v-row
                            v-col.d-flex(cols="12")
                                div
                                    v-icon.mr-2(icon="mdi-format-list-text")
                                div.activity
                                    | Hoạt động
                    v-col(cols="3")
                        | Thêm vào thẻ

</template>

<script setup>
import { workDetail, updateCard } from '~~/store/useBoard';
import DescriptionForm from '~~/components/DescriptionForm.vue';

const { workId, index } = defineProps(['workId', 'index']);
const emit = defineEmits(['isStatus']);
const loadingProgress = ref(false);
const cardsOfWork = ref([]);
const showDetailModal = ref(false);
const workTitle = ref(null);
const showDescriptionForm = ref(false);
const descriptionForm = ref(null);
const rules = [(value) => !!value || "Required!!!"];

const { work } = await workDetail(workId);

const card = ref(work.value.cards[index]);
workTitle.value = work.value.title;

watch(work, async () => {
    const { work: workCurrent } = await workDetail(workId);
    card.value = workCurrent.value.cards[index];
    workTitle.value = work.value.title;
});

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
    cardsOfWork.value.splice(index, 1);
    const { error } = await updateCard(workId, cardsOfWork.value);
    loadingProgress.value = false;
    if (!error.value) {
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

    .header__title {
        flex: 1;
    }

    .header__close-btn {
        display: flex;
        align-items: center;

        &:hover {
            cursor: pointer;
            background-color: #ccc;
            border-radius: 6px;
        }
    }

    .description-wrapper {
        flex: 1;

        .description {
            height: 60px;
            cursor: pointer;
            background-color: #ccc;
            border-radius: 6px;
        }
    }
}
</style>