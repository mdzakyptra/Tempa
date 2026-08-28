// Mirror apps/backend/src/photos/dto/presigned-upload-response.dto.ts
export interface PresignedUploadResponse {
  uploadUrl: string
  key: string
  expiresIn: number
}

// Mirror apps/backend/src/photos/dto/report-photo-response.dto.ts
export interface ReportPhotoResponse {
  id: string
  report_id: string
  url_foto: string
}

// String union, bukan enum — tsconfig.app.json pakai erasableSyntaxOnly:true
export type UploadPhase = 'compressing' | 'uploading' | 'attaching'
export type FailedStep = 'compress' | 'presign' | 'upload' | 'attach'

export interface PhotoUploadProps {
  reportId: string
  onUploaded?: (photo: ReportPhotoResponse) => void
  maxFiles?: number
  className?: string
}
