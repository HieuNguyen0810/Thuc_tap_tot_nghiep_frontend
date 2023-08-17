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
import jwtDecode from "jwt-decode";

function isValidAccessToken(accessToken) {
    console.log(accessToken)
    if (!accessToken)
        return false
    console.log(accessToken)
    const decodedToken = jwtDecode(accessToken)
    const expiresIn = decodedToken.exp;
    const currentTime = Math.floor(Date.now() / 1000);

    return accessToken && (expiresIn > currentTime)
}

function getRole(accessToken) {
    const decoded = jwtDecode(accessToken)
    return decoded.roles[0].authority
}

router.beforeEach((to, from, next) => {
    const accessToken = store.state.accessToken;
    console.log(accessToken)
    // const decoded = jwtDecode(accessToken)
    // const role = decoded.roles[0].authority
    //
    // console.log(accessToken)

    // if (!accessToken && to.name !== 'loginPage' && to.name !== 'customerSignupPage' && to.name !== 'forgetPasswordPage') {
    //     next({name: 'loginPage'})
    // } else if (!accessToken && (to.name === 'loginPage' || to.name === 'customerSignupPage' || to.name === 'forgetPasswordPage')) {
    //     next()
    // } else if (accessToken) {
    //     const decoded = jwtDecode(accessToken)
    //     const role = decoded.roles[0].authority
    //     console.log(role)
    //     if (role === 'ROLE_CUSTOMER' && !to.path.includes('/customer'))
    //         next({name: 'homePage'})
    //     else if (role !== 'ROLE_CUSTOMER' && !to.path.includes('/customer'))
    //         next({name: 'about'})
    //     else next()
    // } else next()
    if (!to.meta.requiresAuth) {
        next()
    } else if (to.meta?.requiresAuth && !isValidAccessToken(accessToken)) {
        next({ name: 'loginPage' });
    }  else if (isValidAccessToken(accessToken)) {
        const role = getRole(accessToken)

        if (role === 'ROLE_CUSTOMER' && !to.path.includes('customer')) {
            next({name: 'homePage'})
        } else if (role !== 'ROLE_CUSTOMER' && to.path.includes('customer')) {
            next({name: 'userHomePage'})
        } else next()
    } else {
        return false
    }
    // else next()

    // if ((to.name !== 'loginPage' && to.name !== 'customerSignupPage' && to.name !== 'forgetPasswordPage')
    //     && !store.getters.isAuthenticated) {
    //     next({name: 'loginPage'})
    // }
    // else if (store.getters.isAuthenticated) {
    //     const decoded = jwtDecode(accessToken)
    //     const role = decoded.roles[0].authority
    //     console.log(role)
    //     if (role === 'ROLE_CUSTOMER' && !to.path.includes('/customer'))
    //         next({name: 'userHomePage'})
    //     // else if (role !== 'CUSTOMER' && to.path.includes('/customer')) {
    //     //     next({name: 'loginPage'})
    //     // }
    //     else next()
    // }
});


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
