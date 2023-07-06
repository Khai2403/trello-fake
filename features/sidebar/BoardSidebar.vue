<template lang="pug">
v-hover(v-slot='{ isHovering, props: hover  }')
    .board.d-flex.align-center.w-100.mt-2(v-bind='hover')
        v-btn.board__btn.d-flex.justify-start.align-center(variant='text', :to='`/dashboard/${board.id}`')
            .d-flex.align-center.board__title
                .board__img(:style="`background-color: ${board?.backgroundColor}; background-image: url('${board?.img ? board?.img : ''}')`")
                | {{ board?.title }}
        .board__group-btn.ml-1.d-flex.align-center.justify-center(v-if='isHovering || isEditBoard', v-click-outside="closeMenu")
            v-menu(location='end', :open-on-click="true")
                template(v-slot:activator='{ props: menu }')
                    v-icon(icon='mdi-dots-horizontal',v-bind="menu", @click.prevent='getBoardId(board.id)')
                v-card.d-flex.flex-column
                    v-btn(variant="text", @click='showAddMember') Thêm thành viên
                    v-divider(:thickness="1")
                    v-btn(variant="text", @click='showDeleteMember') Xóa thành viên
                    v-divider(:thickness="1")
                    v-btn(variant="text", @click='deleteBoard') Xóa bảng
v-dialog.rounded-lg(v-model='isAddMember', :max-width='450', persistent='')
    AddMemberBoardModal(@close-add-member='isAddMember = false', :board="board", @status="handleStatus")
v-dialog.rounded-lg(v-model='isDeleteMember', :max-width='450', persistent='')
    DeleteMemberBoardModal(@close-delete-member='isDeleteMember = false', :board="board", @status="handleStatus")
v-dialog.d-flex.align-center.justify-center(v-model='loadingProgress', persistent='', :max-width='200')
    .d-flex.justify-center.align-center
        v-progress-circular(color='success', :size='60', indeterminate='')
</template>

<script setup>
import AddMemberBoardModal from '~~/features/sidebar/AddMemberBoardModal.vue';
import DeleteMemberBoardModal from '~~/features/sidebar/DeleteMemberBoardModal.vue';
import { useDelete } from '~~/composable/useFirebase';

const { board, activeBoardId } = defineProps(['board', 'activeBoardId']);
const emit = defineEmits(['isStatus'])
const isAddMember = ref(false);
const isEditBoard = ref(false);
const isDeleteMember = ref(false);
const loadingProgress = ref(false);

function showAddMember () {
    isAddMember.value = true;
};
function showDeleteMember () {
    isDeleteMember.value = true;
};
function getBoardId (event) {
    isEditBoard.value = true;
};
function closeMenu () {
    isEditBoard.value = false;
};
async function deleteBoard () {
    loadingProgress.value = true;
    const { error } = await useDelete("dashboard", board.id);
    if (activeBoardId == board.id) {
        navigateTo('/dashboard');
    }
    if (!error.value) {
        emit('isStatus', true);
    } else {
        emit('isStatus', false);
    }
    loadingProgress.value = false;
};
function handleStatus (event) {
    if (event) {
        emit('isStatus', true);
    } else {
        emit('isStatus', false);
    }
}
</script>

<style lang="scss" scoped>
.board {
    &:hover {
        background-color: rgba($color: #ccc, $alpha: 0.2);
        border-radius: 4px;
    }

    .board__img {
        min-height: 20px;
        min-width: 24px;
        background-size: cover;
        margin-right: 8px;
        border-radius: 4px;
    }

    .add__member__btn,
    .board__group-btn {
        flex: 1;

        .v-icon:hover {
            cursor: pointer;
            background-color: rgba($color: #ccc, $alpha: 0.6);
            border-radius: 4px;
        }

        .v-btn {
            padding: 4px;
        }
    }

    .board__btn {
        width: 85%;

        &:hover {
            background-color: rgba($color: #ccc, $alpha: 0.2);
        }
    }
}

.v-btn {
    text-transform: none;
}
</style>