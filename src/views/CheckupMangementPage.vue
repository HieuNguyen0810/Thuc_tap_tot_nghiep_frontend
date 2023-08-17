<template>
  <div class="m-2">
    <a-layout-header style="background: #fff; padding: 0" class="m-3">
      <h3 style="font-weight: bold;" class="text-center">Tiếp nhận đăng ký</h3>
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <div :style="{ minHeight: '100vh' }">
        <div class="d-flex justify-content-between align-items-start">
          <b-form-group id="input-group-11" label="Lọc theo trạng thái:" label-for="input-11" label-align-sm="right">
            <b-form-select id="select-11" v-model="selectedStatus" :options="filterStatus" placeholder="Vai trò" required></b-form-select>
          </b-form-group>
        </div>

        <b-table
          ref="table"
          hover outlined head-variant="light"
          :items="tableData"
          :per-page="pagination.perPage"
          :fields="fields"
        >
          <template #cell(index)="data">{{ data.index + 1 }}</template>
          <template #cell(registerDate)="data">
            {{ dayjs(data.item.registerDate).format('DD-MM-YYYY') }}
          </template>

          <template #cell(registerTime)="data">
            {{ data.item.registerTime }}
          </template>

          <template #cell(status)="data">
            {{ data.item.status === 'PENDING' ? 'Chưa xác nhận' : data.item.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đã từ chối' }}
          </template>

          <template #cell(actions)="data">
<!--            <button class="btn btn-danger" :class="{disabled: false}" @click="rejectCheckup(data.item)">Từ chối</button>-->
            <button v-if="data.item.status !== 'CONFIRMED'" class="ms-2 btn btn-success" :class="{disabled: false}" @click="confirmCheckup(data.item)">Xác nhận</button>
            <button v-if="data.item.status !== 'CONFIRMED'" class="ms-2 btn btn-primary" @click="prepareDataForUpdateCheckup(data.item)">Sửa</button>
            <a-modal
              ref="updateModal"
              v-model:open="openUpdateModal"
              title="Cập nhật đăng ký"
              @ok="updateCheckup(checkupData[data.index])"
              :closable="false"
              centered
              cancel-text="Hủy"
              ok-text="Cập nhật"
            >
              <b-form-group id="input-group-1" label="Họ tên" label-for="input-1">
                <b-form-input id="input-1" v-model="selectedCheckup.customerName" type="text" placeholder="Họ tên"
                              required></b-form-input>
              </b-form-group>

              <b-form-group id="input-group-2" label="Điện thoại" label-for="input-2">
                <b-form-input id="input-2" v-model="selectedCheckup.customerPhone" type="text" placeholder="Điện thoại"
                              required></b-form-input>
              </b-form-group>

              <b-form-group label="Chọn ngày khám" label-for="date-picker">
                <a-date-picker id="date-picker" :placeholder="dayjs(selectedCheckup.registerDate).format('DD-MM-YYYY')"
                               v-model:value="updatedRegisterDate" format="DD-MM-YYYY" class="w-100"/>
              </b-form-group>

              <b-form-group label="Chọn khung giờ" label-for="input-6">
                <a-radio-group id="input-6" v-model:value="selectedCheckup.registerTime" :options="['Sáng', 'Chiều']"/>
              </b-form-group>
            </a-modal>

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
import dayjs from "dayjs";
import {message} from "ant-design-vue";

export default {
  name: "CheckupManagementPage",
  data() {
    return {
      fields: [
        {key: 'index', label: 'STT'},
        {key: 'customerName', label: 'Họ tên'},
        {key: 'customerPhone', label: 'Số điện thoại'},
        {key: 'registerDate', label: 'Ngày đăng ký', sortable: true},
        {key: 'registerTime', label: 'Buổi'},
        {key: 'status', label: 'Trạng thái'},
        {key: 'actions', label: 'Thao tác'}
      ],
      checkupData: [],
      openUpdateModal: false,
      updatedRegisterDate: '',
      selectedCheckup: {},
      pagination: {
        perPage: 5,
        currentPage: 1,
        rows: 20,
      },
      selectedStatus: '',
    }
  },
  async created() {
    this.getCheckups()
  },
  methods: {
    dayjs,
    getCheckups() {
      axios.get('/api/v1/checkups/get-by-page/', {
        params: {
          pageIndex: this.pagination.currentPage - 1,
          pageSize: this.pagination.perPage
        }
      })
        .then(response => {
          if (response.code === 200) {
            console.log(response.data)
            this.checkupData = response.data.content
            this.checkupData.forEach(user => console.log(user))
            this.pagination.rows = response.data.totalElements
          } else {
            message.error(response.message)
          }
        })
        .catch(error => {
          message.error(error.response.data.message)
        })
    },
    changePage() {
      this.getCheckups()
    },
    removeCheckup(data) {
      axios.delete('/api/v1/checkups/' + data.item.id)
        .then(response => {
          if (response.code === 200) {
            message.success("Xoá đăng ký thành công!")
            this.checkupData.splice(data.index, 1)
          }
        })
        .catch(error => message.error(error.response.data.message))
    },
    updateCheckup(checkup) {
      this.selectedCheckup.registerDate = this.updatedRegisterDate ? this.updatedRegisterDate : this.selectedCheckup.registerDate
      axios.put('/api/v1/checkups/' + this.selectedCheckup.id, JSON.parse(JSON.stringify(this.selectedCheckup)))
        .then(response => {
          if (response.code === 200) {
            message.success("Cập nhật đăng ký thành công!")
            const index = this.checkupData.findIndex(checkup => checkup.id === this.selectedCheckup.id)
            this.checkupData[index] = response.data
            this.openUpdateModal = false
            this.selectedCheckup = {}
          }
        })
        .catch(e => message.error(error.response.data.message))
    },
    prepareDataForUpdateCheckup(checkup) {
      this.selectedCheckup = JSON.parse(JSON.stringify(checkup))
      this.openUpdateModal = true
    },
    confirmCheckup(checkup) {
      checkup.status = 'CONFIRMED'

      axios.put('/api/v1/checkups/' + checkup.id, checkup)
        .then(response => {
          if (response.code === 200) {
            message.success("Cập nhật đăng ký thành công!")
            const index = this.checkupData.findIndex(c => c.id === checkup.id)
            this.checkupData[index] = response.data
            this.openUpdateModal = false
            this.selectedCheckup = {}
          }
        })
        .catch(e => message.error(e.message))
    },
    rejectCheckup(checkup) {
      checkup.status = 'CONFIRMED'
      this.updateCheckup(checkup)
    }
  },
  computed: {
    tableData() {
      return this.checkupData.filter(checkup => {
        if (!this.selectedStatus || this.selectedStatus.name === 'ALL') {
          return true
        } else {
          return checkup.status === this.selectedStatus.name
        }
      })
    },
    filterStatus() {
      return [
        {
          text: 'Tất cả',
          value: {name: 'ALL'}
        },
        {
          text: 'Chưa xác nhận',
          value: {name: 'PENDING'}
        },
        {
          text: 'Đã xác nhận',
          value: {name: 'CONFIRMED'}
        }
      ]
    }
  }
}
</script>

<style scoped lang="scss">
.actions:hover {
  cursor: pointer;
}
</style>