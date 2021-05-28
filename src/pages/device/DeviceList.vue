<template>
  <div class="main_content">
    <q-table
      title="设备列表"
      :data="data"
      :columns="columns"
      row-key="field"
      hide-bottom
    />

  </div>
</template>

<script>
export default {
  name: "DeviceList",
  data() {
    return {
      data: [],
      columns: [
        {field: 'id', label: '设备ID', align:'left'},
        {field: 'type', label: '设备类型', align:'left'},
        {field: 'name', label: '设备名称', align:'left'},
        {field: 'manufacturer', label: '生产商', align:'left'},
        {field: 'model', label: '型号', align:'left'},
        {field: 'online', label: '状态', align:'left'}
      ],
      queryParams: {
        page: 1,
        pageSize: 15
      }
    }
  },
  mounted() {
    this.queryDeviceList();
  },
  methods: {
    queryDeviceList() {
      const app = this;
      app.$axios.get('/api/v1/device/page', {
        params: {
          ...app.queryParams
        }
      })
      .then(res => {
        if (res.data.success) {
          app.data = res.data.data;
        } else {

        }
      })
    }
  }
}
</script>

<style scoped>

</style>
