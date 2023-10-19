<template lang="pug">
.footer
    v-row.pl-8.pr-8.ma-4
        v-col(cols='12', sm='12', md='12', lg='3')
            v-row
                v-col(cols='6', sm='6', md='6', lg='12')
                    .logo
                        v-img(:width='120', aspect-ratio='4/3', cover='', :src='logo', :lazy-src='logo', alt='logo')
                v-col(cols='6', sm='6', md='6', lg='12')
                    .text-body-1
                        nuxt-link.text-decoration-none.text-white(to='/login')
                            | Đăng nhập
        v-col(cols='12', sm='6', md='3', lg='2')
            div
                h4 Tìm hiểu về Trello
                p Công nghệ nền tảng
        v-col(cols='12', sm='6', md='3', lg='2')
            div
                h4 Việc làm
                p Tìm hiểu về các vai trò chưa ai đảm nhiệm trong nhóm Trello
        v-col(cols='12', sm='6', md='3', lg='3')
            div
                h4 Ứng dụng
                p Tải xuống ứng dụng Trello cho máy tính hoặc thiết bị di động
        v-col(cols='12', sm='6', md='3', lg='2')
            div
                h4 Liên hệ với chúng tôi
                p Bạn cần giúp đỡ? Hãy liên lạc để chúng tôi có thể trợ giúp
</template>

<script setup>
import logo from "../assets/images/logo.gif"

</script>

<style lang="scss" scoped>
.footer {
    width: 100%;
    height: auto;
    background-color: #201e1f;
    color: white;
    display: flex;
    justify-content: space-between;
}
</style>