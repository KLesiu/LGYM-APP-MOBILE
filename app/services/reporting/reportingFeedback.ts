import { customInstance } from '../../../api/custom-instance';
import type { ReportSubmissionDto, ResponseMessageDto } from '../../../api/generated/model';

export type ReportSubmissionFeedbackStateDto = ReportSubmissionDto & {
  trainerFeedbackAddedAt?: string | null;
  trainerFeedbackReadAt?: string | null;
};

type ApiEnvelope<TData> = {
  data: TData;
  status: number;
  headers: unknown;
};

export const markReportSubmissionFeedbackRead = async (submissionId: string) => {
  return customInstance<ApiEnvelope<ReportSubmissionFeedbackStateDto | ResponseMessageDto>>(
    `/api/trainee/report-submissions/${submissionId}/mark-feedback-read`,
    {
      method: 'POST',
    }
  );
};
