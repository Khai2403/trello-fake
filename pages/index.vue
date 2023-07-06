<template lang="pug">
.home
    .home__body 
        .introduction
            .introduction__title
                v-row 
                    v-col(cols="6")
                        p.font-weight-thin.title THÔNG TIN CƠ BẢN VỀ TRELLO
                        p.mt-1.subtitle Đỉnh cao về năng suất 
                        p.mt-2.text Đơn giản, linh hoạt và mạnh mẽ. Chỉ với bảng, danh sách và thẻ, bạn sẽ biết rõ ai đang làm gì và những việc cần làm.
            .introduction__content.mt-5
                v-row 
                    v-col(cols="4")
                        v-card.pa-3.card(v-for='(optionCard, index) in optionsCard' ,@click='selectIntro(index)', :style="`border-left: ${selectedCard[index] ? '6px solid rgb(0, 199, 229);' : ''}`")
                            p.font-weight-bold {{ optionCard?.title }}
                            span.text-subtitle-2 {{ optionCard?.subtitle }}
                    v-col(cols="8")
                        v-window(v-model='step')
                            v-window-item(v-for='(optionImg, index) in optionsImg')
                                div.d-flex.align-center.justify-center.w-100
                                    v-img.bg-white(width="100%", :aspect-ratio="16/9", :src='optionImg',:lazy-src="optionImg", cover="", alt="Hình ảnh")
        .application.mt-4.mb-12
            .application__title 
                p.font-weight-thin.title TRELLO TRONG THỰC TIỄN
                p.subtitle Quy trình làm việc cho mọi dự án, bất kể nhỏ to
            .application__content.mt-2
                v-slide-group(show-arrows='')
                    v-slide-group-item(v-for='option in optionsProcedure', :key='option.name')
                        v-card.card(color='white', width='400')
                            div(:style="`background: ${option.color}; height: 3rem;`")
                            .card__content
                                .icon.d-flex.align-center.justify-center
                                    v-icon.text-h3(:icon="option.icon", :color="option.color")
                                p.text-h6.font-weight-bold {{ option.title }}
                                p.mb-3.text-subtitle-2 {{ option.subtitle }}
                v-row.mt-5.text
                    v-col(cols="9")
                        p.text-h6 Không cần bắt đầu từ đầu. Bạn có thể nhanh chóng bắt đầu quy trình làm việc với sổ chiến lược đã được chứng minh hiệu quả dành cho các đội nhóm khác nhau. Hãy tùy chỉnh thành sổ chiến lược của riêng bạn.
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
import boardImg from '~~/assets/images/board.png';
import workImg from '~~/assets/images/work.jpg';
import cardImg from '~~/assets/images/card.png';
const step = ref(0);
const selectedCard = ref([true, false, false]);
const optionsCard = [
    {
        title: 'Các bảng',
        subtitle: 'Trello giúp bạn sắp xếp hợp lý các nhiệm vụ và thúc đẩy công việc. Bạn có thể xem mọi thông tin chỉ trong nháy mắt.'
    },
    {
        title: 'Danh sách',
        subtitle: 'Các giai đoạn khác nhau của một nhiệm vụ. Hãy bắt đầu thật đơn giản với Việc cần làm, Việc đang làm hoặc Việc đã xong—hoặc xây dựng một quy trình làm việc tùy chỉnh theo đúng nhu cầu của nhóm bạn. Với Trello, cách nào cũng phát huy hiệu quả.'
    },
    {
        title: 'Thẻ',
        subtitle: 'Thẻ trình bày các nhiệm vụ và ý tưởng, đồng thời lưu giữ mọi thông tin giúp hoàn thành công việc. Trong quá trình thực hiện nhiệm vụ, bạn có thể di chuyển thẻ qua các danh sách để thể hiện trạng thái của thẻ.'
    },
];
const optionsImg = [boardImg, workImg, cardImg];
const optionsProcedure = [
    {
        title: 'Quản lý dự án',
        subtitle: 'Sắp xếp nhiệm vụ, bám sát thời hạn và giúp các thành viên nhóm theo sát Trello.',
        icon: 'mdi-folder',
        color: 'rgb(255, 116, 82)'
    },
    {
        title: 'Cuộc họp',
        subtitle: 'Giúp các cuộc họp nhóm trở nên hiệu quả, mạnh mẽ và luôn thú vị.',
        icon: 'mdi-bullhorn-variant',
        color: 'rgb(38, 132, 255)'
    },
    {
        title: 'Đào tạo nhập môn',
        subtitle: 'Dễ dàng làm quen với công ty mới hoặc tiếp nhận dự án mới nhờ bố cục trực quan của Trello về việc cần làm, tài nguyên và theo dõi tiến độ.',
        icon: 'mdi-sprout',
        color: 'rgb(87, 217, 163)'
    },
    {
        title: 'Quản lý nhiệm vụ',
        subtitle: 'Sử dụng Trello để theo dõi, quản lý, tập hợp các nhiệm vụ giống như các mảnh ghép trong một bức tranh và giúp dự án của nhóm luôn gặt hái thành công mang tính gắn kết.',
        icon: 'mdi-list-box',
        color: 'rgb(255, 196, 0)'
    },
    {
        title: 'Động não',
        subtitle: 'Giải phóng sức sáng tạo cũng như giúp ý tưởng trở nên trực quan, mang tính cộng tác và khả thi.',
        icon: 'mdi-cloud',
        color: 'rgb(0, 199, 229)'
    },
    {
        title: 'Trung tâm tài nguyên',
        subtitle: 'Tiết kiệm thời gian nhờ trung tâm được thiết kế hợp lý để giúp các nhóm tìm thông tin nhanh chóng và dễ dàng.',
        icon: 'mdi-book',
        color: 'rgb(249, 156, 219)'
    }
]
function selectIntro (index) {
    selectedCard.value[index] = true;
    for (var i = 0; i < selectedCard.value.length; i++) {
        if (i != index) {
            selectedCard.value[i] = false;
        }
    }
    step.value = index;
}
</script>

<style lang="scss" scoped>
.home {
    .home__body {
        .introduction {
            background: url("//images.ctfassets.net/rz1oowkt5gyp/6bFuTiN5YQ78rFkHb3aJlo/b608362b08e14f5dec4c4aeea3a3ca72/white-wave-mobile.svg") center bottom -0.5px / 100% 24% no-repeat scroll padding-box border-box, linear-gradient(60deg, rgb(240, 254, 255), rgb(196, 253, 255)) 0% 0% / auto no-repeat scroll padding-box border-box;
            padding: 20px 60px;

            .introduction__title {
                .subtitle {
                    font-size: 1.6rem;
                    font-weight: 600;
                }

                .text {
                    font-size: 1.125rem;
                }
            }

            .introduction__content {
                .card {
                    cursor: pointer;
                }

                .card+.card {
                    margin-top: 12px;
                }
            }
        }

        .application {
            padding: 20px 60px;

            .application__title {
                .subtitle {
                    font-size: 1.6rem;
                    font-weight: 600;
                }
            }

            .application__content {
                .card {
                    border-radius: 8px;
                    box-shadow: 6px 6px 20px #ccc;
                    margin: 16px 20px 16px 16px;

                    .card__content {
                        position: relative;
                        padding: 2rem 1.5rem 1.5rem;

                        .icon {
                            position: absolute;
                            width: 3.5rem;
                            left: 1rem;
                            height: 3.5rem;
                            top: -1.75rem;
                            background-color: white;
                            border-radius: 8px;
                        }
                    }
                }

                .text {
                    font-size: 1.125rem;
                }
            }
        }
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

.v-btn {
    text-transform: none;
}
</style>