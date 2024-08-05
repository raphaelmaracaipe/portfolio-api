import { Column, Entity, ObjectIdColumn } from "typeorm";

@Entity("ApiKeys")
export class ApiKey {
  @ObjectIdColumn()
  id?: any;

  @Column()
  apiKey: string;

  @Column()
  type: string;

}