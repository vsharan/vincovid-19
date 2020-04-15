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
    sendEmailDto.subject = `Daily updates for COVID-19 Cases ${new Date().toDateString()}`;
    const totalOfStateWise = covidData.statewise.shift();
    covidData.statewise.push(totalOfStateWise);

  sendEmailDto.html = `<!doctype html>
  <html lang="en">
  <head>
      <!-- Required meta tags -->
      <meta charset="utf-8">
      <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">

      <!-- Bootstrap CSS -->
      <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/css/bootstrap.min.css" integrity="sha384-GJzZqFGwb1QTTN6wy59ffF1BuGJpLSa9DkKMp0DgiMDm4iYMj70gZWKYbI706tWS" crossorigin="anonymous">
          <style> 

          .btn-box {
              margin-left: 124px;
              margin-top: 30px;
              margin-bottom: 15px;
          }

          .btn-box .btn-simple {
              color: #4d6575;
              background: rgba(0,0,0,0);
              border: 1px solid #b2c2cd;
          border-radius:50px;
          padding:8px 30px;
          }

          .estimate-main {
              width: 860px;
              margin: 0 auto;
              box-shadow: 0 2px 8px rgba(0,0,0,0.2);               
          }

          .estimate-header{
              border-bottom: 1px solid #ececec;
              padding:30px 50px;
          }

          .estimate-header h1{
              text-transform:uppercase
          }

          .estimate-header span{
              display: block
          }
          .text-bold
          {
              font-weight:600;
          }       
          

              .estimate-info {
              padding: 30px 50px;
              }

          .info-lft{  
                  width: 60%;
                  display: inline-block;
                  vertical-align: top;
          }

              .info-lft span {
              display: block;
          }

          .info-rigt .table tbody tr td {
                  padding: 5px;
              }

              .info-rigt .table tbody tr td:last-child {
          text-align: left;
          }

          .info-lft .text-light {
              color: #8C959A !important;
          }

              .info-rigt {
                  
              display: inline-block;
              width:39%;
              }


              .estimate-total {
                  text-align: right;
                  width: 268px;
                  float: right;
              }

              .total div:first-child, .G-total div:first-child {   
                  display: inline-block;
                  padding: 15px;
              }

              .total{ 
                  border-bottom:2px solid #ececec;
              }

              .total div .G-total .amount {
                      display: inline-block;
                  }

              .estimate-total {
                  text-align: right;
                  width: 268px;
                  float: right;
                  padding-right: 50px;
              }

              .gry-bg {
                      background: #f4f5f5;
                  }


              .estimate-detail-table .table .thead-dark th
              .estimate-detail-table .table tbody td {
                      padding-left: 30px;
                  }


              .estimate-detail-table .table .thead-dark
              .estimate-detail-table .table tbody td:last-child {
                      text-align: right;
                      padding-right: 50px;
              }

              .estimate-detail-table .table .thead-dark th:nth-child(2)
              .estimate-detail-table .table tbody td:nth-child(2) {
                          text-align: center;
              }

              .estimate-detail-table .table .thead-dark th:nth-child(3)
              .estimate-detail-table .table tbody td:nth-child(3) {
                          text-align: center;
              }

              .template-footer{
                  margin: 0 30px 15px 30px;
                  text-align: center;
                  line-height: 16px;
                  position: absolute;
                  left: 0;
                  right: 0;
                  bottom: 0;
                  white-space: pre-wrap;
              }

              .text-fine-print{
                  font-size: 13px;
                  color: #687578;
              }

              .text-strong{
                  font-size: 13px;
                  font-weight: 600;
              }

              .template-memo{
                  margin: 0 0 35px 0;
                  word-wrap: break-word;
              }

          </style>
      <title>Estimate</title>
  </head>
  <body>

      <section class="main-wrapper">           
      <div class="container">         
          <div class="estimate-main">               
              <div class="estimate-header text-right">
                      <h1> INDIA COVID-19 TRACKER </h1>
                      <span> Built by : Vinayak Sharan </span>
                      <span class="text-bold"> With Love, For : BioFourmis India </span>
                      <span> </span>
              </div>
              <div class="estimate-body">
                  <div class="estimate-info"> 
                          <div class="info-rigt text-right"> 
                                  <table class="table table-borderless">
                                          <tbody>
                                          <tr class="gry-bg">
                                          <td class="wv-table__cell">
                                          <span class="wv-text--strong">
                                            Number of new cases in India yesterday : ${newCases}
                                          </span>
                                          </td>
                                          <td class="wv-table__cell">
                                              <span class="wv-text--strong">
                                                Total number of cases : ${totalCases} 
                                              </span>
                                          </td>
                                          </tr>
                                      </tbody></table>
                          </div>
                  </div>
                  <div class="estimate-detail-table clearfix"> 
                      <table class="table table-hover">
                                  <thead class="thead-dark"> 
                                      <tr>
                                          <th> STATE/UT </th>
                                          <th> CNFMD </th>
                                          <th> ACTV </th>
                                          <th> RCVRD </th>
                                          <th> DCSD </th>
                                      </tr>
                                  </thead>
                                  <tbody>
                                      ${covidData.statewise.map(o=> {
                                          return(`<tr>
                                              <td>
                                                  ${o.state}
                                              </td>
                                              <td>${o.confirmed}</td>
                                              <td> <span> </span> <span> ${o.active}</span> </td>
                                              <td> <span> </span> <span> ${o.recovered} </span> </td>
                                              <td> <span> </span> <span> ${o.deaths} </span> </td>
                                          </tr>`)
                                      })
                                      }
                                  </tbody>
                      </table>
                  </div>
              </div>
          </div>
      </div>
      </section>
      
      

      <!-- Optional JavaScript -->
      <!-- jQuery first, then Popper.js, then Bootstrap JS -->
      <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
      <script src="https://cdnjs.cloudflare.com/ajax/libs/popper.js/1.14.6/umd/popper.min.js" integrity="sha384-wHAiFfRlMFy6i5SRaxvfOCifBUQy1xHdJ/yoi7FRNXMRBu5WHdZYu1hA6ZOblgut" crossorigin="anonymous"></script>
      <script src="https://stackpath.bootstrapcdn.com/bootstrap/4.2.1/js/bootstrap.min.js" integrity="sha384-B0UglyR+jN6CkvvICOB2joaf5I4l3gm9GU6Hc1og6Ls7i6U/mkkaduKaBhlAXv9k" crossorigin="anonymous"></script>
  </body>
  </html>`;
    this.emailService.sendEmail(sendEmailDto);
  }
}