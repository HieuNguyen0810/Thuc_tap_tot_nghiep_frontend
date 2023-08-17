<template>
  <div class="container">
    <h3 class="text-center my-3">Lịch sử đăng ký</h3>

    <div style="max-height: 65vh; overflow-y: auto;">
      <b-table
        ref="table"
        hover outlined head-variant="light"
        :items="tableData"
        :per-page="perPage"
        :fields="fields">
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
          <button class="btn btn-danger" :class="{disabled: isConfirmed(data.item)}" @click="removeCheckup(data)">Xóa
          </button>
          <button class="ms-2 btn btn-primary" @click="prepareDataForUpdateCheckup(data.item)">Sửa</button>

          <a-modal
            ref="updateModal"
            v-model:open="openUpdateModal"
            title="Cập nhật đăng ký"
            @ok="updateCheckup"
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

      <b-pagination v-model="currentPage" pills :total-rows="rows" align="center"></b-pagination>
    </div>
  </div>
</template>

<script>
import {defineComponent} from 'vue'
import axios from "axios";
import {message} from "ant-design-vue";
import dayjs from "dayjs";

export default defineComponent({
  name: "CheckupHistory",
  data() {
    return {
      rows: 100,
      currentPage: 1,
      perPage: 10,
      openUpdateModal: false,
      fields: [
        {key: 'id', label: 'ID'},
        {key: 'customerName', label: 'Họ tên'},
        {key: 'customerPhone', label: 'Số điện thoại'},
        {key: 'registerDate', label: 'Ngày đăng ký', sortable: true},
        {key: 'registerTime', label: 'Buổi'},
        {key: 'status', label: 'Trạng thái'},
        {key: 'actions', label: 'Thao tác'}
      ],
      checkupData: [],
      updatedRegisterDate: '',
      selectedCheckup: {},

    }
  },
  created() {
    this.getCheckups()
  },
  computed: {
    tableData() {
      return this.checkupData.reduce((finalData, currentCheckup) => {
        finalData.push({...currentCheckup, ...{editMode: false}})
        return finalData
      }, [])
    }
  },
  methods: {
    dayjs,
    isConfirmed(checkup) {
      return checkup.status === 'Đã xác nhận'
    },
    removeCheckup(data) {
      axios.delete('/api/v1/checkups/' + data.item.id)
        .then(response => {
          if (response.code === 200) {
            message.success("Xoá đăng ký thành công!")
            this.checkupData.splice(data.index, 1)
          }
        })
        .catch(e => message.error(e.message))
    },
    updateCheckup() {
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
        .catch(e => message.error(e.message))
    },
    prepareDataForUpdateCheckup(checkup) {
      console.log(checkup)
      this.selectedCheckup = JSON.parse(JSON.stringify(checkup))
      this.openUpdateModal = true
    },
    changePage(event, pageNumber) {
      this.currentPage = pageNumber
      this.getCheckups()
    },
    getCheckups() {
      const customerId = this.$store.state.customerId
      if (!customerId) {
        message.error('Không tìm thấy id khách hàng')
        return;
      }
      axios.get('/api/v1/checkups/get-by-customer/' + customerId, {
        params: {
          pageIndex: this.currentPage - 1,
          pageSize: this.perPage
        }
      })
        .then(response => {
          if (response.code === 200) {
            console.log(response.data)
            this.checkupData = response.data.content
            this.checkupData.forEach(user => console.log(user))

            this.rows = response.data.totalElements
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
.ant-modal-title {
  text-align: center;
}
</style>