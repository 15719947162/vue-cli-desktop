<template>
   
</template>
<script>
import { defineComponent, onMounted, ref } from 'vue';
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

</style>
