// app.service.ts
import { Injectable, OnModuleInit } from "@nestjs/common";
import axios from "axios";
import * as crypto from "crypto";

@Injectable()
export class AppService implements OnModuleInit {
  private channelTokenMap = new Map<string, [string, string, number]>();
  private readonly tutorialMsg = "This is a test message sent by a manager.";
  private readonly sendAsBotMsg = "This is a test message sent by a bot.";
  private readonly botName = "Bot";
  private readonly defaultWamArgs = ["rootMessageId", "broadcast", "isPrivate"];

  async onModuleInit() {
    await this.startServer();
  }

  async startServer() {
    const [accessToken, refreshToken, expiresAt] =
      await this.requestIssueToken();
    await this.registerCommand(accessToken);
    console.log("커맨드 등록됨!!!!!!!!!!");
  }

  async getChannelToken(channelId: string): Promise<[string, string]> {
    const channelToken = this.channelTokenMap.get(channelId);
    if (
      channelToken === undefined ||
      channelToken[2] < new Date().getTime() / 1000
    ) {
      const [accessToken, refreshToken, expiresAt] =
        await this.requestIssueToken(channelId);
      this.channelTokenMap.set(channelId, [
        accessToken,
        refreshToken,
        expiresAt,
      ]);
      return [accessToken, refreshToken];
    } else {
      return [channelToken[0], channelToken[1]];
    }
  }

  async requestIssueToken(
    channelId?: string
  ): Promise<[string, string, number]> {
    const body = {
      method: "issueToken",
      params: {
        secret: process.env.APP_SECRET,
        channelId: channelId,
      },
    };

    const headers = { "Content-Type": "application/json" };
    const response = await axios.put(process.env.APPSTORE_URL ?? "", body, {
      headers,
    });

    const accessToken = response.data.result.accessToken;
    const refreshToken = response.data.result.refreshToken;
    const expiresAt =
      new Date().getTime() / 1000 + response.data.result.expiresIn - 5;

    return [accessToken, refreshToken, expiresAt];
  }

  async registerCommand(accessToken: string) {
    const body = {
      method: "registerCommands",
      params: {
        appId: process.env.APP_ID,
        commands: [
          {
            name: "tutorial",
            scope: "desk",
            description: "This is a desk command of mafia",
            actionFunctionName: "tutorial",
            alfMode: "disable",
            enabledByDefault: true,
          },
        ],
      },
    };

    const headers = {
      "x-access-token": accessToken,
      "Content-Type": "application/json",
    };
    const response = await axios.put(process.env.APPSTORE_URL ?? "", body, {
      headers,
    });

    if (response.data.error) {
      throw new Error("register command error");
    }
  }

  async sendAsBot(
    channelId: string,
    groupId: string,
    broadcast: boolean,
    rootMessageId?: string
  ) {
    const body = {
      method: "writeGroupMessage",
      params: {
        channelId,
        groupId,
        rootMessageId,
        broadcast,
        dto: { plainText: this.sendAsBotMsg, botName: this.botName },
      },
    };

    const [accessToken] = await this.getChannelToken(channelId);
    const headers = {
      "x-access-token": accessToken,
      "Content-Type": "application/json",
    };

    const response = await axios.put(process.env.APPSTORE_URL ?? "", body, {
      headers,
    });
    if (response.data.error) {
      throw new Error("send as bot error");
    }
  }

  verification(x_signature: string, body: string): boolean {
    const key = crypto.createSecretKey(
      Buffer.from(process.env.SIGNING_KEY ?? "", "hex")
    );
    const mac = crypto.createHmac("sha256", key);
    mac.update(body, "utf8");
    return mac.digest("base64") === x_signature;
  }

  tutorial(wamName: string, callerId: string, params: any) {
    const wamArgs: { [key: string]: any } = {
      message: this.tutorialMsg,
      managerId: callerId,
    };

    if (params.trigger.attributes) {
      this.defaultWamArgs.forEach((k) => {
        if (params.trigger.attributes[k])
          wamArgs[k] = params.trigger.attributes[k];
      });
    }

    return {
      result: {
        type: "wam",
        attributes: {
          appId: process.env.APP_ID,
          name: wamName,
          wamArgs,
        },
      },
    };
  }
}
