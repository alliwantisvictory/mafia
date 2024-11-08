// app.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";

import { registerCommand, requestIssueToken } from "./common/utils/utils";

@Injectable()
export class AppService implements OnModuleInit {
  async onModuleInit() {
    await this.startServer();
  }

  async startServer() {
    const [accessToken, refreshToken, expiresAt] = await requestIssueToken();
    await registerCommand(accessToken);
    console.log("커맨드 등록됨!!!!!!!!!!");
  }
}
