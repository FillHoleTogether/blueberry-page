<template>
  <q-layout view="hHh lpr fFf">

    <q-header elevated class="bg-primary text-white" height-hint="98">
      <q-toolbar>
        <q-btn dense flat round icon="menu" @click="left = !left" />

        <q-toolbar-title>
<!--          <q-avatar>-->
<!--            <img src="/logo.jpg">-->
<!--          </q-avatar>-->
          Blueberry
        </q-toolbar-title>
      </q-toolbar>

      <q-tabs align="left">

      </q-tabs>
    </q-header>

    <q-drawer show-if-above v-model="left" side="left" bordered>
      <q-list>
        <template v-for="(menuItem, index) in menuList">
          <q-item :key="index" clickable v-ripple :to="menuItem.to">
            <q-item-section avatar>
              <q-icon :name="menuItem.icon"></q-icon>
            </q-item-section>
            <q-item-section>
              {{ menuItem.label }}
            </q-item-section>
          </q-item>
          <q-separator :key="'sep' + index" v-if="menuItem.separator"></q-separator>
        </template>
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>

  </q-layout>

</template>

<script>

export default {
  name: 'MainLayout',
  components: {},
  data() {
    return {
      left: false,
      menuList: [{
        icon: 'list',
        label: '设备列表',
        to: '/devices',
        separator: true
      },{
        icon: 'videocam',
        label: '视频列表',
        to: '/streams',
        separator: true
      },{
        icon: 'videocam',
        label: '定时任务',
        to: '/schedules',
        separator: true
      }]
    }
  }
}
</script>
