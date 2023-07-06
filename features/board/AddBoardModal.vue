<template lang="pug">
v-container
    v-card.pa-4
        v-row(no-gutters='')
            v-row(no-gutters='')
                h3 Tạo bảng
            v-icon.text-medium-emphasis.close-btn(icon='mdi-close', @click='closeAddBoardModal')
        v-form.mt-3(v-model='form', @submit.prevent='addBoard')
            v-text-field(v-model='boardTitle', label='Tên bảng', :rules='rules', :readonly='loading', density='comfortable')
            v-btn.w-100(v-if='!chooseColor', @click='chooseColor = true', depressed='', color='#ddd', :disabled='loading')
                | Chọn màu cho bảng
            v-color-picker(v-model='backgroundColor', v-if='chooseColor', width='386', dot-size='25', hide-inputs='', swatches-max-height='100', canvas-height='100', :disabled='loading')
            label.d-flex.align-center.justify-center.flex-column.mt-3.upload-block(for='boardImg', 
            :style="`background-image: url('${boardImgUrl ? boardImgUrl : ''}');height:150px;background-size: cover;background-position: center;`")
                template(v-if='!fileToUploProgress && !boardImgUrl')
                    v-icon(icon='mdi-camera')
                    p Thêm ảnh nền
                input#boardImg(type='file', accept='jpg, jpeg, png', ref='boardBackground', buffer-value='0', @change='onFileSelected($event)', style='display: none', :disabled='loading')
                template(v-if='fileToUploProgress')
                    .text-center
                        v-progress-circular(:size='50', color='green', indeterminate='')
            v-btn.w-100(:disabled='!form', :loading='loading', type='submit', color='success') Tạo bảng
</template>

<script setup>
import { useCollection, useStorage, useUser } from '~~/composable/useFirebase';

const emit = defineEmits(['closeAddBoard', 'status']);
const rules = [(value) => !!value || "Required!!!"]
const form = ref(null);
const loading = ref(false);
const boardTitle = ref(null);
const chooseColor = ref(false);
const backgroundColor = ref("#FF9E80");
const boardImgUrl = ref(null);
const fileToUploProgress = ref(false);
const file = ref(null);
const { error, addRecord } = useCollection('dashboard');
const { url, uploadFile } = await useStorage('dashboard');

function closeAddBoardModal () {
    emit('closeAddBoard');
}

async function onFileSelected (event) {
    fileToUploProgress.value = true;
    const imageSelected = event.target.files[0];
    if (imageSelected) {
        file.value = imageSelected;
    } else {
        file.value = null;
    }
    if (file.value) {
        await uploadFile(file.value);
    }
    boardImgUrl.value = url.value;
    fileToUploProgress.value = false;
}

async function addBoard () {
    loading.value = true;
    const { user } = await useUser();
    const date = new Date();
    const createdAt = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
    const board = {
        backgroundColor: backgroundColor.value,
        userId: user.value.uid,
        img: boardImgUrl.value ? boardImgUrl.value : '',
        title: boardTitle.value,
        createdAt: createdAt
    }
    await addRecord(board);
    emit('closeAddBoard');
    loading.value = false;
    if (!error.value) {
        emit('status', true);
    } else {
        emit('status', false);
    }

}
</script>

<style lang="scss" scoped>
.close-btn:hover {
    background-color: #ccc;
    cursor: pointer;
    border-radius: 4px;
}

.v-btn {
    text-transform: none;
}

.upload-block {
    border: 2px dashed #adadad;
    padding: 30px;
    border-radius: 15px;
    margin-bottom: 20px;

    &:hover {
        cursor: pointer;
    }
}
</style>