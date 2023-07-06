<template lang="pug">
v-form.description-form(v-model="descriptionForm", @submit.prevent="addDescription", v-click-outside="cancelDescription")
    div.description-header
        .d-flex.flex-column.selectionFontSize
            v-btn.ml-2(append-icon="mdi-chevron-down", flat="", @click = 'showSelectionFontSize = true')
                | Aa
            div.ml-2.listSelection(v-if="showSelectionFontSize")
                v-btn-toggle.d-flex.flex-column.h-auto(v-model='textFontSize', divided="", color='white', v-click-outside='closeSelectionFontSize')
                    v-btn.pl-2.pr-2.w-auto(v-for="[name, cls] in classes", :key="name", :value="cls", block="")
                        span(:class="cls") {{ name }}
        //-     v-list.list
        //-         v-list-item(v-for="[name, cls] in classes", :key="name", :value="cls")
        //-             v-list-item-title(:class="cls", @click.stop="selectFontSize") {{ name }}
        v-btn-toggle.ml-2.d-flex.align-center(v-model='textFormat', divided="" ,variant='outlined')
            v-btn.h-75.format-btn(icon='mdi-format-bold', value="font-weight-bold")
            v-btn.h-75.format-btn(icon='mdi-format-italic', value="font-italic")
            v-btn.h-75.format-btn(icon='mdi-format-underline', value="text-decoration-underline")
    v-divider(:thickness="2")
    div.description-body
        v-textarea(rows="4", v-model="content", :class="`${textFormat} ${textFontSize}`", placeholder="Làm cho mô tả của bạn tốt hơn nữa. Chèn nội dung, định dạng và hơn thế nữa")
    div.float-right
        v-btn(type="submit", color="success") Lưu 
        v-btn.ml-2(color="error", @click="cancelDescription") Hủy
</template>

<script setup>
const { description } = defineProps(['description']);
const emit = defineEmits(['cancelDescription']);
const descriptionForm = ref(null);
const textFormat = ref(description?.fontEmphasis);
const textFontSize = ref(description?.fontSize);
const content = ref(description?.content);
const showSelectionFontSize = ref(false);
const classes = ref([
    ['Heading 1', 'text-h6'],
    ['Heading 2', 'text-subtitle-1'],
    ['Heading 3', 'text-subtitle-2'],
    ['Heading 4', 'text-caption'],
]);
function addDescription () {
    console.log(textFontSize.value);
    console.log(textFormat.value);
}
function cancelDescription () {
    emit('cancelDescription');
};
function selectFontSize () {

}
function closeSelectionFontSize () {
    showSelectionFontSize.value = false;
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

    .selectionFontSize {
        position: relative;

        .listSelection {
            position: absolute;
            background-color: white;
            top: 36px;
            z-index: 2;
        }
    }
}

.format-btn {
    font-size: 0.8rem;
}
</style>