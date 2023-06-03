<template>
    <div class="overflow-y-auto">
        <v-hover v-slot="{ isHovering, props }">
            <v-card v-bind="props" :draggable="true" variant="text" class="overflow-hidden d-flex align-center pa-2">
                <v-expansion-panels v-model="panel">
                    <v-expansion-panel :value="card">
                        <v-expansion-panel-title @click="showEditCardTitle">
                            <template v-slot:actions="{ expanded }">
                                <v-icon :color="!expanded ? 'teal' : ''"
                                    :icon="expanded ? 'mdi-pencil' : 'mdi-chevron-down'"></v-icon>
                            </template>
                            <div class="text-subtitle-1">{{ card }}</div>
                        </v-expansion-panel-title>
                        <v-expansion-panel-text>
                            <v-form v-model="formEditTitleCard" @submit.prevent="editTitleCard">
                                <v-text-field v-model="cardTitleEdit" label="Tiêu đề" :rules="rules"></v-text-field>
                                <v-spacer></v-spacer>
                                <div class="d-flex justify-end">
                                    <v-btn :disabled="!formEditTitleCard" color="success" class="mr-3" width="100"
                                        type="submit">Chỉnh
                                        sửa</v-btn>
                                    <v-btn color="error" width="60" @click.prevent="deleteCard()">Xóa</v-btn>
                                </div>
                            </v-form>
                        </v-expansion-panel-text>
                    </v-expansion-panel>
                </v-expansion-panels>
                <v-divider color="rgba(0,0,0,1)" v-if="isHovering" :thickness="2" vertical></v-divider>
                <div>
                    <div v-if="isHovering && !isEditCardTitle" class="ml-2 delete-btn" @click.prevent="deleteCard()">
                        <v-icon icon="mdi-delete"></v-icon>
                    </div>
                </div>
            </v-card>
            <v-divider :thickness="1"></v-divider>
        </v-hover>
        <v-dialog v-model="loadingProgress" persistent :max-width="200" class="d-flex align-center justify-center">
            <div class="d-flex justify-center align-center">
                <v-progress-circular color="success" :size="60" indeterminate></v-progress-circular>
            </div>
        </v-dialog>
    </div>
</template>

<script setup>
import { workDetail, updateCard } from '~~/store/useBoard';

const { workId, index } = defineProps(['workId', 'index']);
const emit = defineEmits(['isStatus']);
const formEditTitleCard = ref(null);
const card = ref(null);
const loadingProgress = ref(false);
const cardTitleEdit = ref(null);
const cardsOfWork = ref([]);
const rules = [(value) => !!value || "Required!!!"];
const panel = ref([]);
const isEditCardTitle = ref(false);

const { work } = await workDetail(workId);

card.value = work.value.cards[index];

watch(work, async () => {
    const { work: workCurrent } = await workDetail(workId);
    card.value = workCurrent.value.cards[index];
});

function showEditCardTitle () {
    if (panel.value) {
        isEditCardTitle.value = true;
    } else {
        isEditCardTitle.value = false;
    }
    cardTitleEdit.value = "";
}

async function editTitleCard () {
    loadingProgress.value = true;
    const { work: workCurrent } = await workDetail(workId);
    cardsOfWork.value = workCurrent.value.cards;
    cardsOfWork.value[index] = cardTitleEdit.value;
    const { error } = await updateCard(workId, cardsOfWork.value);
    loadingProgress.value = false;
    isEditCardTitle.value = false;
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
    isEditCardTitle.value = false;
    loadingProgress.value = false;
    if (!error.value) {
        emit('isStatus', true);
    } else {
        emit('isStatus', false);
    }
}
</script>

<style lang="scss" scoped>
.delete-btn {
    &:hover {
        cursor: pointer;
        padding: 3px 0px;
        background-color: #ccc;
        border-radius: 6px;
    }
}
</style>