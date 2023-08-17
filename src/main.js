import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'

import { BootstrapVue3 } from 'bootstrap-vue-3'
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import 'bootstrap-icons/font/bootstrap-icons.css';

import '../src/assets/scss/custom-style.css'

import axios from "axios";

import Antd from 'ant-design-vue';

/*
* ===== AXIOS CONFIG =====
* */
// axios.defaults.baseURL = process.env.VUE_APP_BACKEND_SERVER;
axios.defaults.baseURL = 'http://localhost:8085'
axios.interceptors.request.use((config) => {
    config.headers['Authorization'] = 'Bearer ' + store.state.accessToken;
    return config;
}, error => Promise.reject(error));
axios.interceptors.response.use((response) => {
    return response.data;
}, error => {
    console.log('Axios interceptor catch error');
    if (error.response.status === 403) {
        store.commit('auth', null);
        router.push({name: 'login', query: {msg: error.response.msg}});
    }
    return Promise.reject(error);
});

createApp(App)
    .use(store)
    .use(router)
    .use(BootstrapVue3)
    .use(Antd)
    .mount('#app')
