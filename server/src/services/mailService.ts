import nodemailer from 'nodemailer';

class MailService {
  transporter: nodemailer.Transporter;
  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT) || 0,
      secure: process.env.NODE_ENV !== 'development',
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASSWORD,
      },
    });
  }

  async sendActivaionLink(to: string, link: string): Promise<void> {
    await this.transporter.sendMail({
      from: process.env.SMTP_USER,
      to,
      subject: 'Активация аккаунта ' + process.env.API_URL,
      text: '',
      html: `<div><h1>Для активации перейдите по ссылке</h1><a href="${link}">${link}<a/></div>`,
    });
  }
}

export default new MailService();
