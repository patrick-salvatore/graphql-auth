import { validateEmail, validatePassword } from "../helpers";
import User from "../entity/User";
import {Resolver, Query, Mutation,Arg, ObjectType, Field} from "type-graphql";
import { hash, compare } from "bcrypt";
import {sign} from 'jsonwebtoken';

@ObjectType()
class RegisterResponse {
  @Field()
  success: boolean;

  @Field()
  message: string;
}

@ObjectType()
class LoginResponse {
  @Field()
  success: boolean;

  @Field()
  accessToken: string;

  @Field()
  message: string;
}

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  // Register User Mutation - takes email & password as arguments & returns message
  @Mutation(() => RegisterResponse)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      if (validateEmail(email) && validatePassword(password)) {
        const hashedPassword = await hash(password, 14);
        await User.insert({
          email,
          password: hashedPassword
        });
      }
      return {
        success: true,
        message: `User: ${email} has sucessfully registered`
      };
    } catch (err) {
      return { success: false, message: `${err.message}` };
    }
  }

  // Login Mutation - takes email & password as arguments & returns accesstoken
  @Mutation(() => LoginResponse)
  async login(@Arg("email") email: string, @Arg("password") password: string): Promise<LoginResponse> {
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        throw new Error(`A user with the name of ${email} does not exist`)
      }

      const validPassword = await compare(password, user.password)
      if (!validPassword) {
        throw new Error(`Invalid password - Please try again`)
      }

      return {
        success: true,
        accessToken: sign({userId: user.id}, `${process.env.JWT_SECRET}`, {expiresIn: '10m'}),
        message: `Welcome back ${email}!`
      };
    }catch(err) {
      return {
        success: false,
        accessToken: '',
        message: `${err.message}`
      };
    }
  }
}
