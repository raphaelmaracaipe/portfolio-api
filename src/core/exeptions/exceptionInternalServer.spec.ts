import { ExceptionInternalServer } from './exceptionInternalServer';

describe('exceptionBadRequest', () => {
  it('when call exception should return response', () => {
    try {
      throw new ExceptionInternalServer(120);
    } catch (e) {
      
      expect(120).toEqual(Number(e.response));
    }
  });
});
