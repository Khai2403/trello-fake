<template lang="pug">
v-container
    v-card.pa-4
        v-row(no-gutters='')
            v-row(no-gutters='')
                h3 Thêm nhãn cho {{ card?.title }}
            v-icon.text-medium-emphasis.close-btn(icon='mdi-close', @click='closeAddLabelModal')
        v-form.mt-3(v-model='form', @submit.prevent='addLabel')
            v-color-picker.mb-4(v-model='labelColor', width='386', dot-size='25', swatches-max-height='100', canvas-height='100', :disabled='loading')
            v-text-field(v-model='labelTitle', label='Tiêu đề', :readonly='loading', density='comfortable')
            div.float-right.mt-4
                v-spacer
                v-btn.mr-2(color='error', :disabled='loading', @click='closeAddLabelModal') Đóng
                v-btn(color='success', :disabled='!form', :loading='loading', type='submit') Thêm
</template>

<script setup>
import { addLabelStore } from '~~/store/useCard';
import { toast } from "vue3-toastify";

const { card, cardId } = defineProps(['card', 'cardId'])
const emit = defineEmits(['closeAddLabel']);
const form = ref(null);
const loading = ref(false);
const labelColor = ref('#000');
const labelTitle = ref('');

async function addLabel () {
    loading.value = true;
    const validColorRegex_1 = /^#[0-9A-Fa-f]{8}$/;
    const validColorRegex_2 = /^#[0-9A-Fa-f]{6}$/;
    if (!validColorRegex_1.test(labelColor.value) && !validColorRegex_2.test(labelColor.value)) {
        toast.error("Màu không hợp lệ");
        emit('closeAddLabel');
        return;
    }
    const label = {
        color: labelColor.value,
        title: labelTitle.value
    }
    const { error } = await addLabelStore(cardId, label);
    if (error.value) {
        toast.error("Thêm nhãn thất bại");
    }
    emit('closeAddLabel');
    loading.value = false;
}

function closeAddLabelModal () {
    emit('closeAddLabel');
}
</script>

<style lang="scss" scoped></style>