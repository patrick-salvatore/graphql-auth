import { validateUserCredentials } from '../helpers/User/validation';
import { IAGContext } from '../interfaces/AGContext';
import { createToken, checkAuthorization } from '../helpers/User/auth';
import User from '../entity/User';
import {
  Resolver,
  Query,
  Mutation,
  Arg,
  ObjectType,
  Field,
  Ctx,
  UseMiddleware,
} from 'type-graphql';
import { hash, compare } from 'bcrypt';
import { getConnection } from 'typeorm';

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

  @Query(() => String)
  @UseMiddleware(checkAuthorization)
  userId(@Ctx() { payload }: IAGContext) {
    return `payload: ${JSON.stringify(payload)}`;
  }

  // Register User Mutation - takes email & password as arguments & returns message
  @Mutation(() => RegisterResponse)
  async register(
    @Arg('userName') userName: string,
    @Arg('email') email: string,
    @Arg('password') password: string
  ) {
    try {
      if (validateUserCredentials({ userName, email, password })) {
        const hashedPassword = await hash(password, 14);
        await User.insert({
          userName,
          email,
          password: hashedPassword,
        });
      }
      return {
        success: true,
        message: `User: ${userName} has sucessfully registered`,
      };
    } catch (err) {
      return { success: false, message: `${err.message}` };
    }
  }

  // Login Mutation - takes email & password as arguments & returns accesstoken
  @Mutation(() => LoginResponse)
  async login(
    @Arg('userName') userName: string,
    @Arg('password') password: string,
    @Ctx() { res }: IAGContext
  ): Promise<LoginResponse> {
    try {
      const user = await User.findOne({ where: { userName } });
      if (!user) {
        throw new Error(`A user with the name of ${userName} does not exist`);
      }

      const validPassword = await compare(password, user.password);
      if (!validPassword) {
        throw new Error(`Invalid password - Please try again`);
      }

      res.cookie(
        'jid',
        createToken({
          tokenType: 'refresh',
          payload: { userId: user.id, tokenState: user.tokenState },
          expiresIn: '7d',
        }),
        { httpOnly: true }
      );

      return {
        success: true,
        accessToken: createToken({
          tokenType: 'access',
          payload: { userId: user.id },
          expiresIn: '15m',
        }),
        message: `Welcome back ${userName}!`,
      };
    } catch (err) {
      return {
        success: false,
        accessToken: '',
        message: `${err.message}`,
      };
    }
  }

  @Mutation(() => Boolean)
  async revokeUserRefreshTokens(@Arg('userId') userId: number) {
    const user = await User.findOne({ where: { id: userId } });

    try {
      if (!user) {
        throw new Error('there is no user with this ID');
      }

      await getConnection()
        .getRepository(User)
        .increment({ id: userId }, 'tokenState', 1);

      return true;
    } catch (err) {
      console.error(err);
      return false;
    }
  }
}
