import { ExceptionBadRequest } from './exceptionBadRequest';

describe('exceptionBadRequest', () => {
  it('when call exception should return response', () => {
    try {
      throw new ExceptionBadRequest(100);
    } catch (e) {
      expect(100).toEqual(Number(e.response));
    }
  });
});
