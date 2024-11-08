// app.controller.ts
import {
  Controller,
  Put,
  Body,
  Headers,
  HttpStatus,
  Res,
  Get,
} from "@nestjs/common";
import { AppService } from "./app.service";
import { Response } from "express";
import { GameService } from "./game/game.service";
import { PlayerService } from "./player/player.service";
import { sendAsBot, tutorial, verification } from "./common/utils/utils";

@Controller()
export class AppController {
  constructor(
    private readonly gameService: GameService,
    private readonly playerService: PlayerService
  ) {}

  @Get()
  async getHello() {
    return "hello!";
  }

  @Put("/functions")
  async handleFunction(
    @Body() body: any,
    @Headers("x-signature") signature: string,
    @Res() res: Response
  ) {
    if (!signature || !verification(signature, JSON.stringify(body))) {
      return res.status(HttpStatus.UNAUTHORIZED).send("Unauthorized");
    }

    const { method, context, params } = body;
    const { caller, channel } = context;

    console.log(body);
    console.log(context);

    switch (method) {
      case "tutorial":
        return res.json(tutorial("wam_name", caller.id, params));
      case "sendAsBot":
        await sendAsBot(
          channel.id,
          params.input.groupId,
          params.input.broadcast,
          params.input.rootMessageId
        );
      case "mafia":
        await this.gameService.createMafiaGame(
          context.channel.id,
          params.chat.id,
          false,
          context.caller.id,
          params.input.rootMessageId
        );
        return res.json({ result: {} });
      case "role":
        return res.json(this.playerService.showJob(context.caller.id, params));
      default:
        return res.status(HttpStatus.BAD_REQUEST).send("Unknown method");
    }
  }
}
