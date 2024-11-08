import { join } from 'path';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { GamePhase } from 'src/common/enum/game-phase-enum';
import { GameStatus } from 'src/common/enum/game-status-enum';
import { PlayerRole } from 'src/common/enum/player-role.enum';
import {
  getChannelToken,
  getManagerInfo,
  getUserInfo,
  sendAsBot,
} from 'src/common/utils/utils';
import { GameEntity } from 'src/entity/game.entity';
import { PlayerService } from 'src/player/player.service';
import { Repository } from 'typeorm';

@Injectable()
export class GameService {
  constructor(
    @InjectRepository(GameEntity)
    private readonly gameRepository: Repository<GameEntity>,
    private readonly playerService: PlayerService
  ) {}
  private readonly createMafiaGameMsg =
    '/join을 통해 마피아 게임에 참여해보세요!';
  private readonly startMafiaGameMsg =
    '마피아 게임을 시작합니다! /job을 통해 자신의 역할을 확인하세요.';
  private readonly dayMafiaGameMsg =
    '낮이 되었습니다. 자유롭게 이야기하며 마피아를 찾아보세요.';
  private readonly nightMafiaGameMsg =
    '밤이 되었습니다. /execute을 통해 각자의 역할을 수행해주세요.';
  private readonly voteMafiaGameMsg =
    '투표를 진행합니다. /vote를 통해 마피아로 의심되는 사람을 지목해주세요.';
  private readonly closeStatementMafiaGameMsg =
    '님이 마피아로 지목되었습니다. 20초간 최종 변론을 해주세요.';
  private readonly finalVoteMafiaGameMsg =
    '지금부터 20초 간 최종 투표를 진행합니다.';
  private readonly deathMsg = '님이 처형되었습니다.';
  private readonly liveMsg = '님이 생존하였습니다.';
  private readonly botName = 'Mafia Bot';
  private readonly joinMsg = '가 참여했습니다!';
  private readonly mafiaWinMsg =
    '마피아가 승리하였습니다! 거리에 총성이 울려퍼집니다...';
  private readonly citizenWinMsg =
    '시민이 승리하였습니다! 마을의 평화를 되찾았습니다.';

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
      throw new Error('이미 게임 중입니다.');
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
      relations: ['players'],
    });

    if (!readyGame) {
      throw new Error('게임 준비가 되지 않았습니다.');
    } else if (readyGame.players.length < 3) {
      throw new Error(
        `아직 참가자가 부족합니다. (현재 참가자 수: ${readyGame.players.length}명)`
      );
    }

    // 역할 부여
    const players = readyGame.players;
    const roles = [
      // PlayerRole.CITIZEN,
      // PlayerRole.CITIZEN,
      PlayerRole.DOCTOR,
      PlayerRole.POLICE,
      // PlayerRole.MAFIA,
      PlayerRole.MAFIA,
    ];
    for (let i = roles.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [roles[i], roles[j]] = [roles[j], roles[i]];
    }
    await Promise.all(
      players.map((player, i) =>
        this.playerService.setJob(player.callerId, roles[i])
      )
    );

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

    while (true) {
      // 낮
      await this.gameRepository.update(readyGame.id, {
        phase: GamePhase.DAY,
        doctorSelect: null,
        mafiaSelect: null,
      });
      await Promise.all(
        readyGame.players.map((player) =>
          this.playerService.resetVote(player.id)
        )
      );
      await sendAsBot(
        channelId,
        groupId,
        broadcast,
        rootMessageId,
        this.dayMafiaGameMsg,
        this.botName
      );
      await new Promise((resolve) => setTimeout(resolve, 10000)); // 60초 대기

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
      const { players: closePlayers } = await this.getPlayers(chatId);
      const votes = closePlayers.map((player) => player.vote);
      const voteCounts = votes.reduce((acc, vote) => {
        acc[vote] = (acc[vote] || 0) + 1;
        return acc;
      }, {});
      const maxVote = Object.entries(voteCounts).reduce((a, b) =>
        a[1] > b[1] ? a : b
      )[0];
      const targetId = closePlayers.find(
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

      // 게임 종료 확인
      const gameStatus = await this.checkGameEnd(chatId);
      if (gameStatus === 'mafia_win') {
        await sendAsBot(
          channelId,
          groupId,
          broadcast,
          rootMessageId,
          this.mafiaWinMsg,
          this.botName
        );
        break;
      } else if (gameStatus === 'citizen_win') {
        await sendAsBot(
          channelId,
          groupId,
          broadcast,
          rootMessageId,
          this.citizenWinMsg,
          this.botName
        );
        break;
      }

      // 역할 수행
      await this.gameRepository.update(readyGame.id, {
        phase: GamePhase.NIGHT,
      });
      await sendAsBot(
        channelId,
        groupId,
        broadcast,
        rootMessageId,
        this.nightMafiaGameMsg,
        this.botName
      );
      await new Promise((resolve) => setTimeout(resolve, 20000)); // 20초 대기

      // 역할 수행 결과
      const {
        mafiaSelect: playerSelectedByMafia,
        doctorSelect: playerSelectedByDoctor,
      } = await this.gameRepository.findOne({
        where: { chatId: chatId },
      });
      if (playerSelectedByDoctor === playerSelectedByMafia) {
        await sendAsBot(
          channelId,
          groupId,
          broadcast,
          rootMessageId,
          `지난 밤 ${playerSelectedByMafia}님이 총에 맞았으나, 근처에 있던 의사의 응급처치 덕분에 목숨을 건졌습니다.`,
          this.botName
        );
      } else {
        await this.playerService.kill(playerSelectedByMafia);
        await sendAsBot(
          channelId,
          groupId,
          broadcast,
          rootMessageId,
          `지난 밤 ${playerSelectedByMafia}님이 총에 맞아 사망하셨습니다.`,
          this.botName
        );
        const gameStatus = await this.checkGameEnd(chatId);
        if (gameStatus === 'mafia_win') {
          await sendAsBot(
            channelId,
            groupId,
            broadcast,
            rootMessageId,
            this.mafiaWinMsg,
            this.botName
          );
          break;
        }
      }
    }
  }

  async checkGameEnd(chatId: string) {
    const { players } = await this.getPlayers(chatId);
    const mafiaCnt = players.filter(
      (player) => player.role === PlayerRole.MAFIA
    ).length;

    if (mafiaCnt >= players.length - mafiaCnt) {
      return 'mafia_win';
    } else if (mafiaCnt === 0) {
      return 'citizen_win';
    }
    return 'in_progress';
  }

  async getPlayers(chatId: string) {
    const game = await this.gameRepository.findOne({
      where: { chatId: chatId, status: GameStatus.IN_PROGRESS },
      relations: ['players'],
    });

    if (!game) {
      throw new Error('게임이 진행 중이지 않습니다.');
    }

    let phase = '';
    if (game.phase === GamePhase.VOTE) {
      phase = 'CIVILIAN_VOTE';
    } else if (game.phase === GamePhase.CLOSE_STATEMENT) {
      phase = 'DEATH_VOTE';
    } else {
      throw new Error('현재 투표를 할 수 없는 상태입니다.');
    }

    const alivePlayers = game.players.filter((player) => player.isAlive);

    return { players: alivePlayers, phase };
  }

  async civilianVote(chatId: string, userId: string, vote: string) {
    const game = await this.gameRepository.findOne({
      where: { chatId: chatId, phase: GamePhase.VOTE },
      relations: ['players'],
    });
    if (!game) {
      throw new Error('현재 투표 중이지 않습니다.');
    }

    const player = game.players.find((player) => player.callerId === userId);
    if (!player) {
      throw new Error('플레이어를 찾을 수 없습니다.');
    }

    await this.playerService.vote(player.id, vote);
  }

  async deathVote(chatId: string, userId: string, deathVote: boolean) {
    const game = await this.gameRepository.findOne({
      where: { chatId: chatId, phase: GamePhase.CLOSE_STATEMENT },
      relations: ['players'],
    });
    if (!game) {
      throw new Error('현재 투표 중이지 않습니다.');
    }

    const player = game.players.find((player) => player.callerId === userId);
    if (!player) {
      throw new Error('플레이어를 찾을 수 없습니다.');
    }

    await this.playerService.deathVote(player.id, deathVote);
  }

  async doctorVote(chatId: string, vote: string) {
    const game = await this.gameRepository.findOne({
      where: { chatId: chatId, phase: GamePhase.CLOSE_STATEMENT },
      relations: ['players'],
    });
    if (!game) {
      throw new Error('현재 투표 중이지 않습니다.');
    }

    await this.gameRepository.update(game.id, {
      doctorSelect: vote,
    });
  }

  async mafiaVote(chatId: string, vote: string) {
    const game = await this.gameRepository.findOne({
      where: { chatId: chatId, phase: GamePhase.CLOSE_STATEMENT },
      relations: ['players'],
    });
    if (!game) {
      throw new Error('현재 투표 중이지 않습니다.');
    }

    await this.gameRepository.update(game.id, {
      mafiaSelect: vote,
    });
  }
}
