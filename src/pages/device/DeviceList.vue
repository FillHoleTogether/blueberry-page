<template>
  <div class="main_content">
    <q-table
      :data="data"
      :columns="columns"
      row-key="field"
      hide-bottom
      :pagination="pagination"
    >
      <template v-slot:top-left>
        <span>设备列表</span>
      </template>
      <template v-slot:top-right>
        <q-btn
          color="primary"
          size="xs"
          label="新建"
          @click="addClick"
        />
        <q-btn flat color="primary" label="" icon="refresh" @click="refreshClick"/>
      </template>
      <template v-slot:body-cell-operations="props">
        <q-td :props="props">
          <q-btn
            color="primary"
            size="xs"
            label="通道"
            @click="openChannelList(props.row)"
            style="margin-right: 5px"
          />
          <q-btn
            color="brown-5"
            size="xs"
            label="编辑"
            @click="editClick(props.row)"
            style="margin-right: 5px"
          />
          <q-btn
            color="red"
            size="xs"
            label="删除"
            @click="removeClick(props.row)"
            style="margin-right: 5px"
          />
        </q-td>
      </template>
    </q-table>
    <device-form v-if="showForm" :form-data="formData" @close="formClose" @success="formSuccess"></device-form>
    <device-remove-confirm v-if="showConfirm" :data="removeData" @close="removeClose"
                           @success="removeSuccess"></device-remove-confirm>
  </div>
</template>

<script>
import DeviceForm from "pages/device/DeviceForm";
import DeviceRemoveConfirm from "pages/device/DeviceRemoveConfirm";

export default {
  name: "DeviceList",
  components: {DeviceRemoveConfirm, DeviceForm},
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
        // {name: 'createdAt', field: 'createdAt', label: '注册时间', align: 'left'},
        {name: 'lastKeepaliveAt', field: 'lastKeepaliveAt', label: '最后心跳', align: 'left'},
        {name: 'operations', field: 'operations', label: '操作', align: 'left'}
      ],
      pagination: {
        rowsPerPage: 0
      },
      refreshInterval: null,
      showForm: false,
      formData: null,
      showConfirm: false,
      removeData: null
    }
  },
  mounted() {
    const app = this;
    app.queryList();
    if (app.refreshInterval) {
      clearInterval(app.refreshInterval);
    }
    app.refreshInterval = setInterval(() => app.queryList(), 10000);
  },
  destroyed() {
    const app = this;
    if (app.refreshInterval) {
      clearInterval(app.refreshInterval);
    }
  },
  methods: {
    queryList() {
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
    openChannelList(device) {
      this.$router.push({path: '/channels/' + device.type + '/' + device.id})
    },
    refreshClick() {
      this.queryList();
    },
    addClick() {
      this.formData = null;
      this.showForm = true;
    },
    editClick(data) {
      this.formData = data;
      this.showForm = true;
    },
    formClose() {
      this.formData = null;
      this.showForm = false;
    },
    formSuccess() {
      this.formClose();
      this.queryList();
    },
    removeClose() {
      this.removeData = null;
      this.showConfirm = false;
    },
    removeClick(data) {
      this.removeData = data;
      this.showConfirm = true;
    },
    removeSuccess() {
      this.removeClose();
      this.queryList();
    }
  }
}
</script>

<style scoped>

</style>
