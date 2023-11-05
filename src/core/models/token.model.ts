import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('TokensOfAccess')
export class Token {
  @ObjectIdColumn()
  id?: any;

  @Column()
  idUser: string;

  @Column({ length: 6 })
  token: number;

  @Column()
  timeValidUntilOfCode: number;
}
