import { GamePhase } from 'src/common/enum/game-phase-enum';
import { GameStatus } from 'src/common/enum/game-status-enum';
import { Column, Entity, PrimaryGeneratedColumn, OneToMany } from 'typeorm';
import { PlayerEntity } from './player.entity';

@Entity('game')
export class GameEntity {
  @PrimaryGeneratedColumn()
  id: string;

  @Column({ type: 'varchar' })
  chatId: string;

  @Column({ type: 'enum', enum: GameStatus, default: GameStatus.NEW })
  status: GameStatus;

  @Column({ type: 'enum', enum: GamePhase, default: GamePhase.CONFIRM })
  phase: GamePhase;

  @Column({ type: 'string', nullable: true })
  mafiaSelect: string;

  @Column({ type: 'string', nullable: true })
  doctorSelect: string;

  @OneToMany(() => PlayerEntity, (playerEntity) => playerEntity.game)
  players: PlayerEntity[];
}
