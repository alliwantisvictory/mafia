import { PlayerRole } from "src/common/enum/player-role.enum";
import {
  Column,
  Entity,
  PrimaryGeneratedColumn,
  ManyToOne,
  JoinColumn,
} from "typeorm";
import { GameEntity } from "./game.entity";

@Entity("player")
export class PlayerEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: "varchar" })
  callerId: string;

  // @Column({ type: "varchar" })
  // username: string;

  // @Column({ type: "varchar" })
  // profileImgUrl: string;

  @Column({ type: "enum", enum: PlayerRole })
  role: PlayerRole;

  @Column({ type: "tinyint", default: true })
  isAlive: boolean;

  @JoinColumn({ name: "gameId" })
  @ManyToOne(() => GameEntity, (gameEntity) => gameEntity.players, {
    onDelete: "CASCADE",
  })
  game: GameEntity;
}
