import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs'
import * as dayjs from 'dayjs';
import * as cookieParser from 'cookie-parser';
import { locals } from './locals.middleware';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

  hbs.registerHelper("fromNow", function(utc){
    let now = dayjs()
    let date = dayjs(utc)
    if(now.diff(date, 'second') < 60) return `${now.diff(date, 'second')} seconds ago`
    if(now.diff(date, 'minute') < 60) return `${now.diff(date, 'minute')} minutes ago`
    if(now.diff(date, 'hour') < 24) return `${now.diff(date, 'hour')} hours ago`
    if(now.diff(date, 'day') < 31) return `${now.diff(date, 'day')} days ago`
  })

  hbs.registerHelper("gt", function(num1, num2){
    return num1 > num2
  })

  hbs.registerHelper("gte", function(num1, num2){
    return num1 >= num2
  })

  hbs.registerHelper("equals", function(arg1, arg2){
    return arg1 == arg2
  })

  hbs.registerHelper('ifNotEquals', function(arg1, arg2, options) {
    return (arg1 != arg2) ? options.fn(this) : options.inverse(this);
});

  hbs.registerHelper("capFirstChar", function(string: string){
    let splitted = string.split(' ')
    for(let i=0; i<splitted.length; i++){
      splitted[i] = splitted[i].charAt(0).toUpperCase() + splitted[i].slice(1)
    }
    return splitted.join(' ')
  })

  hbs.registerHelper("formatDate", function(utcFormat: Date, format: string){
    return dayjs(utcFormat).format(format)
  })

  require("./helpers").register(hbs.handlebars);

  app.use(cookieParser());
  app.use(locals)
  app.useStaticAssets(join(__dirname, '..', 'public'));
  app.setBaseViewsDir(join(__dirname, '..', 'views'));
  hbs.registerPartials(join(__dirname, '..', '/views/partials'));
  hbs.registerPartials(join(__dirname, '..', '/views/layouts'));
  app.setViewEngine('hbs');

  const port = 3000;
  await app.listen(port, () => {
    console.log(`\nServer is running on localhost:${port}`)
  });
}
bootstrap();
