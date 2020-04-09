import { Controller, Get, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Post('/subscribe')
  subscribe(@Body() createSubscriptionDto: CreateSubscriptionDto): any {
    return this.appService.subscribe(createSubscriptionDto);
  }
}
