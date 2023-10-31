<template lang="pug">
v-form.description-form(v-model="descriptionForm", @submit.prevent="addDescription", v-click-outside="cancelDescription")
    div.pb-4
        MdEditor(v-model="content", language="en-US",:toolbars="toolbars", :placeholder="`${content ? '' : 'Thêm mô tả cho thẻ của bạn.'}`")
    div.float-right
        v-btn(type="submit", color="success") Lưu
        v-btn.ml-2(color="error", @click="cancelDescription") Hủy
</template>

<script setup>
import { MdEditor } from 'md-editor-v3';
import 'md-editor-v3/lib/style.css';
import { updatePropertyCard } from '~~/store/useCard';

const { description, cardId } = defineProps(['description', 'cardId']);
const emit = defineEmits(['cancelDescription', 'status']);
const descriptionForm = ref(null);
const content = ref(description ? description : '');
const toolbars = [
    'bold',
    'underline',
    'italic',
    '-',
    'title',
    'sub',
    'sup',
    '-',
    'codeRow',
    'code',
    'link',
    'table',
    '-',
    'preview',
];
const classes = ref([
    ['Heading 1', 'text-h6'],
    ['Heading 2', 'text-subtitle-1'],
    ['Heading 3', 'text-subtitle-2'],
    ['Heading 4', 'text-caption'],
]);

async function addDescription () {
    const { error } = await updatePropertyCard(cardId, 'description', content.value);
    if (error.value) {
        emit('status', false);
    }
    emit('cancelDescription');
}
function cancelDescription () {
    emit('cancelDescription');
};

</script>

<style lang="scss" scoped>
.v-btn {
    text-transform: none;
}
</style>
