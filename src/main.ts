import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import * as hbs from 'hbs'

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(
    AppModule,
  );

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