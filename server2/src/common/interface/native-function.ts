type NativeFunctionRequest = {
  method: string; // issueToken | refreshToken
  params: any; // IssueTokenParams | RefreshTokenParams
};

type NativeFunctionResponse = {
  error: NativeError;
  result: any; // TokenResponse
};

type NativeError = {
  type: string;
  message: string;
};

// NativeFunctionRequest.Params
type IssueTokenParams = {
  secret: string;
  channelID: string;
};

// NativeFunctionRequest.Params
type RefreshTokenParams = {
  refreshToken: string;
};

// NativeFunctionResponse.Result
type TokenResponse = {
  accessToken: string;
  refreshToken: string;
};
