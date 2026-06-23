<template>
  <div>
    <div class="page-header">
      <h1>
        موزعات HLS
        <el-tag size="small" round>{{ store.itemCount }}</el-tag>
      </h1>

      <div class="page-actions">
        <el-switch
          v-model="autoRefreshCtrl.active.value"
          active-text="تحديث تلقائي"
          @change="autoRefreshCtrl.toggle"
        />

        <el-button
          :icon="Refresh"
          @click="loadData"
          :loading="store.loading"
        >
          تحديث
        </el-button>
      </div>
    </div>

    <el-card shadow="hover">
      <el-table
        :data="store.list"
        v-loading="store.loading"
        style="width: 100%"
      >
        <el-table-column
          prop="path"
          label="المسار"
          min-width="200"
          show-overflow-tooltip
        />

        <el-table-column label="البيانات الصادرة" width="120">
          <template #default="{ row }">
            {{ formatBytes(row.outboundBytes || 0) }}
          </template>
        </el-table-column>

        <el-table-column
          label="الإطارات المفقودة"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            {{ row.outboundFramesDiscarded || 0 }}
          </template>
        </el-table-column>

        <el-table-column label="وقت الإنشاء" width="180">
          <template #default="{ row }">
            {{ formatDate(row.created) }}
          </template>
        </el-table-column>

        <el-table-column label="آخر طلب" width="180">
          <template #default="{ row }">
            {{ formatDate(row.lastRequest) }}
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!store.loading && store.list.length === 0"
        description="لا توجد موزعات HLS"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useHlsMuxerStore } from '@/stores/hlsMuxer'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { formatBytes, formatDate } from '@/composables/useFormatters'
import { Refresh } from '@element-plus/icons-vue'

const store = useHlsMuxerStore()

const loadData = () => store.fetchList()

const autoRefreshCtrl = useAutoRefresh(loadData)

onMounted(loadData)
</script>