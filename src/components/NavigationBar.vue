<template>
  <div class="container">
    <div style="height: 80px; background-color: #42b983">
      <h3 style="color:#fff; text-align: center; line-height: 80px">HIS</h3>
    </div>

    <div class="d-flex justify-content-sm-between nav-bar p-3">
      <ul class="d-flex flex-row justify-content-between gap-5">
        <li v-for="link in navLinks">
          <router-link :to="link">{{ link.label }}</router-link>
        </li>
      </ul>
      <a-dropdown>
        <p class="customer-dropdown">
          Xin chào,
          <span class="fw-bold me-2">{{ this.username }}</span>
          <b-avatar variant="info" src="https://placekitten.com/300/300"></b-avatar>
        </p>
        <template #overlay>
          <a-menu>
            <a-menu-item key="1" @click="isOpenChangePasswordModal = true">
              <span>Đổi mật khẩu</span>
            </a-menu-item>
            <a-modal
              v-model:open="isOpenChangePasswordModal"
              title="Đổi mật khẩu"
              @ok="changePassword"
              :closable="false"
              cancel-text="Hủy"
              ok-text="Đổi mật khẩu"
              @cancel="() => {changePasswordObj = {oldPassword: '', newPassword: ''}; confirmPassword = ''}"
            >
              <b-form-group id="input-group-2" label="Nhập mật khẩu cũ" label-for="input-2">
                <b-form-input id="input-2" v-model="changePasswordObj.oldPassword" type="password" placeholder="Mật khẩu"
                              required></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-6" label="Nhập mật khẩu mới" label-for="input-6">
                <b-form-input id="input-6" v-model="changePasswordObj.newPassword" type="password" placeholder="Mật khẩu"
                              required></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-1" label="Nhập lại mật khẩu" label-for="input-1">
                <b-form-input id="input-1" v-model="confirmPassword" type="password" placeholder="Nhập lại mật khẩu"
                              required></b-form-input>
              </b-form-group>
            </a-modal>
            <a-menu-item key="2" @click="logout">
              <span>Đăng xuất</span>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import {mapState} from "vuex";
import axios from "axios";
import {message} from "ant-design-vue";

export default defineComponent({
  name: "NavigationBar",
  data() {
    return {
      navLinks: [
        {name: 'register', label: 'Đăng ký khám'},
        {name: 'checkupHistory', label: 'Lịch sử đăng ký'}
      ],
      user: {},
      isOpenChangePasswordModal: false,
      confirmPassword: '',
      changePasswordObj: {
        oldPassword: '',
        newPassword: ''
      }
    }
  },
  computed: {
    ...mapState({
      username: 'username'
    })
  },
  methods: {
    logout() {
      console.log('jjj')
      this.$store.commit('logout')
      window.location.href = '/login'
    },
    prepareDataToChangePassword() {
      this.isOpenChangePasswordModal = true
    },
    changePassword() {
      if (!this.changePasswordObj.newPassword || !this.changePasswordObj.oldPassword) return
      if (this.changePasswordObj.newPassword !== this.confirmPassword) {
        message.error('Mật khẩu mới không khớp!')
        return;
      }
      this.user.password = this.newPassword
      axios.post('/api/v1/customers/change-password', this.changePasswordObj)
        .then(res => {
          if (res.code === 200) {
            message.success("Đổi mật khẩu thành công!")
            this.$store.commit('logout')
            window.location.href = '/login'
          } else {
            message.error(res.message)
          }
        })
        .catch(e => message.error(e.response.data.message))
    }
  }
})
</script>

<style scoped lang="scss">
.nav-bar {
  background-color: #0072bc;
  color: #fff;

  ul {
    list-style-type: none;

    li {
      font-weight: bold;

      a {
        text-decoration: none;
        color: #fff;
        line-height: 40px;
      }

      a:hover {
        color: antiquewhite;
      }
    }
  }
}

a {
  text-decoration: none;
}

.customer-dropdown:hover {
  cursor: pointer;
}


</style>