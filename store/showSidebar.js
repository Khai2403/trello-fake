import {defineStore} from 'pinia'

export const showSidebar = defineStore("showSidebar", () => {
    const isShowSidebar = ref(true);
    const setShowSidebar = (status) => {
        isShowSidebar.value = status;
    }
    return {isShowSidebar, setShowSidebar}
})
