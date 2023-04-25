<template>
    <div class="home">
        <div class="img">
            <img src="../assets/images/background.jpg" alt="">
        </div>

        <div class="sub-footer-wrapper">
            <div class="sub-footer">
                <v-row no-gutters>
                    <v-col cols="12" class="sub-footer__text d-flex justify-center">Bắt đầu sử dụng Trello ngay hôm
                        nay</v-col>
                </v-row>
                <v-row no-gutters class="mt-4">
                    <v-col cols="12" class="d-flex justify-center">
                        <nuxt-link to="/register">
                            <v-btn class="btn">Đăng ký - hoàn toàn miễn phí!</v-btn>
                        </nuxt-link>
                    </v-col>
                </v-row>
            </div>
        </div>

    </div>
</template>

<script setup>

</script>

<style lang="scss">
.home {
    .img {
        display: flex;
        justify-content: center;

    }

    .sub-footer-wrapper {
        display: flex;
        align-items: center;
        justify-content: center;
        background: linear-gradient(60deg, rgb(82, 67, 170), rgb(237, 80, 180)) 0% 0% / auto repeat scroll padding-box border-box rgb(82, 67, 170);
        height: 200px;

        .sub-footer {
            color: white;
            padding: 20px;

            .sub-footer__text {
                font-size: 1.4rem;
                font-weight: 600;
                line-height: 1.4;
                letter-spacing: 2px;
            }

            .btn {
                padding: 10px;
                color: white;
                background-color: #0065ff;
            }
        }

    }

}
</style>