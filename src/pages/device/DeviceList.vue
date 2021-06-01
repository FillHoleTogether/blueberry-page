<template>
  <div class="main_content">
    <q-table
      title="设备列表"
      :data="data"
      :columns="columns"
      row-key="field"
      hide-bottom
      :pagination="pagination"
    >
      <template v-slot:top-left>
        <span class="table_top_title">设备列表</span>
      </template>
      <template v-slot:top-right>
        <q-btn flat color="primary" label="" icon="refresh" @click="refreshClick"/>
      </template>
      <template v-slot:body-cell-operations="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            size="xs"
            label="通道列表"
            @click="openChannelList(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
  </div>
</template>

<script>
export default {
  name: "DeviceList",
  data() {
    return {
      data: [],
      columns: [
        {name: 'id', field: 'id', label: '设备ID', align: 'left'},
        {name: 'type', field: 'type', label: '设备类型', align: 'left'},
        {name: 'name', field: 'name', label: '设备名称', align: 'left'},
        {name: 'manufacturer', field: 'manufacturer', label: '生产商', align: 'left'},
        {name: 'model', field: 'model', label: '型号', align: 'left'},
        {name: 'online', field: 'online', label: '状态', align: 'left', format: (val, row) => val === 1 ? '在线' : '离线'},
        {name: 'createdAt', field: 'createdAt', label: '注册时间', align: 'left'},
        {name: 'lastKeepaliveAt', field: 'lastKeepaliveAt', label: '最后心跳', align: 'left'},
        {name: 'operations', field: 'operations', label: '操作', align: 'left'}
      ],
      pagination: {
        rowsPerPage: 0
      }
    }
  },
  mounted() {
    this.queryDeviceList();
  },
  methods: {
    queryDeviceList() {
      const app = this;
      app.$axios.get('/api/v1/device/list', {
        params: {}
      })
        .then(res => {
          if (res.data.success) {
            app.data = res.data.data;
          } else {
            // todo 查询失败提示
          }
        })
        .catch(e => {
          // todo 查询失败提示
        })
    },
    openChannelList(deviceId) {
      this.$router.push({path: '/channels/' + deviceId})
    },
    refreshClick() {
      this.queryDeviceList();
    }
  }
}
</script>

<style scoped>

</style>
