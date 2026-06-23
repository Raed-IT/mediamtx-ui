<template>
  <div>
    <div class="page-header">
      <h1>اتصالات RTSP <el-tag size="small" round>{{ store.itemCount }}</el-tag></h1>
      <div class="page-actions">
        <el-switch v-model="autoRefreshCtrl.active.value" active-text="تحديث تلقائي" @change="autoRefreshCtrl.toggle" />
        <el-button :icon="Refresh" @click="loadData" :loading="store.loading">تحديث</el-button>
      </div>
    </div>
    <el-card shadow="hover">
      <el-table :data="store.list" v-loading="store.loading" style="width: 100%">
        <el-table-column prop="id" label="ID" width="280" show-overflow-tooltip />
        <el-table-column label="العنوان البعيد" prop="remoteAddr" min-width="160" />
        <el-table-column label="النفق" prop="tunnel" width="100" />
        <el-table-column label="الوارد" width="110">
          <template #default="{ row }">{{ formatBytes(row.inboundBytes || 0) }}</template>
        </el-table-column>
        <el-table-column label="出站" width="110">
          <template #default="{ row }">{{ formatBytes(row.outboundBytes || 0) }}</template>
        </el-table-column>
        <el-table-column label="创建时间" width="170">
          <template #default="{ row }">{{ formatDate(row.created) }}</template>
        </el-table-column>
      </el-table>
      <el-empty v-if="!store.loading && store.list.length === 0" description="暂无 اتصالات RTSP" />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useRtspConnStore } from '@/stores/rtspConn'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { formatBytes, formatDate } from '@/composables/useFormatters'
import { Refresh } from '@element-plus/icons-vue'

const store = useRtspConnStore()
const loadData = () => store.fetchList()
const autoRefreshCtrl = useAutoRefresh(loadData)
onMounted(loadData)
</script>
