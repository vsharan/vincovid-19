import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Subscription } from './interfaces/subscription.interface';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Injectable()
export class AppService {

  constructor(@InjectModel('Subscription') private readonly subscriptionModel: Model<Subscription>) { }

  getHello(): string {
    return 'Hello World!';
  }

  async subscribe(createSubscribeDto: CreateSubscriptionDto): Promise<any> {
    //Keep the subscriber into DB to notify covid-19 updates every morning.
    let email = createSubscribeDto.email;
    email = email.trim().toLowerCase();
    const subscriptionData = await this.subscriptionModel.findOne({ email }).exec();
    if (subscriptionData) {
      return { message: 'User already subscribed' };
    }
    const createdEntry = new this.subscriptionModel(createSubscribeDto);
    await createdEntry.save();
    return { message: 'User subscribed successfully' };
  }
}
