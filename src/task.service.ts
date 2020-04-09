import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Cron, CronExpression } from '@nestjs/schedule';
import { Model } from 'mongoose';
import { SendEmailDto } from './dto/send-email.dto';
import { EmailService } from './email.service';
import { Subscription } from './interfaces/subscription.interface';
import { CovidService } from './covid.service';

@Injectable()
export class TasksService {
  private readonly logger = new Logger(TasksService.name);

  constructor(@InjectModel('Subscription') private readonly subscriptionModel: Model<Subscription>,
    private readonly emailService: EmailService,
    private readonly covidService: CovidService) { }

  //EVERY_DAY_AT_6AM
  @Cron(CronExpression.EVERY_DAY_AT_6AM)
  async handleCron() {
    this.logger.debug('Called every day at 6 AM');
    //Fetch subscribed users from DB and send email
    const subscribedUsers = await this.subscriptionModel.find({}, 'email').exec();
    //Send email
    const to = subscribedUsers.map(user => { return user.email });
    let sendEmailDto = new SendEmailDto();
    sendEmailDto.to = to.join(',');
    const covidData = await this.covidService.getCovidData();
    const cases = covidData.cases_time_series.pop();
    const newCases = cases.dailyconfirmed;
    const totalCases = cases.totalconfirmed;
    sendEmailDto.subject = `Daily updates for COVID-19 Cases ${new Date()}`;
    sendEmailDto.html = `> Number of new cases in India yesterday : ${newCases}
                         > Total number of cases : ${totalCases}
                         > State wise breakup ${JSON.stringify(covidData.statewise)}`;
    this.emailService.sendEmail(sendEmailDto);
  }
}