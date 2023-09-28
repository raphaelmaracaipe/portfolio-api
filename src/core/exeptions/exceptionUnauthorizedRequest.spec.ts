import { ExceptionUnathorizedRequest } from './exceptionUnauthorizedRequest';

describe('exceptionUnauthorizedRequest', () => {
  it('when call exception should return response', () => {
    try {
      throw new ExceptionUnathorizedRequest(123);
    } catch (e) {
      expect(123).toEqual(Number(e.response));
    }
  });
});
