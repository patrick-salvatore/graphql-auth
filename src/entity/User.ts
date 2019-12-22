import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  BaseEntity,
  Unique,
} from 'typeorm';
import { ObjectType, Field, Int } from 'type-graphql';

@ObjectType()
@Entity('Users')
@Unique(['email', 'userName'])
export default class User extends BaseEntity {
  @Field(() => Int)
  @PrimaryGeneratedColumn()
  id: number;

  @Field()
  @Column({ name: 'userName' })
  userName: string;

  @Field()
  @Column({ name: 'email' })
  email: string;

  @Column({ name: 'password' })
  password: string;

  @Column('int', { name: 'tokenState', default: 0 })
  tokenState: number;
}
