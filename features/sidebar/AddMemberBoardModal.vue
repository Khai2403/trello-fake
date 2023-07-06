<template lang="pug">
v-container
    v-card.pa-4
        v-row(no-gutters='')
            v-row(no-gutters='')
                h3 Thêm thành viên của {{ board.title }}
            v-icon.text-medium-emphasis.close-btn(icon='mdi-close', @click='closeAddMemberModal')
        v-form.mt-3(v-model='form', @submit.prevent='addMember')
            v-text-field(v-model="emailMember", :autofocus='true', :rules='rules', :disabled='loading', placeholder='Địa chỉ email', label='Email', :readonly='loading')
            div.float-right
                v-spacer
                v-btn.mr-2(color='error', :disabled='loading', @click='closeAddMemberModal') Đóng
                v-btn(color='success', :disabled='!form', :loading='loading', type='submit') Thêm
</template>

<script setup>
import { updateBoardMember } from '~~/store/useBoard';
import { getUserIdByEmail } from '~~/store/useUser';
import { useUser } from "~~/composable/useFirebase";
import { toast } from "vue3-toastify";

const { board } = defineProps(['board']);
const emit = defineEmits(['closeAddMember', 'status']);
const form = ref(null);
const loading = ref(false);
const emailMember = ref(null);
const rules = [(value) => !!value || "Required!!!"]

function closeAddMemberModal () {
    emit('closeAddMember');
}
async function addMember () {
    const addMemberId = await getUserIdByEmail(emailMember.value);
    if (addMemberId === null) {
        toast.error("Email không tổn tại");
        emit('closeAddMember');
        return;
    }
    const { user } = await useUser();
    const listMember = board.userId;
    if (addMemberId === user.value.uid) {
        toast.error("Bạn không thể thêm chính bạn!!!");
        emit('closeAddMember');
        return;
    } else if (listMember.includes(addMemberId)) {
        toast.info("Thành viên đã ở trong bảng!");
        emit('closeAddMember');
        return;
    } else {
        listMember.push(addMemberId);
    }
    const { error } = await updateBoardMember(board.id, listMember);
    if (!error.value) {
        emit('status', true);
    } else {
        emit('status', false);
    }
    emit('closeAddMember');
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
</style>