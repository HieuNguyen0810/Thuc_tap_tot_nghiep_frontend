<template>

<!--  left side bar -->
  <a-layout style="min-height: 100vh">
    <a-layout-sider v-model:collapsed="collapsed" collapsible>
      <div class="logo"/>
      <a-menu v-model:selectedKeys="selectedKeys" theme="dark" mode="inline">
        <a-menu-item key="1" v-if="userRole === 'ROLE_ADMIN'">
          <span><router-link to="/manage-home/manage-users">Người dùng</router-link></span>
        </a-menu-item>
        <a-menu-item key="2" v-if="userRole === 'ROLE_ADMIN' || userRole === 'ROLE_EMPLOYEE'">
          <span><router-link to="/manage-home/manage-checkups">Đăng ký</router-link></span>
        </a-menu-item>
        <a-menu-item key="3" v-if="userRole === 'ROLE_ADMIN' || userRole === 'ROLE_REPORTER'">
          <span><router-link to="/manage-home/report">Báo cáo</router-link></span>
        </a-menu-item>
        <a-menu-item key="9">
          <span @click="logout">Đăng xuất</span>
        </a-menu-item>
      </a-menu>
    </a-layout-sider>
<!--    end left side bar -->

<!-- Page -->
    <a-layout>
      <router-view></router-view>
      <a-layout-footer style="text-align: center">
        Hieu Nguyen ©2023 Created by Hieu Nguyen
      </a-layout-footer>
    </a-layout>
  </a-layout>
</template>

<script>
import {defineComponent} from 'vue'
import jwtDecode from "jwt-decode";

export default defineComponent({
  name: "LeftSideBar",
  data() {
    return {}
  },
  methods: {
    logout() {
      this.$store.commit('logout')
      window.location.href = '/login'
    }
  },
  computed: {
    userRole() {
      return jwtDecode(this.$store.state.accessToken).roles[0].authority
    }
  }
})
</script>

<style scoped lang="scss">
a {
  text-decoration: none;
}

main.ant-layout-content {
  padding: 0;
}
//
//div.ant-layout-sider-children {
//  min-height: 97vh !important;
//}
//
//ul.ant-menu {
//  min-height: 97vh !important;
//}
//
//a-side div.ant-layout-sider-trigger {
//  display: none !important;
//}
</style>