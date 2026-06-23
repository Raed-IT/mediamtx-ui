<template>
  <div>
    <div class="page-header">
      <h1>إعدادات النظام</h1>
      <div class="page-actions">
        <el-button :icon="Refresh" @click="refreshConfig">تحديث</el-button>
        <el-button type="primary" @click="saveConfig">حفظ الإعدادات</el-button>
      </div>
    </div>

    <el-card shadow="hover">
      <el-tabs v-model="activeTab" type="border-card">
        <!-- الإعدادات الأساسية -->
        <el-tab-pane label="الإعدادات الأساسية" name="general">
          <el-form :model="configStore.config" label-width="180px">
            <el-form-item label="مستوى السجل">
              <el-select v-model="configStore.config.logLevel" style="width: 100%">
                <el-option label="DEBUG" value="debug" />
                <el-option label="INFO" value="info" />
                <el-option label="WARN" value="warn" />
                <el-option label="ERROR" value="error" />
              </el-select>
            </el-form-item>

            <el-form-item label="ملف السجل">
              <el-input v-model="configStore.config.logFile" />
            </el-form-item>

            <el-form-item label="مهلة القراءة">
              <el-input v-model="configStore.config.readTimeout" />
            </el-form-item>

            <el-form-item label="مهلة الكتابة">
              <el-input v-model="configStore.config.writeTimeout" />
            </el-form-item>

            <el-form-item label="حجم قائمة انتظار الكتابة">
              <el-input-number
                v-model="configStore.config.writeQueueSize"
                :min="1"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="الحد الأقصى لحجم حمولة UDP">
              <el-input-number
                v-model="configStore.config.udpMaxPayloadSize"
                :min="1"
                style="width: 100%"
              />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- إعدادات المصادقة -->
        <el-tab-pane label="المصادقة" name="auth">
          <el-form :model="configStore.config" label-width="180px">
            <el-form-item label="طريقة المصادقة">
              <el-select v-model="configStore.config.authMethod" style="width: 100%">
                <el-option label="داخلي" value="internal" />
                <el-option label="HTTP" value="http" />
                <el-option label="JWT" value="jwt" />
              </el-select>
            </el-form-item>

            <el-form-item label="عنوان مصادقة HTTP">
              <el-input v-model="configStore.config.authHTTPAddress" />
            </el-form-item>

            <el-form-item label="JWT JWKS">
              <el-input v-model="configStore.config.authJWTJWKS" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- إعدادات RTSP -->
        <el-tab-pane label="RTSP" name="rtsp">
          <el-form :model="configStore.config" label-width="180px">
            <el-form-item label="تفعيل RTSP">
              <el-switch v-model="configStore.config.rtsp" />
            </el-form-item>

            <el-form-item label="عنوان RTSP">
              <el-input v-model="configStore.config.rtspAddress" />
            </el-form-item>

            <el-form-item label="عنوان RTSPS">
              <el-input v-model="configStore.config.rtspsAddress" />
            </el-form-item>

            <el-form-item label="تشفير RTSP">
              <el-select v-model="configStore.config.rtspEncryption" style="width: 100%">
                <el-option label="بدون" value="no" />
                <el-option label="اختياري" value="optional" />
                <el-option label="إجباري" value="strict" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- إعدادات RTMP -->
        <el-tab-pane label="RTMP" name="rtmp">
          <el-form :model="configStore.config" label-width="180px">
            <el-form-item label="تفعيل RTMP">
              <el-switch v-model="configStore.config.rtmp" />
            </el-form-item>

            <el-form-item label="عنوان RTMP">
              <el-input v-model="configStore.config.rtmpAddress" />
            </el-form-item>

            <el-form-item label="تشفير RTMP">
              <el-select v-model="configStore.config.rtmpEncryption" style="width: 100%">
                <el-option label="بدون" value="no" />
                <el-option label="اختياري" value="optional" />
                <el-option label="إجباري" value="strict" />
              </el-select>
            </el-form-item>

            <el-form-item label="عنوان RTMPS">
              <el-input v-model="configStore.config.rtmpsAddress" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- إعدادات HLS -->
        <el-tab-pane label="HLS" name="hls">
          <el-form :model="configStore.config" label-width="180px">
            <el-form-item label="تفعيل HLS">
              <el-switch v-model="configStore.config.hls" />
            </el-form-item>

            <el-form-item label="عنوان HLS">
              <el-input v-model="configStore.config.hlsAddress" />
            </el-form-item>

            <el-form-item label="نوع HLS">
              <el-select v-model="configStore.config.hlsVariant" style="width: 100%">
                <el-option label="MPEGTS" value="mpegts" />
                <el-option label="FMP4" value="fmp4" />
                <el-option label="زمن منخفض" value="lowLatency" />
              </el-select>
            </el-form-item>

            <el-form-item label="عدد مقاطع HLS">
              <el-input-number
                v-model="configStore.config.hlsSegmentCount"
                :min="1"
                style="width: 100%"
              />
            </el-form-item>

            <el-form-item label="مدة مقطع HLS">
              <el-input v-model="configStore.config.hlsSegmentDuration" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- إعدادات WebRTC -->
        <el-tab-pane label="WebRTC" name="webrtc">
          <el-form :model="configStore.config" label-width="180px">
            <el-form-item label="تفعيل WebRTC">
              <el-switch v-model="configStore.config.webrtc" />
            </el-form-item>

            <el-form-item label="عنوان WebRTC">
              <el-input v-model="configStore.config.webrtcAddress" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- إعدادات SRT -->
        <el-tab-pane label="SRT" name="srt">
          <el-form :model="configStore.config" label-width="180px">
            <el-form-item label="تفعيل SRT">
              <el-switch v-model="configStore.config.srt" />
            </el-form-item>

            <el-form-item label="عنوان SRT">
              <el-input v-model="configStore.config.srtAddress" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- إعدادات API -->
        <el-tab-pane label="API" name="api">
          <el-form :model="configStore.config" label-width="180px">
            <el-form-item label="تفعيل API">
              <el-switch v-model="configStore.config.api" />
            </el-form-item>

            <el-form-item label="عنوان API">
              <el-input v-model="configStore.config.apiAddress" />
            </el-form-item>

            <el-form-item label="تشفير API">
              <el-switch v-model="configStore.config.apiEncryption" />
            </el-form-item>
          </el-form>
        </el-tab-pane>

        <!-- إعدادات التسجيل -->
        <el-tab-pane label="التسجيل" name="record">
          <el-form :model="configStore.config" label-width="180px">
            <el-form-item label="تفعيل التسجيل">
              <el-switch v-model="configStore.config.record" />
            </el-form-item>

            <el-form-item label="مسار التسجيل">
              <el-input v-model="configStore.config.recordPath" />
            </el-form-item>

            <el-form-item label="صيغة التسجيل">
              <el-select v-model="configStore.config.recordFormat" style="width: 100%">
                <el-option label="FMP4" value="fmp4" />
                <el-option label="MPEGTS" value="mpegts" />
              </el-select>
            </el-form-item>
          </el-form>
        </el-tab-pane>
      </el-tabs>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useConfigStore } from '@/stores/config'
import { ElMessage } from 'element-plus'
import { Refresh } from '@element-plus/icons-vue'

const configStore = useConfigStore()
const activeTab = ref('general')

const refreshConfig = async () => {
  try {
    await configStore.fetchConfig()
    ElMessage.success('تم تحديث الإعدادات بنجاح')
  } catch {
    ElMessage.error('فشل تحديث الإعدادات')
  }
}

const saveConfig = async () => {
  try {
    await configStore.saveConfig(configStore.config)
    ElMessage.success('تم حفظ الإعدادات بنجاح')
  } catch {
    ElMessage.error('فشل حفظ الإعدادات')
  }
}

onMounted(refreshConfig)
</script>

<style scoped>
:deep(.el-tabs__content) {
  padding: 20px;
}
</style>