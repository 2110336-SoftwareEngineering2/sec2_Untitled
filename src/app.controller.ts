import { Controller, Get, Req, Response } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) { }

  @Get()
  renderIndex(@Response() res, @Req() req): any {
    console.log(req.user)
    res.render('index')
  }

  @Get('/dummy')
  renderDummy(@Response() res): any {
    console.log("yay")
    res.render('dummy')
  }


}
