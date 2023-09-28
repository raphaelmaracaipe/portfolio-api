import { Injectable } from '@nestjs/common';
import { Transporter, createTransport } from 'nodemailer';
import SMTPTransport from 'nodemailer/lib/smtp-transport';

@Injectable()
export class LbEmailService {
  private transporter: Transporter<SMTPTransport.SentMessageInfo>;

  constructor(
    host: string,
    port: number,
    auth: { user: string; pass: string },
    secure = false,
  ) {
    this.transporter = createTransport({
      host,
      port,
      auth,
      secure,
    });
  }

  sendEmailWithTextPlain = async (
    from: string,
    to: string,
    subject: string,
    text: string,
  ) => await this.send(from, to, subject, text);

  sendEmailWithHtml = async (
    from: string,
    to: string,
    subject: string,
    html: string,
  ) => await this.send(from, to, subject, html);

  private async send(
    from: string,
    to: string,
    subject: string,
    text?: string,
    html?: string,
  ) {
    const returnOfSendEmail = await this.transporter.sendMail({
      from,
      to,
      subject,
      text,
      html,
    });
    await this.transporter.close();
    return returnOfSendEmail;
  }
}
