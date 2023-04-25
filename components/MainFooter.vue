<template>
    <div class="footer">
        <v-row class="pl-8 pr-8 ma-4 ">
            <v-col cols="12" sm="12" md="12" lg="3">
                <v-row>
                    <v-col cols="6" sm="6" md="6" lg="12">
                        <div class="logo">
                            <v-img :width="120" aspect-ratio="4/3" cover :src="logo" :lazy-src="logo" alt="logo"></v-img>
                        </div>
                    </v-col>
                    <v-col cols="6" sm="6" md="6" lg="12">
                        <div class="text-body-1">
                            <NuxtLink to="/login" class="text-decoration-none text-white">
                                Đăng nhập
                            </NuxtLink>
                        </div>
                    </v-col>
                </v-row>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2">
                <div>
                    <h4>Tìm hiểu về Trello</h4>
                    <p>Công nghệ nền tảng</p>
                </div>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2">
                <div>
                    <h4>Việc làm</h4>
                    <p>Tìm hiểu về các vai trò chưa ai đảm nhiệm trong nhóm Trello</p>
                </div>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="3">
                <div>
                    <h4>Ứng dụng</h4>
                    <p>Tải xuống ứng dụng Trello cho máy tính hoặc thiết bị di động</p>
                </div>
            </v-col>
            <v-col cols="12" sm="6" md="3" lg="2">
                <div>
                    <h4>Liên hệ với chúng tôi</h4>
                    <p>Bạn cần giúp đỡ? Hãy liên lạc để chúng tôi có thể trợ giúp</p>
                </div>
            </v-col>
        </v-row>
    </div>
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