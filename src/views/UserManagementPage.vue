<template>
<div class="m-2">
  <a-layout-header style="background: #fff; padding: 0" class="m-3">
    <h3 style="font-weight: bold;" class="text-center">Quản lý người dùng</h3>
  </a-layout-header>
  <a-layout-content style="margin: 0 16px">
    <div :style="{ minHeight: '100vh' }">
      <div class="d-flex justify-content-between align-items-start">
        <button class="btn btn-primary my-3" @click="openAddUserModal =! openAddUserModal">
          <i class="bi bi-plus me-2"></i>
          <span>Thêm người dùng</span>
        </button>

        <b-form-group id="input-group-11" label="Bộ lọc" label-for="input-11" label-align-sm="right">
          <b-form-select id="select-11" v-model="selectedRole" :options="filterRoles" placeholder="Vai trò" required></b-form-select>
        </b-form-group>
      </div>


      <a-modal
        ref="updateModal"
        v-model:open="openAddUserModal"
        title="Người dùng mới"
        @ok="addUser()"
        :closable="false"
        centered
        cancel-text="Hủy"
        ok-text="Thêm"
      >
        <b-form-group id="input-group-6" label="Username" label-for="input-6">
          <b-form-input id="input-6" v-model="newUserForm.username" type="text" placeholder="Username" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-1" label="Họ tên" label-for="input-1">
          <b-form-input id="input-1" v-model="newUserForm.fullName" type="text" placeholder="Họ và tên" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-2" label="Email" label-for="input-2">
          <b-form-input id="input-2" v-model="newUserForm.email" type="email" placeholder="Email" required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-3" label="Mật khẩu" label-for="input-3">
          <b-form-input id="input-3" type="password" v-model="newUserForm.password" placeholder="Mật khẩu " required></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-4" label="Điện thoại" label-for="input-4">
          <b-form-input id="input-4" v-model="newUserForm.phone" type="text" placeholder="Điện thoại"></b-form-input>
        </b-form-group>

        <b-form-group id="input-group-5" label="Vai trò" label-for="input-5">
          <b-form-select id="select-5" v-model="newUserForm.role" :options="this.roles" placeholder="Vai trò" required></b-form-select>
        </b-form-group>
      </a-modal>

      <b-table
        :fields="tableFields"
        :items="tableData"
        :per-page="pagination.perPage"
        hover
      >
        <template #cell(index)="data">{{ data.index + 1 }}</template>
        <template #cell(username)="data">{{ data.item.username }}</template>
        <template #cell(fullName)="data">{{ data.item.fullName }}</template>
        <template #cell(email)="data">{{ data.item.email }}</template>
        <template #cell(phone)="data">{{ data.item.phone }}</template>
        <template #cell(status)="data">{{ data.item.status ? 'Hoạt động': 'Khóa' }}</template>
        <template #cell(role)="data">{{ data.item.role?.name ? data.item.role.name : '' }}</template>
        <template #cell(actions)="data">
          <a-dropdown>
            <i class="actions bi bi-three-dots"></i>
            <template #overlay>
              <a-menu>
                <a-menu-item>
                  <i class="bi bi-pencil-square me-2"></i>
                  <span>Sửa</span>
                </a-menu-item>
                <a-menu-item @click="deleteUser(data)">
                  <i class="bi bi-trash me-2"></i>
                  <span>Xóa</span>
                </a-menu-item>
              </a-menu>
            </template>
          </a-dropdown>
        </template>
      </b-table>

      <b-pagination
        v-model="pagination.currentPage"
        :per-page="pagination.perPage"
        pills
        :total-rows="pagination.rows"
        align="center"
        @page-click="changePage"
      >
      </b-pagination>

    </div>
  </a-layout-content>
</div>
</template>

<script>
import axios from "axios";
import {message} from "ant-design-vue";

export default {
  name: "UserManagementPage",
  data() {
    return {
      openAddUserModal: false,
      emptyUserForm: {
        username: '',
        fullName: '',
        email: '',
        password: '',
        phone: '',
        role: ''
      },
      newUserForm: {
        username: '',
        fullName: '',
        email: '',
        password: '',
        phone: '',
        role: ''
      },
      tableFields: [
        { key: 'index', label: 'STT', class: 'text-center' },
        { key: 'username', label: 'Username' },
        { key: 'fullName', label: 'Họ tên' },
        { key: 'email', label: 'Email' },
        { key: 'phone', label: 'Điện thoại' },
        { key: 'status', label: 'Trạng thái' },
        { key: 'role', label: 'Vai trò' },
        { key: 'actions', label: 'Thao tác', class: 'text-center' },
      ],
      userList: [],
      roles: [],
      pagination: {
        perPage: 5,
        currentPage: 1,
        rows: 20,
      },
      selectedRole: '',
    }
  },
  async created() {
    axios.get('/api/v1/roles')
      .then(response => {
        if (response.code === 200) {
          this.roles = response.data.reduce((roles, currentRole) => {
            if (currentRole.name !== 'ROLE_CUSTOMER')
              roles.push({value: currentRole, text: currentRole.name})
            return roles
          }, [])
          console.log(this.roles)
        } else {
          message.error(response.message)
        }
      })
      .catch(e => message.error(e.message))

    this.getUsers()

    this.userList.forEach(user => console.log(user))
    console.log(this.userList.length)
    console.log(this.userList)
  },
  methods: {
    getUsers() {
      axios.get('/api/v1/users/get-by-page', {params: {pageIndex: this.pagination.currentPage - 1, pageSize: this.pagination.perPage}})
        .then(response => {
          if (response.code === 200) {
            this.userList = response.data.content
            this.pagination.rows = response.data.totalElements
          } else {
            message.error(response.message)
          }
        })
        .catch(e => message.error(e.message))
    },
    addUser() {
      axios.post('/api/v1/users', JSON.parse(JSON.stringify(this.newUserForm)))
        .then(response => {
          if (response.code === 200) {
            message.success(response.message)
            this.newUserForm = JSON.parse(JSON.stringify(this.emptyUserForm))

            const newUser = response.data
            this.openAddUserModal = false
            console.log(JSON.stringify(this.userList))
            this.userList = JSON.parse(JSON.stringify(this.userList))
            this.userList.push(newUser)
            // this.userList.push(newUser)
          } else {
            message.error(response.message)
          }
        })
        .catch(e => message.error(e.message))
    },
    lockUser(data) {
      axios.put('/api/v1/users/' + data.item.id, this.userList[data.index])
    },
    deleteUser(data) {
      axios.delete('/api/v1/users/' + data.item.id)
        .then(response => {
          if (response.code === 200) {
            message.success(response.message)
            this.userList.splice(data.index, 1)
          } else {
            message.error(response.message)
          }
        })
        .catch(e => message.error(e.message))
    },
    toggleBusy() {
      this.isBusy = !this.isBusy
    },
    changePage(event, pageNumber) {
      this.pagination.currentPage = pageNumber
      console.log(this.pagination.currentPage)
      this.getUsers()
    }
  },
  computed: {
    tableData() {

      let data =  this.userList.reduce((finalData, currentUser) => {
        finalData.push({...currentUser, ...{ editMode: false}})
        // console.log(currentUser)
        return finalData
      }, [])

      return data.filter(user => {
        if (!this.selectedRole || this.selectedRole.name === 'All') {
          return true
        } else {
          return user.role.name === this.selectedRole.name
        }
      })
      // return data
    },
    filterRoles() {
      const roles = JSON.parse(JSON.stringify(this.roles))
      roles.unshift({text: 'All', value: {name: 'All'}})
      return roles
    }
  }
}
</script>

<style scoped lang="scss">
.actions:hover {
  cursor: pointer;
}
</style>