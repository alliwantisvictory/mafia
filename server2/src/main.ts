import { NestFactory } from "@nestjs/core";
import { AppModule } from "./app.module";
import { NestExpressApplication } from "@nestjs/platform-express";
import { join } from "path";

async function bootstrap() {
  // const app = await NestFactory.create(AppModule);
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {});

  app.useStaticAssets(join(__dirname, "../../wam/dist"), {
    prefix: "/resource/wam/wam_name", // 요청 경로
  });
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
