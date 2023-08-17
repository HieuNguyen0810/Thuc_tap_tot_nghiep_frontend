<template>
<div class="container d-flex justify-content-center align-items-center" style="height: 100vh;">
    <div style="width: 400px;">
        <h2>Quên mật khẩu</h2>
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

        <button
            type="submit"
            class="btn btn-primary"
            @click="resetPassword"
        >Đặt lại mật khẩu</button>
    </div>
</div>
</template>

<script>
import axios from "axios";
import {message} from "ant-design-vue";

export default {
    name: "ForgetPasswordPage",
    data() {
        return {
            form: {
                email: ''
            }
        }
    },
    methods: {
        resetPassword() {
            if (this.form.email === '') {
                message.error('Email không đuợc để trống!')
                return
            }
            axios.post('/api/v1/auth/reset-password', { email: this.form.email })
                .then(response => {
                    if (response.code === 2001) {
                        message.success("Đặt lại mật khẩu thành công. Mật khẩu mới đã được gửi đến email của bạn")
                    } else {
                        message.error(response.message)
                    }
                })
                .catch(error => {
                    message.error(error.message)
                })
        }
    }
}
</script>

<style scoped lang="scss">

</style>