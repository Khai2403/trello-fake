<template lang="pug">
v-container
    v-card.pa-4
        v-row(no-gutters='')
            v-row(no-gutters='')
                h3 Xóa thành viên của {{ card?.title }}
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
import { getInfoByUserId } from '~~/store/useUser';
import { updatePropertyCard, addActivity } from '~~/store/useCard';
import { useUser } from "~~/composable/useFirebase";

const { card, cardId } = defineProps(['card', 'cardId']);
const emit = defineEmits(['closeDeleteMember', 'status']);
const form = ref(null);
const loading = ref(false);
const deletedMembers = ref(null)
const listInfoMember = ref([]);
const listInfoMemberPre = ref(null);
const listMember = ref(null);
const { user } = await useUser();

listMember.value = card.userId.filter(memberId => memberId !== user.value.uid);
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
    const listDeletedMembers = card.userId.filter((member) => {
        return !deletedMembers.value.includes(member)
    })
    const nameRemovedMembersPre = deletedMembers.value.map(async (memberId) => {
        const { fullName } = await getInfoByUserId(memberId);
        return fullName;
    })
    const nameRemovedMembers = await Promise.all(nameRemovedMembersPre.map(async (promise) => {
        const result = await promise;
        return result;
    }));
    const { error: errorRemoveMember } = await updatePropertyCard(cardId, 'userId', listDeletedMembers);
    const date = new Date();
    const createdAt = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()} ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const actitvity = {
        activity: `đã xóa ${nameRemovedMembers.join(', ')} khỏi thẻ.`,
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
    if (!errorRemoveMember.value) {
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