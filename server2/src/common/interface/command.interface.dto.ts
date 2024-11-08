interface Command {
  name: string;
  scope: string;
  description: string;
  actionFunctionName: string;
  alfMode: string;
  enabledByDefault: boolean;
}

interface RegisterCommandsParam {
  appId: string;
  commands: Command[];
}
