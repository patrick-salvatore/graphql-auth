import {Response, Request} from 'express';

export interface IAGContext{
  req: Request;
  res: Response;
  payload?: any
}