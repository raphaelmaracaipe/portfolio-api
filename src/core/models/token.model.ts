import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('tokens')
export class Token {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column()
  idUser: string;

  @Column({ length: 6 })
  token: number;

  @Column()
  timeValidUntilOfCode: number;
}
