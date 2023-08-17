<template>
  <div class="m-2">
    <a-layout-header style="background: #fff; padding: 0" class="m-3">
      <h3 style="font-weight: bold; line-height: 64px;" class="text-center">Báo cáo</h3>
    </a-layout-header>
    <a-layout-content style="margin: 0 16px">
      <div :style="{ minHeight: '100vh' }">
        <div class="d-flex justify-content-between align-items-end">
          <div class="d-flex justify-content-between align-items-end" style="width: 475px;">
            <b-form-group label="Từ ngày:" label-for="date-picker">
              <a-date-picker id="date-picker" placeholder="Từ ngày"
                             v-model:value="dateRange.from" format="DD-MM-YYYY" class="w-100"/>
            </b-form-group>

            <b-form-group label="Đến ngày" label-for="date-picker">
              <a-date-picker id="date-picker" placeholder="Đến ngày"
                             v-model:value="dateRange.to" format="DD-MM-YYYY" class="w-100"/>
            </b-form-group>

            <button
              class="btn btn-primary mb-3"
              style="height: 40px;"
              @click="getCheckups"
            >Xác nhận
            </button>
          </div>

          <button
            class="btn btn-success mb-3"
            style="height: 40px;"
            @click="exportToExcelFile"
          >
            <i class="bi bi-download me-2"></i>
            <span>Xuất Excel</span>
          </button>
        </div>

        <div class="d-flex justify-content-between">
          <div>
            <div><span class="fw-bold">Tổng số đăng ký: {{ countTotalCheckups }}</span></div>
            <div><span class="fw-bold">Chưa xác nhận: {{ countTotalPendingCheckups }}</span></div>
            <div><span class="fw-bold">Đã xác nhận: {{ countTotalConfirmedCheckups }}</span></div>
<!--            <div><span class="fw-bold">Đã từ chối: {{ countTotalRejectCheckups }}</span></div>-->
          </div>

          <b-form-group id="input-group-11" label="Lọc theo trạng thái:" label-for="input-11" label-align-sm="right">
            <b-form-select id="select-11" v-model="selectedStatus" :options="filterStatus" placeholder="Vai trò"
                           required></b-form-select>
          </b-form-group>
        </div>


        <b-table
          ref="table"
          hover outlined head-variant="light"
          :items="tableData"
          :per-page="pagination.perPage"
          :fields="fields">

          <template #cell(index)="data">{{ data.index + 1 }}</template>
          <template #cell(registerDate)="data">
            {{ dayjs(data.item.registerDate).format('DD-MM-YYYY') }}
          </template>

          <template #cell(registerTime)="data">
            {{ data.item.registerTime }}
          </template>

          <template #cell(status)="data">
            {{
              data.item.status === 'PENDING' ? 'Chưa xác nhận' : data.item.status === 'CONFIRMED' ? 'Đã xác nhận' : 'Đã từ chối'
            }}
          </template>

        </b-table>

        <b-pagination
          v-model="pagination.currentPage"
          :per-page="pagination.perPage"
          pills
          :total-rows="checkupData.length"
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
  name: "ReportPage",
  data() {
    return {
      fields: [
        {key: 'index', label: 'STT'},
        {key: 'customerName', label: 'Họ tên'},
        {key: 'customerPhone', label: 'Số điện thoại'},
        {key: 'registerDate', label: 'Ngày đăng ký', sortable: true},
        {key: 'registerTime', label: 'Buổi'},
        {key: 'status', label: 'Trạng thái'},
      ],
      checkupData: [],
      openUpdateModal: false,
      updatedRegisterDate: '',
      selectedCheckup: {},
      pagination: {
        perPage: 5,
        currentPage: 1,
      },
      selectedStatus: '',
      dateRange: {
        from: '',
        to: ''
      }
    }
  },
  methods: {
    dayjs,
    getCheckups() {
      if (!this.dateRange.from || !this.dateRange.to) {
        message.error('Không để trống ngày')
        return
      }

      axios.post('/api/v1/report/get-checkups-report/',
        this.dateRange)
        .then(response => {
          if (response.code === 200) {
            console.log(response.data)
            this.checkupData = response.data
          } else {
            message.error(response.message)
          }
        })
        .catch(error => {
          message.error(error.response.data.message)
        })
    },
    changePage(event, pageNumber) {
      this.pagination.currentPage = pageNumber
    },
    exportToExcelFile() {
      if (!this.dateRange.from || !this.dateRange.to) {
        message.error('Không để trống ngày')
        return
      }

      axios.post('/api/v1/report/export-to-excel-file/',
        this.dateRange,
        {
          responseType: 'blob'
        }
      )
        .then(response => {
          console.log(response)
          const data = response;

          // Create a download link
          const link = document.createElement('a');
          link.href = window.URL.createObjectURL(data);
          link.download = 'Bao cao dang ky tu ngay ' +
            dayjs(this.dateRange.from).format('DD-MM-YYYY') +
            ' den ngay ' +
            dayjs(this.dateRange.to).format('DD-MM-YYYY') +
            '.xlsx';
          link.click();
        })
        .catch(error => {
          message.error(error.message)
        })
    }
  },
  computed: {
    tableData() {
      const startIndex = this.pagination.perPage * (this.pagination.currentPage - 1)
      return (this.checkupData.filter(checkup => {
        if (!this.selectedStatus || this.selectedStatus.name === 'ALL') {
          return true
        } else {
          return checkup.status === this.selectedStatus.name
        }
      })).slice(startIndex, startIndex + this.pagination.perPage)
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
    },
    countTotalCheckups() {
      return this.checkupData.length
    },
    countTotalPendingCheckups() {
      return this.checkupData.filter(checkup => checkup.status === 'PENDING').length
    },
    countTotalConfirmedCheckups() {
      return this.checkupData.filter(checkup => checkup.status === 'CONFIRMED').length
    },
    countTotalRejectCheckups() {
      return this.checkupData.filter(checkup => checkup.status === 'REJECT').length
    }
  }
}
</script>

<style scoped lang="scss">
.actions:hover {
  cursor: pointer;
}
</style>