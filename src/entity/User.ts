import { Entity, PrimaryGeneratedColumn, Column, BaseEntity, Unique } from "typeorm";
import { ObjectType, Field, Int} from "type-graphql";

@ObjectType()
@Entity("Users")
@Unique(["email"])
export default class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({name: 'email'})
  email: string;

  @Column({name: 'password'})
  password: string;
}
