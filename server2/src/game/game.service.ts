import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { GameStatus } from "src/common/enum/game-status-enum";
import {
  getChannelToken,
  getManagerInfo,
  getUserInfo,
  sendAsBot,
} from "src/common/utils/utils";
import { GameEntity } from "src/entity/game.entity";
import { PlayerService } from "src/player/player.service";
import { Repository } from "typeorm";

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly playerService: PlayerService
  ) {}
  private readonly createMafiaGameMsg = "마피아 게임을 시작합니다!";
  private readonly botName = "Mafia Bot";
  private readonly joinMsg = "가 참여했습니다!";

  async createMafiaGame(
    channelId: string,
    groupId: string,
    broadcast: boolean,
    chatId: string,
    callerId: string,
    rootMessageId?: string
  ) {
    const isAlreadyRunning = await this.gameRepository.find({
      where: { chatId: chatId, status: GameStatus.IN_PROGRESS },
    });

    if (isAlreadyRunning.length) {
      throw new Error("이미 게임 중입니다.");
    }

    const newGame = this.gameRepository.create({ chatId });
    await this.gameRepository.save(newGame);

    await this.playerService.createPlayer(callerId, newGame);

    await sendAsBot(
      channelId,
      groupId,
      broadcast,
      rootMessageId,
      this.createMafiaGameMsg,
      this.botName
    );

    try {
      const userInfo = await getUserInfo(channelId, callerId);
      console.log(userInfo);
    } catch (error) {
      const managerInfo = await getManagerInfo(channelId, callerId);
      console.log(managerInfo);
    }
  }

  async joinMafiaGame(
    channelId: string,
    groupId: string,
    broadcast: boolean,
    chatId: string,
    callerId: string,
    rootMessageId?: string
  ) {
    const game = await this.gameRepository.findOne({
      where: { chatId, status: GameStatus.NEW },
    });

    await this.playerService.createPlayer(callerId, game);

    await sendAsBot(
      channelId,
      groupId,
      broadcast,
      rootMessageId,
      `${callerId}${this.joinMsg}`,
      this.botName
    );
  }
}
