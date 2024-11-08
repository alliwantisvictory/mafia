import { Module } from "@nestjs/common";
import { PlayerService } from "./player.service";
import { TypeOrmModule } from "@nestjs/typeorm";
import { PlayerEntity } from "src/entity/player.entity";

@Module({
  imports: [TypeOrmModule.forFeature([PlayerEntity])],
  providers: [PlayerService],
  exports: [PlayerService],
})
export class PlayerModule {}
