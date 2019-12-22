import { Resolver, Query, Mutation, Arg } from "type-graphql";
import { hash } from "bcrypt";
import User from "../entity/User";
import { validateEmail, validatePassword } from "../helpers";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users() {
    return User.find();
  }

  @Mutation(() => Boolean)
  async register(
    @Arg("email") email: string,
    @Arg("password") password: string
  ) {
    try {
      console.log(validateEmail(email) && validatePassword(password))
      if (validateEmail(email) && validatePassword(password)) {
        const hashedPassword = await hash(password, 14);
        await User.insert({
          email,
          password: hashedPassword
        });
      }
      return true;
    } catch (err) {
      return false;
    }
  }
}
