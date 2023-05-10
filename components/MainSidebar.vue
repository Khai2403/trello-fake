<template>
    <div class="dashboard">
        <v-row class="dashboard__title" no-gutters>
            <v-col cols="2" class="dashboard__title__logo">
                <div class="w-100">
                    <nuxt-link to="/dashboard" class="text-white text-decoration-none d-flex justify-center">
                        T
                    </nuxt-link>
                </div>
            </v-col>
            <v-col cols="8" class="ml-2">
                <nuxt-link to="/dashboard" class="text-decoration-none text-black">
                    <div class="font-weight-bold text-subtitle-1">
                        Trello Không gian làm việc
                    </div>
                    <div class="text-subtitle-2">
                        Miễn phí
                    </div>
                </nuxt-link>
            </v-col>
            <v-col cols="3">
                <v-btn icon="mdi-chevron-left" flat @click="hideSidebar" color="transparent"></v-btn>
            </v-col>
        </v-row>
        <v-divider :thickness="2"></v-divider>
        <div class="ml-3 mr-3 ">
            <v-btn class="w-100 d-flex justify-start mt-2" variant="text" to="/dashboard">
                <v-icon icon="mdi-trello" class="mr-2"></v-icon>
                Bảng
            </v-btn>
            <div class="d-flex justify-space-between mt-2">
                <p class="text-subtitle-1">Các bảng của bạn</p>
                <v-icon class="add-board" icon="mdi-plus" @click="addBoard = true"></v-icon>
            </div>
            <div class="overflow-y-auto board-group">
                <v-btn v-for="board in boards" :key="board.id" class="w-100 d-flex justify-start mt-2" variant="text"
                    :to="`/dashboard/${board.id}`">
                    <div :style="`background-color: ${board?.backgroundColor}; background-image: url('${board?.img}')`"
                        class="board-img">
                    </div>

                    {{ board.title }}
                </v-btn>
            </div>
            <v-dialog v-model="addBoard" :max-width="450" class="rounded-lg" persistent>
                <add-board-modal @close-add-board="addBoard = false" @status="handelStatus" />
            </v-dialog>
        </div>
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
    </div>
</template>

<script setup>
import { collection, getDocs, getFirestore, onSnapshot } from 'firebase/firestore';
import AddBoardModal from './AddBoardModal.vue';

const emit = defineEmits(['hideSidebar'])
const boards = ref([]);
const addBoard = ref(false);
const isSuccess = ref(false);
const isFalse = ref(false);

const db = getFirestore();
const dbCollection = collection(db, 'dashboard');
const response = await getDocs(dbCollection);
boards.value = response.docs.map((doc) => {
    return { ...doc.data(), id: doc.id };
});

onSnapshot(dbCollection, (snap) => {
    boards.value = snap.docs.map((doc) => {
        return { ...doc.data(), id: doc.id };
    });
});


function hideSidebar () {
    emit('hideSidebar');
}

function handelStatus (event) {
    if (event) {
        isSuccess.value = true;
    } else {
        isFalse.value = true;
    }
};
</script>

<style lang="scss" scoped>
.dashboard {
    min-width: 300px;

    .dashboard__title {
        display: flex;
        align-items: center;
        flex-wrap: nowrap;
        margin: 8px 12px;

        .dashboard__title__logo {
            max-width: 32px;
            height: 32px;
            display: flex;
            align-items: center;
            color: white;
            background: linear-gradient(#6E5DC6, #0C66E4);
            font-weight: bold;
            font-size: 1.25rem;
            border-radius: 4px;
        }
    }

    .v-btn {
        text-transform: none;
    }

    .add-board:hover {
        background-color: #ccc;
        cursor: pointer;
        border-radius: 4px;
    }

    .board-img {
        min-height: 20px;
        min-width: 24px;
        background-size: cover;
        margin-right: 8px;
        border-radius: 4px;
    }

    .board-group {
        max-height: 410px;

    }

    ::-webkit-scrollbar {
        width: 10px;
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
</style>