import { Column, Entity, PrimaryGeneratedColumn, Timestamp } from "typeorm";

@Entity("token")
export class TokenEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: "text" })
  accessToken: string;

  @Column({ type: "text" })
  refreshToken: string;

  @Column()
  expiresAt: number;
}
