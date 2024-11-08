import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
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
    console.log(player);
    await this.playerRepository.save(player);
  }
}
