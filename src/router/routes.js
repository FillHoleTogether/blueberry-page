
const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/Index.vue') }
    ]
  },
  {
    path: '/devices',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/device/DeviceList') }
    ]
  },
  {
    path: '/channels/:deviceId',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/device/ChannelList') }
    ]
  },
  {
    path: '/streams',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/stream/StreamList') }
    ]
  },
  {
    path: '/schedules',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', component: () => import('pages/schedule/ScheduleList') }
    ]
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
]

export default routes
