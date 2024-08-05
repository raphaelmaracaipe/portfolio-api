import { Entity, ObjectIdColumn, Column } from 'typeorm';

@Entity('Users')
export class User {
  @ObjectIdColumn()
  id?: any;

  @Column()
  phone: string;

  @Column()
  name: string;

  @Column()
  deviceId: string;

  @Column()
  photo: string;

  @Column()
  passphrase: string;

  @Column()
  publicKey: string;

  @Column()
  privateKey: string;

  @Column()
  createdAt: number;

  @Column()
  updatedAt: number;

  @Column()
  isDeleted: boolean;
}
