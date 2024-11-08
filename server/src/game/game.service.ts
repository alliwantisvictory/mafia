import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import axios from "axios";
import { GamePhase } from "src/common/enum/game-phase-enum";
import { GameStatus } from "src/common/enum/game-status-enum";
import { getChannelToken, sendAsBot } from "src/common/utils/utils";
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
  private readonly createMafiaGameMsg = "마피아 게임을 생성합니다!";
  private readonly startMafiaGameMsg =
    "마피아 게임을 시작합니다! /job을 통해 자신의 역할을 확인하세요.";
  private readonly dayMafiaGameMsg =
    "낮이 되었습니다. 자유롭게 이야기하며 마피아를 찾아보세요.";
  private readonly nightMafiaGameMsg = "밤이 되었습니다.";
  private readonly voteMafiaGameMsg =
    "투표를 진행합니다. /vote를 통해 마피아로 의심되는 사람을 지목해주세요.";
  private readonly closeStatementMafiaGameMsg =
    "님이 마피아로 지목되었습니다. 20초간 최종 변론을 해주세요.";
  private readonly finalVoteMafiaGameMsg =
    "지금부터 20초 간 최종 투표를 진행합니다.";
  private readonly deathMsg = "님이 처형되었습니다.";
  private readonly liveMsg = "님이 생존하였습니다.";
  private readonly botName = "Mafia Bot";

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
  }

  async startGame(
    channelId: string,
    groupId: string,
    broadcast: boolean,
    chatId: string,
    callerId: string,
    rootMessageId?: string
  ) {
    const readyGame = await this.gameRepository.findOne({
      where: { chatId: chatId, status: GameStatus.NEW },
    });

    if (!readyGame) {
      throw new Error("게임 준비가 되지 않았습니다.");
    } else if (readyGame.players.length < 6) {
      throw new Error(
        `아직 참가자가 부족합니다. (현재 참가자 수: ${readyGame.players.length}명)`
      );
    }

    // 역할 확인
    await this.gameRepository.update(readyGame.id, {
      status: GameStatus.IN_PROGRESS,
      phase: GamePhase.CONFIRM,
    });
    await sendAsBot(
      channelId,
      groupId,
      broadcast,
      rootMessageId,
      this.startMafiaGameMsg,
      this.botName
    );
    await new Promise((resolve) => setTimeout(resolve, 10000)); // 10초 대기

    // 낮
    await this.gameRepository.update(readyGame.id, {
      phase: GamePhase.DAY,
    });
    await sendAsBot(
      channelId,
      groupId,
      broadcast,
      rootMessageId,
      this.dayMafiaGameMsg,
      this.botName
    );
    await new Promise((resolve) => setTimeout(resolve, 60000)); // 60초 대기

    // 투표
    await this.gameRepository.update(readyGame.id, {
      phase: GamePhase.VOTE,
    });
    await sendAsBot(
      channelId,
      groupId,
      broadcast,
      rootMessageId,
      this.voteMafiaGameMsg,
      this.botName
    );
    await new Promise((resolve) => setTimeout(resolve, 20000)); // 20초 대기

    // 최종 변론
    const votes = readyGame.players.map((player) => player.vote);
    const voteCounts = votes.reduce((acc, vote) => {
      acc[vote] = (acc[vote] || 0) + 1;
      return acc;
    }, {});
    const maxVote = Object.entries(voteCounts).reduce((a, b) =>
      a[1] > b[1] ? a : b
    )[0];
    const targetId = readyGame.players.find(
      (player) => player.callerId === maxVote
    ).callerId;

    await sendAsBot(
      channelId,
      groupId,
      broadcast,
      rootMessageId,
      `${targetId} ${this.closeStatementMafiaGameMsg}`,
      this.botName
    );
    await new Promise((resolve) => setTimeout(resolve, 20000)); // 20초 대기

    // 최종 투표
    await this.gameRepository.update(readyGame.id, {
      phase: GamePhase.CLOSE_STATEMENT,
    });
    await sendAsBot(
      channelId,
      groupId,
      broadcast,
      rootMessageId,
      this.finalVoteMafiaGameMsg,
      this.botName
    );
    await new Promise((resolve) => setTimeout(resolve, 20000)); // 20초 대기

    // 최종 투표 결과
    const deathVotes = readyGame.players.map((player) => player.deathVote);
    const deathVoteCount = deathVotes.filter((vote) => vote === true).length;
    const alivePlayers = readyGame.players.filter(
      (player) => player.isAlive
    ).length;
    if (deathVoteCount > alivePlayers / 2) {
      // 처형
      this.playerService.kill(targetId);
      await sendAsBot(
        channelId,
        groupId,
        broadcast,
        rootMessageId,
        this.deathMsg,
        this.botName
      );
    } else {
      // 생존
      await sendAsBot(
        channelId,
        groupId,
        broadcast,
        rootMessageId,
        this.liveMsg,
        this.botName
      );
    }
  }

  async getPlayers(chatId: string) {
    const game = await this.gameRepository.findOne({
      where: { chatId: chatId, status: GameStatus.IN_PROGRESS },
    });

    if (!game) {
      throw new Error("게임이 진행 중이지 않습니다.");
    }

    let phase = "";
    if (game.phase === GamePhase.VOTE) {
      phase = "CIVILIAN_VOTE";
    } else if (game.phase === GamePhase.CLOSE_STATEMENT) {
      phase = "DEATH_VOTE";
    } else {
      throw new Error("현재 투표를 할 수 없는 상태입니다.");
    }

    return { players: game.players, phase };
  }

  async civilianVote(chatId: string, userId: string, vote: string) {
    const game = await this.gameRepository.findOne({
      where: { chatId: chatId, phase: GamePhase.VOTE },
      relations: ["players"],
    });
    if (!game) {
      throw new Error("현재 투표 중이지 않습니다.");
    }

    const player = game.players.find((player) => player.callerId === userId);
    if (!player) {
      throw new Error("플레이어를 찾을 수 없습니다.");
    }

    await this.playerService.vote(player.id, vote);
  }

  async deathVote(chatId: string, userId: string, deathVote: boolean) {
    const game = await this.gameRepository.findOne({
      where: { chatId: chatId, phase: GamePhase.CLOSE_STATEMENT },
      relations: ["players"],
    });
    if (!game) {
      throw new Error("현재 투표 중이지 않습니다.");
    }

    const player = game.players.find((player) => player.callerId === userId);
    if (!player) {
      throw new Error("플레이어를 찾을 수 없습니다.");
    }

    await this.playerService.deathVote(player.id, deathVote);
  }
}
