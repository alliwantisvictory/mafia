import { PlayerService } from "src/player/player.service";
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
import {
  openWam,
  sendAsBot,
  tutorial,
  verification,
} from "./common/utils/utils";

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

    console.log("body!!!", body);
    console.log("context!!!", context);

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
          params.chat.id,
          context.caller.id,
          params.input.rootMessageId
        );
      case "join":
        await this.gameService.joinMafiaGame(
          context.channel.id,
          params.chat.id,
          false,
          params.chat.id,
          context.caller.id,
          params.input.rootMessageId
        );
        return res.json({ result: {} });
      case "role":
        const role = await this.playerService.getJob(context.caller.id);
        return res.json(openWam("ROLE", {role: role}, params));
      case "start":
        await this.gameService.startGame(
          context.channel.id,
          params.chat.id,
          false,
          params.chat.id,
          context.caller.id,
          params.input.rootMessageId
        );
        break;
      case "vote":
        const { phase, players } = await this.gameService.getPlayers(
          params.chat.id
        );
        return res.json(openWam(phase, { players }, params));
      case "civilianVote":
        await this.gameService.civilianVote(
          params.chat.id,
          context.caller.id,
          params.input.vote
        );
        break;
      case "deathVote":
        await this.gameService.deathVote(
          params.chat.id,
          context.caller.id,
          params.input.deathVote
        );
        break;
      default:
        return res.status(HttpStatus.BAD_REQUEST).send("Unknown method");
    }
  }
}
