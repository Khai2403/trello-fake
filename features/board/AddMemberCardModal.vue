<template lang="pug">
v-container
    v-card.pa-4
        v-row(no-gutters='')
            v-row(no-gutters='')
                h3 Thêm thành viên của {{ card?.title }}
            v-icon.text-medium-emphasis.close-btn(icon='mdi-close', @click='closeAddMemberModal')
        v-form.mt-3(v-model='form', @submit.prevent='addMember')
            v-autocomplete(v-model="addedMembers",:disabled="loading",color="blue-grey-lighten-2", closable-chips, chips, label='Email', :items="listInfoMember", multiple, item-value="id", item-title="fullName")
                template(v-slot:chip='{ props, item }')
                    v-chip(v-bind='props', :text='item.raw.fullName')
                template(v-slot:item='{ props, item }')
                    v-list-item(v-bind='props', :title='item?.raw?.fullName', :subtitle='item?.raw?.email')
            div.float-right
                v-spacer
                v-btn.mr-2(color='error', :disabled='loading', @click='closeAddMemberModal') Đóng
                v-btn(color='success', :disabled='!form', :loading='loading', type='submit') Thêm
</template>

<script setup>
import { useBoards } from '~~/store/useBoard';
import { getInfoByUserId } from '~~/store/useUser';
import { updatePropertyCard, addActivity } from '~~/store/useCard';
import { useUser } from '~~/composable/useFirebase';

const { card, boardId, cardId } = defineProps(['card', 'boardId', 'cardId']);
const emit = defineEmits(['closeAddMember', 'status']);
const { boardDetail } = await useBoards();
const { board } = boardDetail(boardId);
const form = ref(null);
const loading = ref(false);
const addedMembers = ref(null)
const listInfoMember = ref([]);
const listInfoMemberPre = ref(null);
const listMember = ref(null);
const { user } = await useUser();

listMember.value = board.value.userId.filter(memberId => !card.userId.includes(memberId));
listInfoMemberPre.value = listMember.value.map(async (memberId) => {
    const member = await getInfoByUserId(memberId);
    return member;
})
listInfoMember.value = await Promise.all(listInfoMemberPre.value.map(async (promise) => {
    const result = await promise;
    return result;
}));
const rules = [(value) => !!value || "Required!!!"]

function closeAddMemberModal () {
    emit('closeAddMember');
}
async function addMember () {
    const listAddedMembers = [...card.userId, ...addedMembers.value];
    // console.log(listAddedMembers);
    const nameAddedMembersPre = addedMembers.value.map(async (memberId) => {
        const { fullName } = await getInfoByUserId(memberId);
        return fullName;
    })
    const nameAddedMembers = await Promise.all(nameAddedMembersPre.map(async (promise) => {
        const result = await promise;
        return result;
    }));
    const { error: errorAddMember } = await updatePropertyCard(cardId, 'userId', listAddedMembers);
    const date = new Date();
    const createdAt = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()} ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const actitvity = {
        activity: `đã thêm ${nameAddedMembers.join(', ')} vào thẻ.`,
        moveFrom: '',
        moveTo: '',
        time: createdAt,
        userName: user.value.displayName,
        userEmail: user.value.email,
        userInitialName: user.value.photoURL
    }
    const { error: errorActivity } = await addActivity(cardId, actitvity);
    if (errorActivity.value) {
        emit('status', false);
        return;
    }
    if (!errorAddMember.value) {
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