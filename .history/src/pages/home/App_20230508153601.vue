<template>
    <div class="container-full" style="display: flex; background-color: #f7f7f7">
        <div class="list-wrap" v-if="isLoading">
            <div v-if="listData.plan" class="card">
                <div class="card-header f-s-16 f-w-600">
                    <span>{{ listData.plan.plan }}</span>
                    <span>{{ listData.plan.company }}</span>
                </div>
                <div class="card-body">
                    <div class="tit"><span></span>主管老师</div>
                    <div class="info" v-for="(item, index) in listData.superintendent" :key="index">
                        <span>{{ item.name }}</span>
                        <van-icon size="24" name="phone-o" @click="handlePhone(item.tel)" />
                    </div>
                </div>
                <div class="card-body" style="padding-top: 0">
                    <div class="tit"><span></span>组员</div>
                    <div class="info" v-for="(item, index) in listData.member" :key="index">
                        <span
                            >{{ item.name }}<van-tag v-if="item.flag == 0" style="margin: 0 10px" color="#3d8dfc1a" text-color="#3D8DFC">组长</van-tag
                            ><van-tag v-if="item.flag == 1" style="margin: 0 10px" color="#fb81391a" text-color="#FB8139">副组长</van-tag></span
                        >
                        <div>
                            <span style="margin-right: 120px">{{ item.major }}</span>
                            <van-icon size="24" name="phone-o" @click="handlePhone(item.tel)" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <van-empty style="height: 100%; width: 100%" v-else :image="emptyImg" image-size="120" description="暂无数据" />
    </div>
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue';
import { List, Notify, Empty, Button, Icon, Tag, Toast } from 'vant';
import { addressInfo } from '@/api/practice.js';
import emptyImg from '@/assets/image/noData.png';

export default defineComponent({
    components: {
        [List.name]: List,
        [Icon.name]: Icon,
        [Notify.name]: Notify,
        [Empty.name]: Empty,
        [Button.name]: Button,
        [Tag.name]: Tag,
        [Toast.name]: Toast,
    },
    setup() {
        const listData = ref({});
        const isLoading = ref(true);
        const loadList = () => {
            Toast.loading({
                message: '加载中...',
                forbidClick: true,
                duration: 0,
            });
            addressInfo()
                .then((res) => {
                    Toast.clear();
                    const { success, content, message } = res;
                    isLoading.value = !!content.plan;
                    if (!success) return Notify({ type: 'danger', message });
                    listData.value = content;
                })
                .catch(() => {
                    Toast.clear();
                    isLoading.value = false;
                });
        };

        const handlePhone = (tel) => {
            try {
                // eslint-disable-next-line no-undef
                AppSdkPsotman({
                    systemCode: 'schoollife', //系统编码
                    phone: tel, //电话号码(string类型)
                    type: 'phone', //需要使用的硬件类型
                });
            } catch (err) {
                window.location.href = 'tel:' + tel;
            }
        };

        onMounted(() => {
            loadList();
        });

        return {
            listData,
            isLoading,
            handlePhone,
            emptyImg,
        };
    },
});
</script>

<style lang="scss">
#app {
    background-color: var (--wisewe-background-color);
}
.list-wrap {
    flex: 1;
    overflow: auto;
    // background-color: $gray-1;
    .card {
        margin: $padding-sm;
        background-color: $white;
        border-radius: $border-radius-md;
        font-size: 14px;
        &-header {
            height: 100px;
            padding: 0 20px;
            border-radius: 4px;
            display: flex;
            flex-direction: column;
            justify-content: space-around;
            background: url('../../../assets/image/sxbj.png') no-repeat 100% 100%;
            span {
                color: #fff;
            }
        }

        &-body {
            text-overflow: ellipsis;
            word-wrap: break-word;
            padding: 12px 0;
            color: $gray-6;
            div {
                color: '';
                margin: $padding-xs 0;
            }
        }

        &-footer {
            // padding: 14px 0;
            // display: flex;
            // justify-content: space-between;
            // color: $gray-6;
            border-top: 1px solid $border-color;
            padding: $padding-sm $padding-lg;
        }
    }
    .info {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .tit {
        display: flex;
        align-items: center;
        font-size: 12px;
        color: #666;
        span {
            height: 12px;
            width: 4px;
            border-radius: 4px;
            margin-right: 5px;
            background-color: #1177ff;
        }
    }
}
</style>
