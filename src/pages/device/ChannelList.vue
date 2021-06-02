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
        <span>{{ title }}</span>
      </template>
      <template v-slot:top-right>
        <q-btn flat color="primary" label="< 返回" @click="backClick"/>
        <q-btn flat color="primary" label="" icon="refresh" @click="refreshClick"/>
      </template>
      <template v-slot:body-cell-operations="props">
        <q-td :props="props">
          <q-btn
            v-if="props.row.parental === 1"
            color="primary"
            size="xs"
            label="子目录"
            style="margin-right: 5px"
          />
          <q-btn
            v-if="props.row.parental === 0"
            color="secondary"
            size="xs"
            label="预览"
            style="margin-right: 5px"
            @click="playClick(props.row.id)"
          />
        </q-td>
      </template>
    </q-table>
    <stream-view v-if="showStreamView" :device-id="deviceId" :channel-id="currentChannelId" @close="streamViewClose"></stream-view>
  </div>
</template>

<script>
import StreamView from "pages/device/StreamViewer";
export default {
  name: "ChannelList",
  components: {StreamView},
  data() {
    return {
      data: [],
      columns: [
        {name: 'id', field: 'id', label: '通道ID', align: 'left'},
        {name: 'name', field: 'name', label: '名称', align: 'left'},
        {name: 'manufacturer', field: 'manufacturer', label: '生产商', align: 'left'},
        {name: 'model', field: 'model', label: '型号', align: 'left'},
        {name: 'civilCode', field: 'civilCode', label: '行政区域', align: 'left'},
        {name: 'parental', field: 'parental', label: '是否有子目录', align: 'left', format: (val, row) => val === 1 ? '是' : '否'},
        {name: 'status', field: 'status', label: '状态', align: 'left', format: (val, row) => val === 'ON' ? '正常' : '异常'},
        {name: 'operations', field: 'operations', label: '操作', align: 'left'}
      ],
      pagination: {
        rowsPerPage: 0
      },
      currentChannelId: null,
      showStreamView: false,
      refreshInterval: null
    }
  },
  computed: {
    deviceId() {
      return this.$route.params.deviceId
    },
    title() {
      const app = this;
      return '设备[' + app.deviceId + '] - 通道列表';
    }
  },
  mounted() {
    const app = this;
    app.queryChannelList();
    if (app.refreshInterval) {
      clearInterval(app.refreshInterval);
    }
    app.refreshInterval = setInterval(() => app.queryChannelList(), 10000);
  },
  destroyed() {
    const app = this;
    if (app.refreshInterval) {
      clearInterval(app.refreshInterval);
    }
  },
  methods: {
    queryChannelList() {
      const app = this;
      app.$axios.get('/api/v1/channel/list', {
        params: {
          deviceId: app.deviceId
        }
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
    backClick() {
      this.$router.push({path: '/devices'})
    },
    refreshClick() {
      this.queryChannelList();
    },
    playClick(channelId) {
      this.currentChannelId = channelId;
      this.showStreamView = true;
    },
    streamViewClose() {
      this.showStreamView = false;
    }
  }
}
</script>

<style scoped>

</style>
