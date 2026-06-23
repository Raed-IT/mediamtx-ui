<template>
  <div>
    <!-- بطاقات الإحصائيات -->
    <el-row :gutter="16" style="margin-bottom: 20px">
      <el-col
        :xs="12"
        :sm="6"
        v-for="(card, i) in statCards"
        :key="i"
        style="margin-bottom: 12px"
      >
        <el-card
          class="stat-card"
          :style="{ background: `var(--stat-card-${i + 1})` }"
          shadow="never"
        >
          <div class="stat-card-inner">
            <div class="stat-card-icon">
              <el-icon>
                <component :is="card.icon" />
              </el-icon>
            </div>

            <div class="stat-card-info">
              <div class="stat-value">{{ card.value }}</div>
              <div class="stat-label">{{ card.label }}</div>
            </div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <!-- الرسوم البيانية -->
    <el-row :gutter="16" style="margin-bottom: 20px">
      <el-col :xs="24" :md="12" style="margin-bottom: 12px">
        <el-card shadow="hover">
          <template #header>
            <span style="font-weight: 600">توزيع أنواع المصادر</span>
          </template>

          <v-chart :option="pieOption" style="height: 280px" autoresize />
        </el-card>
      </el-col>

      <el-col :xs="24" :md="12" style="margin-bottom: 12px">
        <el-card shadow="hover">
          <template #header>
            <span style="font-weight: 600">عدد الاتصالات حسب البروتوكول</span>
          </template>

          <v-chart :option="barOption" style="height: 280px" autoresize />
        </el-card>
      </el-col>
    </el-row>

    <!-- جدول المسارات النشطة -->
    <el-card shadow="hover">
      <template #header>
        <div style="display: flex; justify-content: space-between; align-items: center">
          <span style="font-weight: 600">المسارات النشطة</span>

          <div style="display: flex; gap: 8px">
            <el-button text type="primary" @click="$router.push('/paths')">
              عرض الكل
            </el-button>

            <el-button
              :icon="Refresh"
              circle
              size="small"
              @click="refreshData"
              :loading="systemStore.loading"
            />
          </div>
        </div>
      </template>

      <el-table
        :data="systemStore.paths.slice(0, 8)"
        v-loading="systemStore.loading"
        style="width: 100%"
      >
        <el-table-column
          prop="name"
          label="اسم المسار"
          min-width="150"
          show-overflow-tooltip
        />

        <el-table-column label="الحالة" width="90">
          <template #default="{ row }">
            <el-tag :type="row.online ? 'success' : 'info'" size="small">
              {{ row.online ? 'متصل' : 'غير متصل' }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column label="نوع المصدر" width="130">
          <template #default="{ row }">
            <span>{{ row.source ? formatSourceType(row.source.type) : '-' }}</span>
          </template>
        </el-table-column>

        <el-table-column label="القراء" width="90" align="center">
          <template #default="{ row }">
            {{ row.readers?.length || 0 }}
          </template>
        </el-table-column>

        <el-table-column label="البيانات الواردة" width="130">
          <template #default="{ row }">
            {{ formatBytes(row.inboundBytes || 0) }}
          </template>
        </el-table-column>

        <el-table-column label="البيانات الصادرة" width="130">
          <template #default="{ row }">
            {{ formatBytes(row.outboundBytes || 0) }}
          </template>
        </el-table-column>

        <el-table-column label="الإجراءات" width="100" fixed="right">
          <template #default="{ row }">
            <el-button
              text
              type="success"
              size="small"
              :disabled="!row.online"
              @click="openPlayer(row)"
            >
              تشغيل
            </el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!systemStore.loading && systemStore.paths.length === 0"
        description="لا توجد مسارات حالياً"
      />
    </el-card>

    <!-- نافذة المشغل -->
    <el-dialog
      v-model="playerVisible"
      :title="`تشغيل - ${playingPath}`"
      width="720px"
      destroy-on-close
      align-center
    >
      <StreamPlayer v-if="playerVisible" :pathName="playingPath" />
    </el-dialog>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useSystemStore } from '@/stores/system'
import { formatBytes, formatUptime, formatSourceType } from '@/composables/useFormatters'
import { Refresh, Connection, VideoPlay, Timer, UserFilled } from '@element-plus/icons-vue'
import StreamPlayer from '@/components/StreamPlayer.vue'
import type { APIPath } from '@/types/api'

const systemStore = useSystemStore()
const playerVisible = ref(false)
const playingPath = ref('')

const openPlayer = (row: APIPath) => {
  playingPath.value = row.name
  playerVisible.value = true
}

const statCards = computed(() => [
  {
    icon: Connection,
    label: 'إجمالي المسارات',
    value: systemStore.pathCount
  },
  {
    icon: VideoPlay,
    label: 'المسارات المتصلة',
    value: systemStore.onlinePaths.length
  },
  {
    icon: UserFilled,
    label: 'القراء',
    value: systemStore.totalReaders
  },
  {
    icon: Timer,
    label: 'مدة التشغيل',
    value: formatUptime(systemStore.info?.started)
  }
])

const pieOption = computed(() => {
  const dist = systemStore.sourceTypeDistribution

  const data = Object.entries(dist).map(([name, value]) => ({
    name: formatSourceType(name),
    value
  }))

  return {
    tooltip: {
      trigger: 'item',
      formatter: '{b}: {c} ({d}%)'
    },
    legend: {
      bottom: 0,
      textStyle: {
        color: 'var(--el-text-color-regular)'
      }
    },
    series: [
      {
        type: 'pie',
        radius: ['40%', '70%'],
        avoidLabelOverlap: false,
        label: {
          show: false
        },
        emphasis: {
          label: {
            show: true,
            fontSize: 14,
            fontWeight: 'bold'
          }
        },
        data: data.length > 0 ? data : [{ name: 'لا توجد بيانات', value: 0 }]
      }
    ]
  }
})

const barOption = computed(() => {
  const c = systemStore.protocolCounts

  return {
    tooltip: {
      trigger: 'axis'
    },
    grid: {
      left: 60,
      right: 20,
      top: 10,
      bottom: 30
    },
    xAxis: {
      type: 'category',
      data: [
        'اتصالات RTSP',
        'جلسات RTSP',
        'RTMP',
        'WebRTC',
        'HLS',
        'SRT'
      ],
      axisLabel: {
        color: 'var(--el-text-color-secondary)',
        fontSize: 11
      }
    },
    yAxis: {
      type: 'value',
      minInterval: 1,
      axisLabel: {
        color: 'var(--el-text-color-secondary)'
      }
    },
    series: [
      {
        type: 'bar',
        barWidth: '50%',
        itemStyle: {
          borderRadius: [4, 4, 0, 0],
          color: (params: any) => {
            const colors = [
              '#409eff',
              '#67c23a',
              '#e6a23c',
              '#f56c6c',
              '#909399',
              '#b37feb'
            ]

            return colors[params.dataIndex % colors.length]
          }
        },
        data: [
          c.rtspConns,
          c.rtspSessions,
          c.rtmpConns,
          c.webrtcSessions,
          c.hlsMuxers,
          c.srtConns
        ]
      }
    ]
  }
})

const refreshData = async () => {
  await systemStore.fetchAll()
}

onMounted(() => {
  refreshData()
})
</script>