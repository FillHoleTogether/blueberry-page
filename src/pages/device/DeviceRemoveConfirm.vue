<template>
  <q-dialog v-model="show" persistent>
    <q-card style="min-width: 300px">
      <q-card-section class="row items-center">
        <q-icon name="warning" class="text-red" style="font-size: 2em;" />
        <span class="q-ml-sm">是否删除以下设备 ?</span>
      </q-card-section>
      <q-card-section class="row items-center">
        <div style="padding-left: 50px">
          <p>
            <span>●&nbsp;</span>
            <span>{{ data.id }} - {{ data.name }}</span>
          </p>
        </div>
      </q-card-section>
      <q-card-actions align="right">
        <q-btn size="sm" label="确定" color="primary" @click="submit"/>
        <q-btn size="sm" flat label="取消" color="primary" @click="close" />
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script>

export default {
  name: "DeviceRemoveConfirm",
  data() {
    return {
      show: true
    }
  },
  props: {
    data: {
      type: Object
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    submit() {
      const app = this;
      const url = '/api/v1/device/delete';
      app.$axios.post(url, {
        deviceId: app.data.id
      })
        .then(res => {
          if (res.data.success) {
            app.$emit('success');
            // todo 成功提示
          } else {
            // todo 错误提示
          }
        })
        .catch(e => {
          // todo 错误提示
        })
    }
  }
}
</script>

<style scoped>

</style>
