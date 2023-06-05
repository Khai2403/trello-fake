<template lang="pug">
.home
    .img
        img(src='../assets/images/background.jpg', alt='')
    .sub-footer-wrapper
        .sub-footer
            v-row(no-gutters='')
                v-col.sub-footer__text.d-flex.justify-center(cols='12')
                | Bắt đầu sử dụng Trello ngay hôm nay
            v-row.mt-4(no-gutters='')
                v-col.d-flex.justify-center(cols='12')
                    nuxt-link(to='/register')
                        v-btn.btn Đăng ký - hoàn toàn miễn phí!
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