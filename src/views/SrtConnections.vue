<template>
  <div>
    <div class="page-header">
      <h1>
        اتصالات SRT
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
          prop="id"
          label="المعرّف"
          width="280"
          show-overflow-tooltip
        />

        <el-table-column label="الحالة" width="90">
          <template #default="{ row }">
            <el-tag
              :type="
                row.state === 'publish'
                  ? 'danger'
                  : row.state === 'read'
                  ? 'success'
                  : 'info'
              "
              size="small"
            >
              {{ formatState(row.state) }}
            </el-tag>
          </template>
        </el-table-column>

        <el-table-column
          prop="path"
          label="المسار"
          min-width="150"
          show-overflow-tooltip
        />

        <el-table-column
          prop="remoteAddr"
          label="العنوان البعيد"
          width="160"
        />

        <el-table-column
          label="الحزم المرسلة"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            {{ row.packetsSent || 0 }}
          </template>
        </el-table-column>

        <el-table-column
          label="الحزم المستلمة"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            {{ row.packetsReceived || 0 }}
          </template>
        </el-table-column>

        <el-table-column
          label="زمن الاستجابة (RTT)"
          width="120"
          align="center"
        >
          <template #default="{ row }">
            {{ row.msRTT?.toFixed(1) || '-' }} ms
          </template>
        </el-table-column>

        <el-table-column
          label="الإجراءات"
          width="90"
          fixed="right"
        >
          <template #default="{ row }">
            <el-popconfirm
              title="هل أنت متأكد من طرد هذا الاتصال؟"
              @confirm="handleKick(row.id)"
            >
              <template #reference>
                <el-button
                  text
                  type="danger"
                  size="small"
                >
                  طرد
                </el-button>
              </template>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>

      <el-empty
        v-if="!store.loading && store.list.length === 0"
        description="لا توجد اتصالات SRT"
      />
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useSrtConnStore } from '@/stores/srtConn'
import { useAutoRefresh } from '@/composables/useAutoRefresh'
import { formatState } from '@/composables/useFormatters'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const store = useSrtConnStore()

const loadData = () => store.fetchList()

const autoRefreshCtrl = useAutoRefresh(loadData)

const handleKick = async (id: string) => {
  try {
    await store.kick(id)
    ElMessage.success('تم طرد الاتصال بنجاح')
  } catch {
    ElMessage.error('فشل في طرد الاتصال')
  }
}

onMounted(loadData)
</script>