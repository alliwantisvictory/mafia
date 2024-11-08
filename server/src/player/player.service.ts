import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { openWam } from "src/common/utils/utils";
import { GameEntity } from "src/entity/game.entity";
import { PlayerEntity } from "src/entity/player.entity";
import { Repository } from "typeorm";

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

  async showJob(callerId: string, params: any) {
    const player = await this.playerRepository.findOne({ where: { callerId } });
    const args = {
      wamName: "ROLE",
      role: player.role,
    };
    return openWam("wam_name", args, params);
  }

  async vote(id: string, vote: string) {
    await this.playerRepository.update({ id }, { vote });
  }

  async deathVote(id: string, deathVote: boolean) {
    await this.playerRepository.update({ id }, { deathVote });
  }

  async kill(id: string) {
    await this.playerRepository.update({ id }, { isAlive: false });
  }
}
