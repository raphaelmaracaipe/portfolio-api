import { Column, Entity, ObjectIdColumn } from 'typeorm';

@Entity('keys')
export class Key {
  @ObjectIdColumn()
  id?: any;

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
