import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import axios from 'axios';
import { GamePhase } from 'src/common/enum/game-phase-enum';
import { GameStatus } from 'src/common/enum/game-status-enum';
import { getChannelToken, sendAsBot } from 'src/common/utils/utils';
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
  private readonly createMafiaGameMsg = '마피아 게임을 시작합니다!';
  private readonly botName = 'Mafia Bot';

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
  }

  async getPlayers(chatId: string) {
    const game = await this.gameRepository.findOne({
      where: { chatId: chatId, status: GameStatus.IN_PROGRESS },
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

    return { players: game.players, phase };
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
}
