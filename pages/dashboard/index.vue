<template>
    <v-container class="board-wrapper overflow-y-auto" id="scroll-target">
        <v-row>
            <v-col cols="3" xs="12" sm="6" md="4" lg="3" v-for="board in boards" :key="board.id" class="card">
                <NuxtLink :to="`/dashboard/${board.id}`" class="text-decoration-none">
                    <v-card class="ml-3 rounded-lg text-white"
                        :style="`background-color: ${board?.backgroundColor}; background-image: url('${board?.img}');background-size: cover;background-position: center;`">
                        <p class="d-flex justify-start mt-1 ml-2">{{ board.title }}</p>
                        <p class="d-flex justify-start ml-2">{{ board.createdAt }}</p>
                    </v-card>
                </NuxtLink>
            </v-col>
            <v-col cols="3" xs="12" sm="6" md="4" lg="3" class="card">
                <v-card class="ml-3 d-flex justify-center align-center" @click="addBoard = true">
                    <p class="">Tạo bảng mới</p>
                </v-card>
            </v-col>
        </v-row>
        <v-dialog v-model="addBoard" :max-width="450" class="rounded-lg" persistent>
            <add-board-modal @close-add-board="addBoard = false" @status="handelStatus" />
        </v-dialog>
        <v-snackbar v-model="isSuccess" color="success" :timeout="3000">
            Success!!!

            <template v-slot:actions>
                <v-btn variant="text" @click="isSuccess = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
        <v-snackbar v-model="isFalse" color="error" :timeout="3000">
            Failure!!!

            <template v-slot:actions>
                <v-btn variant="text" @click="isFalse = false">
                    Close
                </v-btn>
            </template>
        </v-snackbar>
    </v-container>
</template>

<script setup>
import AddBoardModal from '~~/components/AddBoardModal.vue';
import { useBoards } from '~~/store/useBoard'

definePageMeta({
    layout: 'main',
    middleware: 'auth',
});

const boards = ref([]);
const addBoard = ref(false);
const isSuccess = ref(false);
const isFalse = ref(false);

const { boardStore } = await useBoards();

boards.value = boardStore.value;

watch(boardStore, async () => {
    const { boardStore } = await useBoards();

    boards.value = boardStore.value;
})


function handelStatus (event) {
    if (event) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
};
</script>

<style lang="scss" scoped>
.board-wrapper {
    height: 600px;

    ::-webkit-scrollbar {
        width: 10px;
        height: 10px;
        background-color: #f1f1f1;
    }

    ::-webkit-scrollbar-track {
        background-color: #eee;
    }

    ::-webkit-scrollbar-thumb {
        background-color: #888;
        border: 2px solid #fff;
        border-radius: 10px;
    }
}

.card {
    cursor: pointer;

    .v-card {
        min-height: 120px;
        box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.4);
    }

    &:hover .v-card {
        background-color: #ccc;
    }

    &>.v-card {
        background-color: #ebebeb;
    }
}

.router-link {
    text-transform: none;
}
</style>