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

  hbs.registerHelper("gt", function(num1, num2){
    return num1 > num2
  })

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
