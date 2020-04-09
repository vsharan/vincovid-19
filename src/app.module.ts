import { HandlebarsAdapter, MailerModule } from '@nestjs-modules/mailer';
import { HttpModule, Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ScheduleModule } from '@nestjs/schedule';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { SubscriptionSchema } from './schems/subscription.schema';
import { TasksService } from './task.service';
import { EmailService } from './email.service';
import { CovidService } from './covid.service';

@Module({
  imports: [
    ConfigModule.forRoot(),
    HttpModule.register({
      timeout: 5000,
      maxRedirects: 5,
    }),
    MongooseModule.forRoot(process.env.MONGO_URL, { useNewUrlParser: true, useUnifiedTopology: true }),
    MongooseModule.forFeature([{ name: 'Subscription', schema: SubscriptionSchema }]),
    ScheduleModule.forRoot(),
    MailerModule.forRoot({
      transport: {
        host: process.env.EMAIL_HOST,
        port: process.env.EMAIL_PORT,
        secure: true, // upgrade later with STARTTLS
        auth: {
          user: process.env.EMAIL_AUTH_USERNAME,
          pass: process.env.EMAIL_AUTH_PASSWORD,
        },
      },
      defaults: {
        from: process.env.EMAIL_DEFAULT_FROM,
      },
      template: {
        dir: process.cwd() + '/templates/',
        adapter: new HandlebarsAdapter(), // or new PugAdapter()
        options: {
          strict: true,
        },
      },
    }),
  ],
  controllers: [AppController],
  providers: [AppService, CovidService, EmailService, TasksService],
})

export class AppModule { }
