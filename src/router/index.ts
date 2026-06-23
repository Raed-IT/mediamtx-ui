import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: () => import('@/views/Home.vue'),
      meta: { title: 'لوحة التحكم' }
    },
    {
      path: '/paths',
      name: 'paths',
      component: () => import('@/views/Paths.vue'),
      meta: { title: 'حالة المسارات' }
    },
    {
      path: '/paths/config',
      name: 'pathsConfig',
      component: () => import('@/views/PathsConfig.vue'),
      meta: { title: 'إعدادات المسارات' }
    },
    {
      path: '/rtsp/connections',
      name: 'rtspConnections',
      component: () => import('@/views/RtspConnections.vue'),
      meta: { title: 'اتصالات RTSP' }
    },
    {
      path: '/rtsp/sessions',
      name: 'rtspSessions',
      component: () => import('@/views/RtspSessions.vue'),
      meta: { title: 'جلسات RTSP' }
    },
    {
      path: '/rtmp/connections',
      name: 'rtmpConnections',
      component: () => import('@/views/RtmpConnections.vue'),
      meta: { title: 'اتصالات RTMP' }
    },
    {
      path: '/webrtc/sessions',
      name: 'webrtcSessions',
      component: () => import('@/views/WebRTCSessions.vue'),
      meta: { title: 'جلسات WebRTC' }
    },
    {
      path: '/hls/muxers',
      name: 'hlsMuxers',
      component: () => import('@/views/HlsMuxers.vue'),
      meta: { title: 'موزعات HLS' }
    },
    {
      path: '/srt/connections',
      name: 'srtConnections',
      component: () => import('@/views/SrtConnections.vue'),
      meta: { title: 'اتصالات SRT' }
    },
    {
      path: '/recordings',
      name: 'recordings',
      component: () => import('@/views/Recordings.vue'),
      meta: { title: 'إدارة التسجيلات' }
    },
    {
      path: '/config',
      name: 'config',
      component: () => import('@/views/Config.vue'),
      meta: { title: 'إعدادات النظام' }
    }
  ]
})

router.beforeEach((to) => {
  document.title = `${to.meta.title || 'MediaMTX'} - لوحة تحكم MediaMTX`
})

export default router