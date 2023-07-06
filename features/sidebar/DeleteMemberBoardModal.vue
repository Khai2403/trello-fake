<template lang="pug">
v-container
    v-card.pa-4
        v-row(no-gutters='')
            v-row(no-gutters='')
                h3 Xóa thành viên của {{ board.title }}
            v-icon.text-medium-emphasis.close-btn(icon='mdi-close', @click='closeDeleteMemberModal')
        v-form.mt-3(v-model='form', @submit.prevent='deleteMember')
            v-autocomplete(v-model="deletedMembers",:disabled="loading",color="blue-grey-lighten-2", closable-chips, chips, label='Email', :items="listInfoMember", multiple, item-value="id", item-title="fullName")
                template(v-slot:chip='{ props, item }')
                    v-chip(v-bind='props', :text='item.raw.fullName')
                template(v-slot:item='{ props, item }')
                    v-list-item(v-bind='props', :title='item?.raw?.fullName', :subtitle='item?.raw?.email')
            div.float-right
                v-spacer
                v-btn.mr-2(color='error', :disabled='loading', @click='closeDeleteMemberModal') Đóng
                v-btn(color='success', :disabled='!form', :loading='loading', type='submit') Xóa
</template>

<script setup>
import { updateBoardMember } from '~~/store/useBoard';
import { getInfoByUserId } from '~~/store/useUser';
import { useUser } from "~~/composable/useFirebase";

const { board } = defineProps(['board']);
const emit = defineEmits(['closeDeleteMember', 'status']);
const form = ref(null);
const loading = ref(false);
const deletedMembers = ref(null)
const listInfoMember = ref([]);
const listInfoMemberPre = ref(null);
const { user } = await useUser();
const listMember = ref(null);
listMember.value = board.userId.filter(memberId => memberId !== user.value.uid)
listInfoMemberPre.value = listMember.value.map(async (memberId) => {
    const member = await getInfoByUserId(memberId);
    return member;
})
listInfoMember.value = await Promise.all(listInfoMemberPre.value.map(async (promise) => {
    const result = await promise;
    return result;
}));
const rules = [(value) => !!value || "Required!!!"]

function closeDeleteMemberModal () {
    emit('closeDeleteMember');
}
async function deleteMember () {
    const listDeletedMembers = board.userId.filter((member) => {
        return !deletedMembers.value.includes(member)
    })
    const { error } = await updateBoardMember(board.id, listDeletedMembers);
    if (!error.value) {
        emit('status', true);
    } else {
        emit('status', false);
    }
    emit('closeDeleteMember');
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