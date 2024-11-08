import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PlayerRole } from 'src/common/enum/player-role.enum';
import { openWam } from 'src/common/utils/utils';
import { GameEntity } from 'src/entity/game.entity';
import { PlayerEntity } from 'src/entity/player.entity';
import { Repository } from 'typeorm';

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(PlayerEntity)
    private readonly playerRepository: Repository<PlayerEntity>
  ) {}

  async createPlayer(callerId: string, game: GameEntity) {
    const player = this.playerRepository.create({ callerId, game });
    await this.playerRepository.save(player);
  }


  async setJob(callerId: string, role: PlayerRole) {
    await this.playerRepository.update({ callerId }, { role });
  }

  async getJob(callerId: string) {
    const player = await this.playerRepository.findOne({ where: { callerId } });
    return player.role;
  }

  async vote(id: string, vote: string) {
    await this.playerRepository.update({ id }, { vote });
  }

  async deathVote(id: string, deathVote: boolean) {
    await this.playerRepository.update({ id }, { deathVote });
  }

  async resetVote(id: string) {
    await this.playerRepository.update(
      { id },
      { vote: null, deathVote: false }
    );
  }

  async kill(id: string) {
    await this.playerRepository.update({ id }, { isAlive: false });
  }
}
