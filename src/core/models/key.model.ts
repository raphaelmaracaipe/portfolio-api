import { Column, Entity, ObjectID, ObjectIdColumn } from 'typeorm';

@Entity('keys')
export class Key {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column()
  idUser: string;

  @Column()
  key: string;

  @Column()
  deviceId: string;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;
}
