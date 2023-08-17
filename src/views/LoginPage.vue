<template>
    <div class="container d-flex justify-content-center align-items-center flex-column" style="height: 100vh;">
        <div style="width: 400px;">
            <h2 class="text-center">Đăng nhập</h2>

            <b-form-group
                id="input-group-1"
                label="Email"
                label-for="input-1"
            >
                <b-form-input
                    id="input-1"
                    v-model="form.email"
                    type="email"
                    placeholder="Email"
                    required
                ></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Mật khẩu" label-for="input-2">
                <b-form-input
                    id="input-2"
                    type="password"
                    v-model="form.password"
                    placeholder="Mật khẩu "
                    required
                ></b-form-input>
            </b-form-group>
            <div class="d-flex justify-content-between mb-3">
                <router-link to="/forget-password">Quên mật khẩu</router-link>

                <p>Chưa có tài khoản ? <router-link to="/signup">Đăng ký</router-link></p>
            </div>
        </div>

        <button
            type="submit"
            class="btn btn-primary rounded-pill"
            @click="login"
        >Đăng nhập</button>
    </div>
</template>

<script>
import axios from "axios";
import {message} from "ant-design-vue";
import  store from "@/store/index.js";

export default {
    name: "CustomerLoginPage",
    data() {
        return {
            form: {
                email: "",
                password: "",
            }
        }
    },
    methods: {
        login() {
            if (this.form.email === "" || this.form.password === "") {
                message.error("Không được để trống Email và mật khẩu!")
                return;
            }
            axios.post('/api/v1/auth/login',
                {
                    email: this.form.email,
                    password: this.form.password
                })
                .then(response => {
                    console.log(response)

                    if (response.code === 200) {
                        message.success(response.message);
                        store.commit('auth', response)
                      setTimeout(() => {
                        this.$router.push({name: 'homePage',});
                      }, 300)

                    } else {
                        message.error(response.message);
                        console.log("Username or password is incorrect!")
                    }
                })
                .catch(error => {
                    message.error(error.message);
                    console.log(error.message)
                })
        }
    }
}
</script>

<style scoped lang="scss">

</style>