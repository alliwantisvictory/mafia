import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { GameEntity } from "src/entity/game.entity";
import { GameService } from "./game.service";
import { PlayerModule } from "src/player/player.module";

@Module({
  imports: [TypeOrmModule.forFeature([GameEntity]), PlayerModule],
  providers: [GameService],
  exports: [GameService],
})
export class GameModule {}
