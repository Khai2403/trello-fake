<template lang="pug">
v-form.description-form(v-model="descriptionForm", @submit.prevent="addDescription")
    div.description-header
        v-menu(transition="slide-y-transition")
            template(v-slot:activator='{ props }')
                v-btn.ml-2(v-bind='props', append-icon="mdi-chevron-down", flat="")
                    | Aa
            v-list
                v-list-item(v-for="[name, cls] in classes", :key="name", :value="cls")
                    v-list-item-title(:class="cls") {{ name }}
        v-btn-toggle.ml-2.d-flex.align-center(v-model='textFormat', divided="" ,variant='outlined')
            v-btn.h-75.format-btn(icon='mdi-format-bold')
            v-btn.h-75.format-btn(icon='mdi-format-italic')
            v-btn.h-75.format-btn(icon='mdi-format-underline')
    v-divider(:thickness="2")
    div.description-body
        v-textarea(rows="3", placeholder="Làm cho mô tả của bạn tốt hơn nữa. Chèn nội dung, định dạng và hơn thế nữa")
    div.float-right
        v-btn(type="submit", color="success") Lưu 
        v-btn.ml-2(color="error", @click="cancelDescription") Hủy
</template>

<script setup>
const emit = defineEmits(['cancelDescription'])
const descriptionForm = ref(null);
const textFormat = ref(null);
const content = ref(null);
const classes = ref([
    ['Heading 1', 'text-h6'],
    ['Heading 2', 'text-subtitle-1'],
    ['Heading 3', 'text-subtitle-2'],
    ['Heading 4', 'text-caption'],
]);
function addDescription () {

}
function cancelDescription () {
    emit('cancelDescription');
}
</script>

<style lang="scss" scoped>
.v-btn {
    text-transform: none;
}

.description-header {
    background-color: #f1f1f1;
    display: flex;
    align-items: center;
}

.format-btn {
    font-size: 0.8rem;
}
</style>