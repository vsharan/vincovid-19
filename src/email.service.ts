import { MailerService } from "@nestjs-modules/mailer";
import { Injectable, Logger } from "@nestjs/common";
import { SendEmailDto } from "./dto/send-email.dto";

@Injectable()
export class EmailService {

    private readonly logger = new Logger(EmailService.name);

    constructor(private readonly mailerService: MailerService) { }

    async sendEmail({ to, from, subject, text, html }: SendEmailDto): Promise<void> {
        try {
            await this
                .mailerService
                .sendMail({
                    to, // list of receivers
                    from: from || process.env.EMAIL_DEFAULT_FROM, // sender address
                    subject: subject || 'Testing Nest MailerModule ✔', // Subject line
                    html: html || '<b>welcome</b>', // HTML body content
                });
            this.logger.debug('Message sent');
        } catch (err) {
            this.logger.error('Failed to send email', err);
        }

    }
}