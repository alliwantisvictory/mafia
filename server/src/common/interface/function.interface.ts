// 기본 요청 인터페이스
interface FunctionRequest {
  method: string;
  params: Params;
  context: Context; // 앱스토어에서 자동으로 채워주는 값
}

interface Params {
  chat: Chat; // 앱스토어에서 자동으로 채워주는 값
  trigger: Trigger;
  inputs?: any; // inputs는 배열 혹은 객체일 수 있으므로 any 타입
}

interface Chat {
  type: 'group' | 'directChat' | 'userChat';
  id: string;
}

interface Trigger {
  type: string;
  attributes: Record<string, any>;
}

interface Context {
  channel: {
    id: number;
  };
  caller: {
    type: 'user' | 'manager' | 'app';
    id: number;
  };
}

// WAM 응답 인터페이스
interface WamResponse {
  type: 'wam';
  attributes: {
    appId: string;
    name: string;
    wamArgs: Record<string, any>;
  };
}

export class WanAttributes {
  appId: string;

  name: string;

  wamArgs: Record<string, any>;
}

// 일반 응답 인터페이스
interface GeneralResponse {
  result: {
    type: string;
    attributes: Record<string, any>;
  };
  error?: {
    type: string;
    message: string;
  };
}

export class GeneralFunctionResponse {
  result: {
    type: string;
    attributes: Record<string, any>;
  };
}
