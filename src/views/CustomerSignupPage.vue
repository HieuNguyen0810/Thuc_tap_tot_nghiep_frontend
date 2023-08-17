<template>
    <div class="container d-flex justify-content-center align-items-center flex-column" style="min-height: 100vh;">
        <div style="width: 600px;">
            <h2 class="text-center">Đăng ký</h2>

            <b-form-group id="input-group-1" label="Họ tên *" label-for="input-1">
                <b-form-input id="input-1" v-model="signupForm.fullName" type="text" placeholder="Họ và tên" required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-2" label="Email *" label-for="input-2">
                <b-form-input id="input-2" v-model="signupForm.email" type="email" placeholder="Email" required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-3" label="Mật khẩu *" label-for="input-3">
                <b-form-input id="input-3" type="password" v-model="signupForm.password" placeholder="Mật khẩu " required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-4" label="Nhập lại mật khẩu *" label-for="input-4">
                <b-form-input id="input-4" type="password" v-model="verifyPassword" placeholder="Nhập lại mật khẩu " required></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-11" label="Điện thoại *" label-for="input-11">
                <b-form-input id="input-11" v-model="signupForm.phone" type="text" placeholder="Điện thoại"></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-5" label="Ngày sinh" label-for="input-5">
                <a-date-picker id="input-5" placeholder="Chọn ngày" v-model:value="signupForm.dob" format="DD-MM-YYYY" />
            </b-form-group>

            <b-form-group id="input-group-6" label="Địa chỉ" label-for="input-6">
                <b-form-input id="input-6" v-model="signupForm.address" type="text" placeholder="Địa chỉ"></b-form-input>
            </b-form-group>

            <b-form-group id="input-group-7" label="Đối tượng" label-for="input-7">
                <b-form-select id="select-7" v-model="signupForm.target" :options="this.targets" placeholder="Đối tượng" required></b-form-select>
            </b-form-group>

            <a-collapse v-model:activeKey="activeKey" accordion style="margin-top: 1.5rem">
                <a-collapse-panel key="1" header="Người liên hệ">

                    <b-form-group id="input-group-8" label="Họ và tên" label-for="input-8">
                        <b-form-input id="input-8" v-model="contactPerson.name" type="text" placeholder="Họ tên" required></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-9" label="Số điện thoại" label-for="input-9">
                        <b-form-input id="input-9" v-model="contactPerson.phone" type="text" placeholder="Số điện thoại" required></b-form-input>
                    </b-form-group>

                    <b-form-group id="input-group-10" label="Email" label-for="input-10">
                        <b-form-input id="input-10" v-model="contactPerson.email" type="text" placeholder="Email"></b-form-input>
                    </b-form-group>

                </a-collapse-panel>
            </a-collapse>

            <div class="d-flex justify-content-start my-2">
                <p>Đã có tài khoản? <router-link to="/login">Đăng nhập</router-link></p>
            </div>
        </div>

        <button
            type="button"
            class="btn btn-primary rounded-pill"
            @click="signup"
        >Đăng ký</button>
    </div>
</template>

<script>
import axios from "axios";
import {message} from "ant-design-vue";

export default {
    name: "CustomerLoginPage",
    data() {
        return {
            signupForm: {
                fullName: "",
                email: "",
                password: "",
                phone: '',
                dob: '',
                address: '',
                target: {
                    type: Object,
                    default: () => {}
                },
            },
            verifyPassword: "",
            targets: {
                type: Array,
                default: () => []
            },
            contactPerson: {
                phone: '',
                name: '',
                email: ''
            },
            activeKey: 0
        }
    },
    created() {
        axios.get('/api/v1/targets')
            .then(response => {
                console.log(response)
                if (response['code'] === 200) {
                    this.targets = response['data'].reduce((targetArr, currentTarget) => {
                        targetArr.push({ value: currentTarget, text: currentTarget.name })
                        return targetArr
                    }, [])
                    console.log(this.targets)
                } else {
                    message.error(response.message)
                }
            })
    },
    watch: {
        targets() {
            this.targets.forEach(target => console.log(target))
        }
    },
    methods: {
        signup() {
            if (this.signupForm.fullName === '' ||
                this.signupForm.email === '' ||
                this.signupForm.password === '' ||
                this.signupForm.phone === '') {
                message.error("Không để trống các trường có dấu *");
                return;
            }

            if (this.signupForm.password !== this.verifyPassword) {
                message.error("Mật khẩu không khớp!");
                return;
            }

            if (this.contactPerson.phone !== '' && this.contactPerson.name !== '') {
                this.signupForm.contactPerson = this.contactPerson
            }

            axios.post('/api/v1/auth/signup',
                this.signupForm)
                .then(response => {
                    console.log(response)

                    if (response.code === 200) {
                        message.success(response.message);
                    } else {
                        message.error(response.message);
                        // console.log("Username or password is incorrect!")
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
.ant-picker {
    width: 100%;
    height: 37.6px;
}

</style>