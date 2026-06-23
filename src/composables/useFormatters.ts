export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 بايت'
  const k = 1024
  const sizes = ['بايت', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

export function formatDate(dateStr: string | null | undefined): string {
  if (!dateStr) return '-'
  const d = new Date(dateStr)
  if (isNaN(d.getTime())) return '-'

  return d.toLocaleString('ar')
}

export function formatUptime(startedStr: string | null | undefined): string {
  if (!startedStr) return '-'

  const started = new Date(startedStr)
  if (isNaN(started.getTime())) return '-'

  const now = Date.now()
  const diff = Math.floor((now - started.getTime()) / 1000)

  if (diff < 60) {
    return `${diff} ثانية`
  }

  if (diff < 3600) {
    const m = Math.floor(diff / 60)
    const s = diff % 60
    return `${m} دقيقة ${s} ثانية`
  }

  if (diff < 86400) {
    const h = Math.floor(diff / 3600)
    const m = Math.floor((diff % 3600) / 60)
    return `${h} ساعة ${m} دقيقة`
  }

  const d = Math.floor(diff / 86400)
  const h = Math.floor((diff % 86400) / 3600)

  return `${d} يوم ${h} ساعة`
}

export function formatState(state: string): string {
  const map: Record<string, string> = {
    idle: 'خامل',
    read: 'قراءة',
    publish: 'بث'
  }

  return map[state] || state
}

export function formatSourceType(type: string): string {
  const map: Record<string, string> = {
    rtspSource: 'مصدر RTSP',
    rtspSession: 'جلسة RTSP',
    rtmpSource: 'مصدر RTMP',
    rtmpConn: 'اتصال RTMP',
    rtmpsConn: 'اتصال RTMPS',
    hlsSource: 'مصدر HLS',
    webRTCSession: 'جلسة WebRTC',
    webRTCSource: 'مصدر WebRTC',
    srtConn: 'اتصال SRT',
    srtSource: 'مصدر SRT',
    rtspsSession: 'جلسة RTSPS',
    rpiCameraSource: 'كاميرا Raspberry Pi',
    redirect: 'إعادة توجيه',
    mpegtsSource: 'مصدر MPEG-TS',
    rtpSource: 'مصدر RTP'
  }

  return map[type] || type
}