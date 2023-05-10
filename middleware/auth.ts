import { useUser } from '~~/composable/useFirebase'

const { user } = await useUser();

export default defineNuxtRouteMiddleware((to, from) =>{
    if(!user.value) {
       return navigateTo('/login');
    }
});