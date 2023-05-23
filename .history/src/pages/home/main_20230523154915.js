import 'amfe-flexible';
import { createApp } from 'vue';
import ElementPlus from 'element-plus';
import zhCn from 'element-plus/es/locale/lang/zh-cn';
import 'element-plus/dist/index.css';
import App from './App.vue';

createApp(App)
    .use(ElementPlus, {
        locale: zhCn,
    }).use(store)
    .mount('#app');
