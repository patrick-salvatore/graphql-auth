import { Request, Response } from 'express';
import { verify } from 'jsonwebtoken';
import User from '../../entity/User';
import { createToken } from './auth';

export const handleRefresh = async (req: Request, res: Response) => {
  const refreshToken = req.cookies.jid;
  let user;
  let payload;

  if (!refreshToken) {
    return res.status(403).send({
      success: false,
      accessToken: '',
      message: 'no refresh token',
    });
  }

  try {
    payload = verify(refreshToken, `${process.env.REFRESH_SECRET}`) as any;
    user = await User.findOne({ where: { id: payload.userId } });
  } catch (err) {
    res.send({ message: err.message });
  }
  
  if (!user) {
    return res.status(404).send({
      success: false,
      accessToken: '',
      message: 'no user',
    });
  }

  if (user.tokenState !== payload.tokenState) {
    return res.status(404).send({
      success: false,
      accessToken: '',
      message: 'bad refresh token',
    });
  }

  return res.send({
    success: true,
    accessToken: createToken({
      tokenType: 'access',
      payload: { userId: user.id },
      expiresIn: '7d',
    }),
  });
};
