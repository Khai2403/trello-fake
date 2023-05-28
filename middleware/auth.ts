import { useUser } from '~~/composable/useFirebase'


export default defineNuxtRouteMiddleware(async (to, from) =>{
    const { user } = await useUser();
    if(!user.value) {
       return navigateTo('/login');
    }
});