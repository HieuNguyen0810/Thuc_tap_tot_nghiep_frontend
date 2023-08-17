<template>
    <div class="container d-flex justify-content-center">
        <div style="width: 700px">
            <h3 class="text-center my-3">Đăng ký </h3>

            <div>
                <b-form-group id="input-group-6" label="Họ tên" label-for="input-6">
                    <b-form-input id="input-6" v-model="checkupForm.customerName" type="text" placeholder="Họ tên"></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-6" label="Điện thoại" label-for="input-6">
                    <b-form-input id="input-6" v-model="checkupForm.customerPhone" type="text" placeholder="Điện thoại"></b-form-input>
                </b-form-group>

                <b-form-group id="input-group-5" label="Chọn ngày" label-for="input-5">
                    <a-date-picker placeholder="Chọn ngày" id="input-5" v-model:value="checkupForm.registerDate" format="DD-MM-YYYY" class="w-100" />
                </b-form-group>

                <b-form-group id="input-group-5" label="Chọn khung giờ" label-for="input-5">
                    <a-radio-group v-model:value="checkupForm.registerTime" :options="timeOptions" />
                </b-form-group>
            </div>

            <button
                type="button"
                class="btn btn-primary rounded-pill"
                @click="register"
            >Đăng ký khám</button>
        </div>
    </div>
</template>

<script>
import {defineComponent} from 'vue'
import {message} from "ant-design-vue";
import axios from "axios";

export default defineComponent({
    name: "MedicalRegister",
    data() {
        return {
            checkupForm: {
                registerDate: '',
                registerTime: '',
                customerPhone: '',
                customerName: '',
                customer: {
                    email: this.$store.state.username
                },
            },
            timeOptions: ['Sáng', 'Chiều']
        }
    },
    methods: {
        register() {
            if (this.checkupForm.registerDate === '' || this.checkupForm.registerTime === '') {
                message.error('Không để trống ngày và thời gian đăng ký')
                return;
            }
            axios.post('/api/v1/checkups', JSON.parse(JSON.stringify(this.checkupForm)))
                .then(response => {
                    if (response.code === 200) {
                        message.success(response.message)
                    } else {
                        message.error(response.message)
                    }
                })
                .catch(error => {
                    message.error(error.message)
                })
        }
    }
})
</script>

<style scoped lang="scss">
.ant-picker {
    //width: 100%;
    height: 37.6px;
}

</style>