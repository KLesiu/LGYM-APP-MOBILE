import type { ReportSubmissionDto, SubmitReportRequestRequest } from '../api/generated/model';
import { postApiTraineeReportRequestsRequestIdSubmit } from '../api/generated/trainee-reporting/trainee-reporting';

jest.mock('../api/custom-instance', () => ({
  customInstance: jest.fn(),
}));

describe('training submission contract', () => {
  it('builds a POST request with JSON body for trainee report submission', async () => {
    const customInstance = jest.requireMock('../api/custom-instance').customInstance as jest.Mock;
    customInstance.mockResolvedValue({
      data: { _id: 'submission-1' } satisfies ReportSubmissionDto,
      status: 200,
      headers: new Headers(),
    });

    const payload: SubmitReportRequestRequest = { answers: { exercise: 'ok' } as never };

    await postApiTraineeReportRequestsRequestIdSubmit('request-1', payload);

    expect(customInstance).toHaveBeenCalledWith(
      '/api/trainee/report-requests/request-1/submit',
      expect.objectContaining({
        method: 'POST',
        headers: expect.objectContaining({ 'Content-Type': 'application/json' }),
        body: JSON.stringify(payload),
      }),
    );
  });
});
