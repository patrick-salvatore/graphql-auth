import User from '../../entity/User';
import { sign, verify } from 'jsonwebtoken';
import { MiddlewareFn } from 'type-graphql';
import { IAGContext } from '../../interfaces/AGContext';

export const createAccessToken = (user: User) => {
    const accessToken = sign(
        { userId: user.id },
        `${process.env.ACCESS_SECRET}`,
        {
            expiresIn: '10m',
        }
    );

    return accessToken;
};

export const createRefreshToken = (user: User) => {
    const refreshToken = sign(
        { userId: user.id },
        `${process.env.REFRESH_SECRET}`,
        {
            expiresIn: '7d',
        }
    );
    return refreshToken;
};

export const createToken = ({
    tokenType,
    payload,
    expiresIn,
}: {
    tokenType: string;
    payload: any;
    expiresIn: string;
}): string => {
    let token = '';

    switch (true) {
        case tokenType === 'access': {
            token = sign(payload, `${process.env.ACCESS_SECRET}`, {
                expiresIn,
            });
            return token;
        }
        case tokenType === 'refresh': {
            token = sign(payload, `${process.env.REFRESH_SECRET}`, {
                expiresIn,
            });
            return token;
        }
        default:
            return token;
    }
};

export const checkAuthorization: MiddlewareFn<IAGContext> = (
    { context },
    next
) => {
    try{
      const authorizationHeader = context.req.headers['authorization'];
  
      if (!authorizationHeader) {
        throw new Error('You are not authorized')
      }
      
      const authToken = authorizationHeader.split(' ')[1];
      const payload = verify(authToken, `${process.env.ACCESS_SECRET}`)
      context.payload = payload;

   } catch(err) {
      console.error(err)
      throw new Error('You are not authorized')
   }

    return next();
};
