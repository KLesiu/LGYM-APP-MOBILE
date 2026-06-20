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

export const uploadPhotoToSignedUrl = async (
  uploadUrl: string,
  fileUri: string,
  mimeType: string
): Promise<number> => {
  const fileResponse = await fetch(fileUri);
  const fileBlob = await fileResponse.blob();

  const uploadResponse = await fetch(uploadUrl, {
    method: "PUT",
    headers: {
      "Content-Type": mimeType,
    },
    body: fileBlob,
  });

  if (!uploadResponse.ok) {
    throw new Error(`Photo upload failed with status ${uploadResponse.status}`);
  }

  return fileBlob.size;
};
