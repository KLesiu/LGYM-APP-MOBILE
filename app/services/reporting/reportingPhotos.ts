import { customInstance } from "../../../api/custom-instance";

export interface InitiatePhotoUploadRequest {
  reportRequestId?: string | null;
  viewType?: string | null;
  mimeType?: string | null;
  sizeBytes?: number;
}

export interface InitiatePhotoUploadResponse {
  uploadUrl?: string | null;
  storageKey?: string | null;
  expiresAt?: string;
}

export interface CompletePhotoUploadRequest {
  storageKey?: string | null;
  mimeType?: string | null;
  sizeBytes?: number;
  checksum?: string | null;
  reportRequestId?: string | null;
  viewType?: string | null;
}

export interface CompletePhotoUploadResponse {
  photoId?: string | null;
  uploadedAt?: string;
}

export interface ReportingPhotoHistoryItem {
  _id?: string | null;
  storageKey?: string | null;
  viewType?: string | null;
  sizeBytes?: number;
  thumbnailUrl?: string | null;
  readUrl?: string | null;
  reportRequestId?: string | null;
  uploadedAt?: string;
}

interface GetPhotoHistoryResponse {
  photos?: ReportingPhotoHistoryItem[] | null;
}

interface ApiResponse<T> {
  data: T;
  status: number;
  headers: unknown;
}

export interface PreparedPhotoUploadFile {
  normalizedFileUri: string;
  fileBlob: Blob;
  sizeBytes: number;
}

const hasSupportedFileScheme = (value: string): boolean =>
  value.startsWith("file://") || value.startsWith("content://") || value.startsWith("ph://");

const isWindowsLikeAbsolutePath = (value: string): boolean => /^[a-zA-Z]:[\\/]/.test(value);

const normalizeLocalFileUri = (rawFileUri: string): string => {
  const trimmedFileUri = rawFileUri.trim();

  if (trimmedFileUri.length === 0) {
    return trimmedFileUri;
  }

  if (hasSupportedFileScheme(trimmedFileUri)) {
    return trimmedFileUri;
  }

  if (isWindowsLikeAbsolutePath(trimmedFileUri)) {
    return `file:///${trimmedFileUri.replace(/\\/g, "/")}`;
  }

  if (trimmedFileUri.startsWith("/")) {
    return `file://${trimmedFileUri}`;
  }

  return trimmedFileUri;
};

export const initiateTraineeReportingPhotoUpload = (
  data: InitiatePhotoUploadRequest
) => {
  return customInstance<ApiResponse<InitiatePhotoUploadResponse>>(
    "/api/trainee/reporting/photos/upload-init",
    {
      method: "POST",
      data,
    }
  );
};

export const completeTraineeReportingPhotoUpload = (
  data: CompletePhotoUploadRequest
) => {
  return customInstance<ApiResponse<CompletePhotoUploadResponse>>(
    "/api/trainee/reporting/photos/complete-upload",
    {
      method: "POST",
      data,
    }
  );
};

export const getTraineeReportingPhotoHistory = (requestId: string) => {
  const encodedRequestId = encodeURIComponent(requestId);

  return customInstance<ApiResponse<GetPhotoHistoryResponse>>(
    `/api/trainee/reporting/photos/history?requestId=${encodedRequestId}`,
    {
      method: "GET",
    }
  );
};

export const preparePhotoUploadFile = async (
  fileUri: string
): Promise<PreparedPhotoUploadFile> => {
  const normalizedFileUri = normalizeLocalFileUri(fileUri);

  console.log("[ReportPhotoUpload] Normalized file URI", {
    originalFileUri: fileUri,
    normalizedFileUri,
  });

  const fileResponse = await fetch(normalizedFileUri);
  const fileBlob = await fileResponse.blob();

  return {
    normalizedFileUri,
    fileBlob,
    sizeBytes: fileBlob.size,
  };
};

export const uploadPhotoToSignedUrl = async (
  uploadUrl: string,
  preparedFile: PreparedPhotoUploadFile,
  mimeType: string
): Promise<number> => {
  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": mimeType,
    },
    body: preparedFile.fileBlob,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Photo upload failed with status ${uploadResponse.status}`);
  }

  return preparedFile.sizeBytes;
};
