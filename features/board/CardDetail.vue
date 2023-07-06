<template lang="pug">
v-card.mb-4.overflow-y-auto
    v-card-title
        div.d-flex.align-start
            v-icon.mr-2(icon="mdi-card-text")
            div.header__title
                label.cardTitleWrapper.d-flex(:for='cardId')
                    input.cardTitle.text-subtitle-1.text-truncate.font-weight-bold(type='text', :id='cardId', :value='card?.title', @change='onChangeTitle($event)')
                span.text-subtitle-2 trong danh sách&nbsp
                span.text-subtitle-2.text-decoration-underline {{ workTitle }}
                div.d-flex.flex-column
                    p.text-subtitle-2.font-weight-bold Thành viên
                    .d-flex.flex-wrap
                        div.mr-2(v-for="(member, index) in listInfoMember")
                            v-menu(v-model='menuMem[index]', location='bottom start', origin='top start', transition='scale-transition', :open-on-click="true", :close-on-content-click="false")
                                template(v-slot:activator='{ props }')
                                    v-btn(icon, v-bind='props', size='small', rounded)
                                        v-avatar.d-flex.align-center.justify-center(color='grey-darken-4', start)
                                            span.text-subtitle-1 {{ member.initialsName }}
                                v-card.mt-1.rounded-ts-0.rounded-lg(width='300')
                                    v-list(bg-color='black')
                                        v-list-item
                                            template(v-slot:prepend='')
                                                v-avatar.d-flex.align-center.justify-center(color='white', start)
                                                    span.text-subtitle-1 {{ member.initialsName }}
                                            v-list-item-title {{ member.fullName }}
                                            v-list-item-subtitle {{ member.email }}
                                            template(v-slot:append='')
                                                v-list-item-action
                                                    v-btn(icon='', variant='text', @click='menuMem[index] = false')
                                                        v-icon mdi-close-circle
                                    v-list.pa-2
                                        v-btn.w-100.d-flex.justify-start.rounded-lg(prepend-icon='mdi-account-arrow-right', variant='text',tag="div", @click='removeUser(member)')
                                            span Gỡ khỏi thẻ
                div.d-flex.flex-column.justify-start.mt-2
                    p.text-subtitle-2.font-weight-bold.mb-1 Nhãn
                    v-sheet.d-flex.flex-wrap(v-if="card?.label")
                        v-sheet.mr-3.mb-2(v-for='(label, i) in card?.label' :key="i")
                            div.pl-2.pr-2(:style="`background-color: ${label?.color}; height: 20px;min-width: 64px; max-width: 70vw;border-radius: 6px; cursor: pointer;`", @click="isDeleteLabel = true")
                                p.text-caption.text-center.text-white.text-truncate {{ label?.title }}
            div.header__close-btn(@click='emit("closeDetailModal")')
                v-icon(icon="mdi-window-close")
    v-card-text
        v-row
            v-col(cols="12", sm="12", md="9", lg="9", xl="9", xxl="9")
                v-row
                    v-col.d-flex(cols="12")
                        div
                            v-icon.mr-2(icon="mdi-text-box")
                        div.description-wrapper
                            | Mô tả
                            div.addDescription.pa-1.mt-2(v-if="!showDescriptionForm && !card?.description", @click="showDescriptionForm=true")
                                span.ml-2.text-subtitle-2 Thêm mô tả chi tiết hơn...
                            markdownPreview.description(v-if="!showDescriptionForm", @click="showDescriptionForm = true", :modelValue="card?.description")
                            DescriptionForm(v-if="showDescriptionForm", language="en-US", :description='card?.description', :card-id='cardId', @cancel-description="showDescriptionForm=false", @status='handleStatus')
                v-row
                    v-col.mb-3(cols="12")
                        div.d-flex
                            v-icon.mr-2(icon="mdi-format-list-text")
                            div.activity
                                | Hoạt động
                        div.mt-2.d-flex.align-center(v-for="(activity, index) in activityLogList")
                            v-menu(v-model='menuAc[index]', location='bottom start', origin='top start', transition='scale-transition', :open-on-click="true")
                                template(v-slot:activator='{ props }')
                                    v-btn(icon, v-bind='props', size='x-small', rounded)
                                        v-avatar.d-flex.align-center.justify-center(color='grey-darken-4', start, size='small')
                                            span.text-subtitle-2 {{ activity.userInitialName }}
                                v-card.mt-1(width='350')
                                    v-list(bg-color='grey-lighten-2')
                                        v-list-item
                                            template(v-slot:prepend='')
                                                v-avatar.d-flex.align-center.justify-center(color='grey-darken-4', start)
                                                    span.text-subtitle-1 {{ activity.userInitialName }}
                                            v-list-item-title {{ activity.userName }}
                                            v-list-item-subtitle {{ activity.userEmail }}
                                            template(v-slot:append='')
                                                v-list-item-action
                                                    v-btn(icon='', variant='text', @click='menuAc[index] = false')
                                                        v-icon(color="") mdi-close-circle
                            div.ml-1
                                div.text-subtitle-2
                                    span.font-weight-bold.mr-1.act-user(@click="menuAc[index] = true") {{ activity.userName }}
                                    span(v-if='activity.moveFrom && activity.moveTo') {{ `${activity.activity} danh sách ${activity.moveFrom} tới danh sách ${activity.moveTo}.` }}
                                    span(v-if='!activity.moveFrom && !activity.moveTo') {{ activity.activity }}
                                p.text-caption {{`Lúc ${activity.time}`}}
            v-col.d-flex.flex-column(cols="0", sm="0", md="3", lg="3", xl="3", xxl="3")
                | Thao tác thẻ
                v-btn.mb-2.mt-2.d-flex.justify-start(color="grey-lighten-2", prepend-icon="mdi-account-plus", flat, @click="isAddMember = true") Thêm thành viên
                v-btn.mb-2.d-flex.justify-start(color="grey-lighten-2", prepend-icon="mdi-account-minus", flat, @click="isDeleteMember = true") Xóa thành viên
                v-btn.d-flex.justify-start(color="grey-lighten-2", prepend-icon="mdi-tag-plus", flat, @click="isAddLabel = true") Thêm nhãn
v-dialog.rounded-lg(v-model='isAddMember', :max-width='450', persistent='')
    AddMemberCardModal(@close-add-member='isAddMember = false', :card="card", :board-id='boardId', :card-id='cardId', @status="handleStatus")
v-dialog.rounded-lg(v-model='isDeleteMember', :max-width='450', persistent='')
    DeleteMemberCardModal(@close-delete-member='isDeleteMember = false', :card="card", :card-id='cardId', @status="handleStatus")
v-dialog.rounded-lg(v-model='isAddLabel', :max-width='450', persistent='')
    AddLabelModal(@close-add-label='isAddLabel = false', :card="card", :card-id='cardId')
v-dialog.rounded-lg(v-model='isDeleteLabel', :max-width='450', persistent='')
    DeleteLabelModal(:labels="card?.label", :card-id='cardId', @close-delete-label='isDeleteLabel = false', @is-add-label='handleAddLabel')
v-dialog.d-flex.align-center.justify-center(v-model='loadingProgress', persistent='', :max-width='200')
    .d-flex.justify-center.align-center
        v-progress-circular(color='success', :size='60', indeterminate='')
</template>

<script setup>
import { getInfoByUserId } from '~~/store/useUser';
import { cardDetail, updatePropertyCard, removeAccount, addActivity } from '~~/store/useCard';
import { useUser } from '~~/composable/useFirebase';
import DescriptionForm from '~~/features/board/DescriptionForm.vue';
import AddMemberCardModal from '~~/features/board/AddMemberCardModal.vue';
import DeleteMemberCardModal from '~~/features/board/DeleteMemberCardModal.vue';
import AddLabelModal from '~~/features/board/AddLabelModal.vue';
import DeleteLabelModal from '~~/features/board/DeleteLabelModal.vue';

const { workTitle, cardId, boardId } = defineProps(['workTitle', 'cardId', 'boardId']);
const emit = defineEmits(['isStatus', 'closeDetailModal']);
const loadingProgress = ref(false);
const showDescriptionForm = ref(false);
const isAddMember = ref(false);
const isAddLabel = ref(false);
const isDeleteLabel = ref(false);
const isDeleteMember = ref(false);
const listInfoMember = ref([]);
const listInfoMemberPre = ref(null);
const menuMem = ref([]);
const menuAc = ref([]);
const activityLogList = ref([]);
const card = ref(null);
const { card: cardCurr } = await cardDetail(cardId);
card.value = cardCurr.value;
activityLogList.value = card.value.activityLog.reverse();

for (let i = 0; i < card.value.activityLog.length; i++) {
    menuAc.value[i] = false;
}

listInfoMemberPre.value = card.value.userId.map(async (memberId) => {
    const member = await getInfoByUserId(memberId);
    menuMem.value.push(false);
    return member;
})
listInfoMember.value = await Promise.all(listInfoMemberPre.value.map(async (promise) => {
    const result = await promise;
    return result;
}));

watch(cardCurr, async () => {
    const { card: cardCurr } = await cardDetail(cardId);
    card.value = cardCurr.value;
    activityLogList.value = card.value.activityLog.reverse();
    listInfoMemberPre.value = card.value.userId.map(async (memberId) => {
        const member = await getInfoByUserId(memberId);
        menuMem.value.push(false);
        return member;
    })
    listInfoMember.value = await Promise.all(listInfoMemberPre.value.map(async (promise) => {
        const result = await promise;
        return result;
    }));
    for (let i = 0; i < card.value.activityLog.length; i++) {
        menuAc.value[i] = false;
    }
})
async function onChangeTitle (event) {
    loadingProgress.value = true;
    const { error } = await updatePropertyCard(cardId, 'title', event.target.value);
    if (!error.value) {
        emit('isStatus', true);
    } else {
        emit('isStatus', false);
    }
    loadingProgress.value = false;
};
async function removeUser (removedUser) {
    loadingProgress.value = true;
    const { user } = await useUser();
    const { error: errorRemove } = await removeAccount(cardId, removedUser.id);
    const date = new Date();
    const createdAt = `${date.getHours() < 10 ? `0${date.getHours()}` : date.getHours()}:${date.getMinutes() < 10 ? `0${date.getMinutes()}` : date.getMinutes()}:${date.getSeconds() < 10 ? `0${date.getSeconds()}` : date.getSeconds()} ngày ${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
    const actitvity = ref(null);
    if (user.value === removedUser.id) {
        actitvity.value = {
            activity: 'đã rời khỏi thẻ.',
            moveFrom: '',
            moveTo: '',
            time: createdAt,
            userName: user.value.displayName,
            userEmail: user.value.email,
            userInitialName: user.value.photoURL
        }
    } else {
        actitvity.value = {
            activity: `đã xóa ${removedUser.fullName} khỏi thẻ.`,
            moveFrom: '',
            moveTo: '',
            time: createdAt,
            userName: user.value.displayName,
            userEmail: user.value.email,
            userInitialName: user.value.photoURL
        }
    }
    const { error: errorActivity } = await addActivity(cardId, actitvity.value);
    if (errorActivity.value) {
        emit('status', false);
        return;
    }
    if (errorRemove.value) {
        emit('isStatus', false);
    }
    loadingProgress.value = false;
};
function closeDescriptionForm () {
    showDescriptionForm.value = false;
};
function handleStatus (event) {
    if (event) {
        emit('isStatus', true);
    } else {
        emit('isStatus', false);
    }
};
function handleAddLabel () {
    isAddLabel.value = true;
    isDeleteLabel.value = false;
}
</script>

<style lang="scss" scoped>
.cardTitleWrapper {
    cursor: pointer;
    width: 100%;

    .cardTitle {
        width: 98%;
        cursor: pointer;
        letter-spacing: 1px;
    }

    .cardTitle:focus {
        padding-left: 6px;
        border-radius: 4px;
    }
}

.header__title {
    flex: 1;
}

.header__close-btn {
    display: flex;
    align-items: center;

    &:hover {
        cursor: pointer;
        background-color: #ccc;
        border-radius: 6px;
    }
}

.description-wrapper {
    flex: 1;

    .addDescription {
        height: 60px;
        cursor: pointer;
        background-color: #E0E0E0;
        border-radius: 6px;
    }

    .description {
        cursor: pointer;

        &:hover {
            background-color: #E0E0E0;
            border-radius: 6px;
        }
    }
}

.act-user {
    &:hover {
        cursor: pointer;
    }
}

.v-btn {
    text-transform: none;
}
</style>