<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount, watch } from 'vue'
import { useThemeStore } from './stores/theme'
import { useSystemStore } from './stores/system'
import { useRoute } from 'vue-router'
import { formatUptime } from './composables/useFormatters'

const isCollapse = ref(false)
const isMobile = ref(false)
const route = useRoute()
const themeStore = useThemeStore()
const systemStore = useSystemStore()

const toggleSidebar = () => {
  isCollapse.value = !isCollapse.value
}

const checkIsMobile = () => {
  isMobile.value = window.innerWidth < 768
  if (isMobile.value && !isCollapse.value) {
    isCollapse.value = true
  }
}

onMounted(() => {
  checkIsMobile()
  window.addEventListener('resize', checkIsMobile)
  systemStore.fetchInfo().catch(() => {})
})

onBeforeUnmount(() => {
  window.removeEventListener('resize', checkIsMobile)
})

watch(
  () => route.path,
  () => {
    if (isMobile.value) isCollapse.value = true
  }
)
</script>

<template>
  <div class="app-wrapper" dir="rtl">
    <!-- Mobile mask -->
    <div
      v-if="isMobile && !isCollapse"
      class="sidebar-mask"
      @click="isCollapse = true"
    />

    <!-- Sidebar -->
    <aside
      :style="{ width: isCollapse ? '64px' : '220px' }"
      :class="[
        'sidebar-container',
        {
          collapsed: isMobile && isCollapse,
          'mobile-open': isMobile && !isCollapse
        }
      ]"
    >
      <div class="sidebar-logo">
        <el-icon class="logo-icon"><VideoCamera /></el-icon>
        <span v-if="!isCollapse" class="logo-text">MediaMTX</span>
      </div>

      <el-menu
        :router="true"
        :default-active="$route.path"
        class="sidebar-menu"
        :collapse="isCollapse"
        :collapse-transition="false"
      >
        <el-menu-item index="/">
          <el-icon><Odometer /></el-icon>
          <template #title>لوحة التحكم</template>
        </el-menu-item>

        <el-sub-menu index="streams">
          <template #title>
            <el-icon><VideoPlay /></el-icon>
            <span>إدارة البث</span>
          </template>

          <el-menu-item index="/paths">
            <el-icon><Connection /></el-icon>
            <span>حالة المسارات</span>
          </el-menu-item>

          <el-menu-item index="/paths/config">
            <el-icon><Setting /></el-icon>
            <span>إعدادات المسارات</span>
          </el-menu-item>
        </el-sub-menu>

        <el-sub-menu index="connections">
          <template #title>
            <el-icon><Link /></el-icon>
            <span>إدارة الاتصالات</span>
          </template>

          <el-menu-item index="/rtsp/connections">
            <span>اتصالات RTSP</span>
          </el-menu-item>

          <el-menu-item index="/rtsp/sessions">
            <span>جلسات RTSP</span>
          </el-menu-item>

          <el-menu-item index="/rtmp/connections">
            <span>اتصالات RTMP</span>
          </el-menu-item>

          <el-menu-item index="/webrtc/sessions">
            <span>جلسات WebRTC</span>
          </el-menu-item>

          <el-menu-item index="/hls/muxers">
            <span>موزعات HLS</span>
          </el-menu-item>

          <el-menu-item index="/srt/connections">
            <span>اتصالات SRT</span>
          </el-menu-item>
        </el-sub-menu>

        <el-menu-item index="/recordings">
          <el-icon><Folder /></el-icon>
          <template #title>إدارة التسجيلات</template>
        </el-menu-item>

        <el-menu-item index="/config">
          <el-icon><Setting /></el-icon>
          <template #title>إعدادات النظام</template>
        </el-menu-item>
      </el-menu>
    </aside>

    <!-- Main -->
    <div class="main-container">
      <header class="app-header">
        <div class="header-left">
          <el-icon
            style="font-size: 20px; cursor: pointer"
            @click="toggleSidebar"
          >
            <Expand v-if="isCollapse" />
            <Fold v-else />
          </el-icon>

          <span class="header-title">
            {{ $route.meta.title || 'MediaMTX' }}
          </span>
        </div>

        <div class="header-right">
          <div class="server-info" v-if="systemStore.info">
            <span
              :class="['status-dot', { offline: !systemStore.connected }]"
            />
            <span class="version-text">
              v{{ systemStore.info.version }}
            </span>
            <span style="opacity: 0.5">|</span>
            <span>
              {{ formatUptime(systemStore.info.started) }}
            </span>
          </div>

          <el-tooltip
            :content="
              themeStore.currentTheme === 'dark'
                ? 'الوضع الفاتح'
                : 'الوضع الداكن'
            "
            placement="bottom"
          >
            <el-button
              circle
              size="small"
              @click="themeStore.toggleTheme()"
            >
              <el-icon>
                <Sunny v-if="themeStore.currentTheme === 'dark'" />
                <Moon v-else />
              </el-icon>
            </el-button>
          </el-tooltip>
        </div>
      </header>

      <main class="app-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </main>
    </div>
  </div>
</template>

<style scoped>
.app-wrapper {
  direction: rtl;
}

.sidebar-container {
  flex-shrink: 0;
}

.sidebar-menu {
  border-right: none;
}

.sidebar-menu:not(.el-menu--collapse) {
  width: 220px;
}

@media (max-width: 768px) {
  .sidebar-container.mobile-open {
    position: fixed;
    top: 0;
    right: 0;
    left: auto;
    bottom: 0;
    z-index: 101;
  }
}
</style>