import { Entity, ObjectIdColumn, ObjectID, Column } from 'typeorm';

@Entity('users')
export class User {
  @ObjectIdColumn()
  id?: ObjectID;

  @Column()
  phone: string;

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
