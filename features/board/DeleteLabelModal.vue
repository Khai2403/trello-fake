<template lang="pug">
v-container
    v-card.pa-4
        v-row(no-gutters='')
            v-row(no-gutters='')
                h3 Nhãn
            v-icon.text-medium-emphasis.close-btn(icon='mdi-close', @click='closeDeleteLabelModal')
        v-form.mt-3(v-model='form', @submit.prevent='deleteLabel')
            div.d-flex.align-center.mb-4(v-for="(label, index) in labels", @click="selectedLabel[index] = !selectedLabel[index]")
                div.checkbox.d-flex.align-center.justify-center(:style="`background-color: ${ selectedLabel[index] ? 'black' : 'white' };`")
                    v-icon(v-if="selectedLabel[index]" , icon="mdi-check-bold", color="white", size="14px")
                div.ml-2.d-flex.align-center.label(:style="`background-color: ${label?.color};`")
                    p.ml-2.text-white.text-body-2 {{ label?.title }}
            div.mb-4.mt-6
                v-btn(color='grey-lighten-1', :disabled='loading', block="", @click='addLabel') Tạo nhãn mới
            v-divider(:thickness="2", color="black")
            div.mt-4.mb-3
                v-btn.mb-3(color='success', :loading='loading', block="", type='submit') Lưu
                v-btn(color='error', :disabled='loading', block="", @click='closeDeleteLabelModal') Đóng
</template>

<script setup>
import { removeLabel } from '~~/store/useCard';
import { toast } from "vue3-toastify";

const { labels, cardId } = defineProps(['labels', 'cardId']);
const emit = defineEmits(['closeDeleteLabel', 'isAddLabel']);
const loading = ref(false);
const form = ref(null);
const selectedLabel = ref([]);

for (let index = 0; index < labels.length; index++) {
    selectedLabel.value.push(true);
}

function addLabel () {
    emit('isAddLabel');
}

async function deleteLabel () {
    const removedLabels = labels.filter((label, index) => {
        return !selectedLabel.value[index];
    })
    const { error } = await removeLabel(cardId, removedLabels);
    if (error.value) {
        toast.error("Thao tác thất bại");
    }
    emit('closeDeleteLabel');
}

function closeDeleteLabelModal () {
    emit('closeDeleteLabel');

}
</script>

<style lang="scss" scoped>
.checkbox {
    background-color: #000;
    width: 1rem;
    height: 1rem;
    cursor: pointer;
    border: 1px solid #000;
    border-radius: 4px;
}

.label {
    flex: 1;
    height: 30px;
    border-radius: 6px;
    cursor: pointer;
}

.v-btn {
    text-transform: none;
}
</style>