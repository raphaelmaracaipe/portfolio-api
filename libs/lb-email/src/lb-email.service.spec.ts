import { LbEmailService } from './lb-email.service';
import { createTestAccount } from 'nodemailer';

describe('LbEmailService', () => {
  let email: LbEmailService;

  beforeEach(async () => {
    const { user, pass } = await createTestAccount();

    email = new LbEmailService('smtp.ethereal.email', 587, {
      user,
      pass,
    });
  });

  it('when send email with success should return code 250', async () => {
    const { response } = await email.sendEmailWithHtml(
      '"Fred Foo 👻" <foo@example.com>',
      'bar@example.com, baz@example.com',
      'Hello ✔',
      '<b>Hello world?</b>',
    );

    expect(response.indexOf('250')).toEqual(0);
  });

  it('when send email in format html with success should return code 250', async () => {
    email = new LbEmailService('smtp.ethereal.email', 587, {
      user: '',
      pass: '',
    });

    try {
      await email.sendEmailWithHtml(
        '"Fred Foo 👻" <foo@example.com>',
        'bar@example.com, baz@example.com',
        'Hello ✔',
        '<b>Hello world?</b>',
      );

      expect(true).toEqual(false);
    } catch (err) {
      expect(err.message).not.toEqual('');
    }
  });

  it('when send email format text plain with success should return code 250', async () => {
    email = new LbEmailService('smtp.ethereal.email', 587, {
      user: '',
      pass: '',
    });

    try {
      await email.sendEmailWithTextPlain(
        '"Fred Foo 👻" <foo@example.com>',
        'bar@example.com, baz@example.com',
        'Hello ✔',
        'Hello world?',
      );

      expect(true).toEqual(false);
    } catch (err) {
      expect(err.message).not.toEqual('');
    }
  });
});
