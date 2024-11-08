import * as crypto from "crypto";
import axios from "axios";

// 채널 토큰을 캐싱하기 위한 Map
const channelTokenMap = new Map<string, [string, string, number]>();

export async function getChannelToken(
  channelId: string
): Promise<[string, string]> {
  const channelToken = channelTokenMap.get(channelId);
  const currentTime = new Date().getTime() / 1000;

  if (!channelToken || channelToken[2] < currentTime) {
    const [accessToken, refreshToken, expiresAt] =
      await requestIssueToken(channelId);
    channelTokenMap.set(channelId, [accessToken, refreshToken, expiresAt]);
    return [accessToken, refreshToken];
  }

  return [channelToken[0], channelToken[1]];
}

// Token 발급 요청 함수
export async function requestIssueToken(
  channelId?: string
): Promise<[string, string, number]> {
  const body = {
    method: "issueToken",
    params: { secret: process.env.APP_SECRET, channelId },
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

// Command 등록 함수
export async function registerCommand(accessToken: string) {
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
        {
          name: "mafia",
          scope: "desk",
          description: "Let's start a mafia game",
          actionFunctionName: "mafia",
          alfMode: "disable",
          enableByDefault: true,
        },
        {
          name: "join",
          scope: "desk",
          description: "join a mafia game",
          actionFunctionName: "join",
          alfMode: "disable",
          enableByDefault: true,
        },
        {
          name: "role",
          scope: "desk",
          description: "join a mafia game",
          actionFunctionName: "role",
          alfMode: "disable",
          enableByDefault: true,
        },
        {
          name: "start",
          scope: "desk",
          description: "join a mafia game",
          actionFunctionName: "start",
          alfMode: "disable",
          enableByDefault: true,
        },
        {
          name: "vote",
          scope: "desk",
          description: "join a mafia game",
          actionFunctionName: "vote",
          alfMode: "disable",
          enableByDefault: true,
        },
        {
          name: "execute",
          scope: "desk",
          description: "join a mafia game",
          actionFunctionName: "execute",
          alfMode: "disable",
          enableByDefault: true,
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

// 메시지 전송 함수
export async function sendAsBot(
  channelId: string,
  groupId: string,
  broadcast: boolean,
  rootMessageId?: string,
  message?: string,
  botName?: string
) {
  const body = {
    method: "writeGroupMessage",
    params: {
      channelId,
      groupId,
      rootMessageId,
      broadcast,
      dto: { plainText: message ?? "봇이 만들었음", botName: botName ?? "bot" },
    },
  };

  console.log(body);

  const [accessToken] = await getChannelToken(channelId);
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

export async function getUserInfo(channelId: string, userId: string) {
  const body = {
    method: "getUser",
    params: {
      channelId,
      userId,
    },
  };

  const [accessToken] = await getChannelToken(channelId);
  const headers = {
    "x-access-token": accessToken,
    "Content-Type": "application/json",
  };

  const response = await axios.put(process.env.APPSTORE_URL ?? "", body, {
    headers,
  });

  if (response.data.error) {
    throw new Error("유저 정보 가져오는데 실패했습니다.");
  }

  return response.data.result;
}

export async function getManagerInfo(channelId: string, managerId: string) {
  const body = {
    method: "getManager",
    params: {
      channelId,
      managerId,
    },
  };

  console.log(body);

  const [accessToken] = await getChannelToken(channelId);
  const headers = {
    "x-access-token": accessToken,
    "Content-Type": "application/json",
  };

  const response = await axios.put(process.env.APPSTORE_URL ?? "", body, {
    headers,
  });

  if (response.data.error) {
    console.log(response.data.error);
    throw new Error("매니저 정보 가져오는데 실패했습니다.");
  }

  return response.data.result;
}

export function tutorial(wamName: string, callerId: string, params: any) {
  const wamArgs: { [key: string]: any } = {
    message: "튜토리얼 메시지입니다.",
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

// 서명 검증 함수
export function verification(x_signature: string, body: string): boolean {
  const key = crypto.createSecretKey(
    Buffer.from(process.env.SIGNING_KEY ?? "", "hex")
  );
  const mac = crypto.createHmac("sha256", key);
  mac.update(body, "utf8");
  return mac.digest("base64") === x_signature;
}

export function openWam(
  name: string,
  wamArgs: { [key: string]: any },
  params: any
) {
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
        name: "wam_name",
        wamArgs: {
          ...wamArgs,
          name: name,
        },
      },
    },
  };
}
