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
        <q-btn
          color="primary"
          size="xs"
          label="新建"
          v-if="deviceType !== 'GB'"
          @click="addClick"
        />
        <q-btn flat color="primary" label="" icon="refresh" @click="refreshClick"/>
        <q-btn flat color="primary" label="< 返回" @click="backClick"/>
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
            v-if="props.row.parental === 0 && props.row.online === 1"
            color="secondary"
            size="xs"
            label="预览"
            style="margin-right: 5px"
            @click="playClick(props.row.id)"
          />
          <q-btn
            color="brown-5"
            size="xs"
            label="编辑"
            style="margin-right: 5px"
            @click="editClick(props.row)"
          />
          <q-btn
            color="red"
            size="xs"
            label="删除"
            @click="removeClick(props.row)"
          />
        </q-td>
      </template>
    </q-table>
    <stream-view v-if="showStreamView" :device-id="deviceId" :channel-id="currentChannelId"
                 @close="streamViewClose"></stream-view>
    <channel-form v-if="showForm" :form-data="formData" @close="formClose" @success="formSuccess"></channel-form>
    <channel-remove-confirm v-if="showConfirm" :data="removeData" @close="removeClose"
                            @success="removeSuccess"></channel-remove-confirm>
  </div>
</template>

<script>
import StreamView from "pages/channel/StreamViewer";
import ChannelForm from "pages/channel/ChannelForm";
import ChannelRemoveConfirm from "pages/channel/ChannelRemoveConfirm";

export default {
  name: "ChannelList",
  components: {ChannelRemoveConfirm, ChannelForm, StreamView},
  data() {
    return {
      data: [],
      pagination: {
        rowsPerPage: 0
      },
      currentChannelId: null,
      showStreamView: false,
      refreshInterval: null,
      showForm: false,
      formData: null,
      showConfirm: false,
      removeData: null
    }
  },
  computed: {
    deviceId() {
      return this.$route.params.deviceId
    },
    deviceType() {
      return this.$route.params.deviceType
    },
    title() {
      const app = this;
      return '设备[' + app.deviceId + '] - 通道列表';
    },
    columns() {
      const deviceType = this.deviceType;
      if (deviceType === 'RTSP') {
        return [
          {name: 'id', field: 'id', label: '通道ID', align: 'left'},
          {name: 'name', field: 'name', label: '名称', align: 'left'},
          {name: 'manufacturer', field: 'manufacturer', label: '生产商', align: 'left'},
          {name: 'model', field: 'model', label: '型号', align: 'left'},
          {name: 'rtsp', field: 'rtsp', label: 'rtsp', align: 'left'},
          {
            name: 'online',
            field: 'online',
            label: '状态',
            align: 'left',
            format: (val, row) => val === 1 ? '在线' : '离线'
          },
          {
            name: 'status',
            field: 'status',
            label: '异常',
            align: 'left',
            format: (val, row) => val === 'ON' ? '否' : '是'
          },
          {name: 'operations', field: 'operations', label: '操作', align: 'left'}
        ]
      } else {
        return [
          {name: 'id', field: 'id', label: '通道ID', align: 'left'},
          {name: 'name', field: 'name', label: '名称', align: 'left'},
          {name: 'manufacturer', field: 'manufacturer', label: '生产商', align: 'left'},
          {name: 'model', field: 'model', label: '型号', align: 'left'},
          {name: 'civilCode', field: 'civilCode', label: '行政区域', align: 'left'},
          {
            name: 'parental',
            field: 'parental',
            label: '是否有子目录',
            align: 'left',
            format: (val, row) => val === 1 ? '是' : '否'
          },
          {
            name: 'online',
            field: 'online',
            label: '状态',
            align: 'left',
            format: (val, row) => val === 1 ? '在线' : '离线'
          },
          {
            name: 'status',
            field: 'status',
            label: '异常',
            align: 'left',
            format: (val, row) => val === 'ON' ? '否' : '是'
          },
          {name: 'operations', field: 'operations', label: '操作', align: 'left'}
        ]
      }
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
      this.queryList();
    },
    playClick(channelId) {
      this.currentChannelId = channelId;
      this.showStreamView = true;
    },
    streamViewClose() {
      this.showStreamView = false;
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
