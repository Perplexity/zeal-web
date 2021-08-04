import { NextFunction, Request, Response } from 'express';
import { StatusCodes } from 'http-status-codes';
import * as jwt from 'jsonwebtoken';
import { User } from '../types';

const validateAuthToken = async (req: Request, res: Response, next: NextFunction): Promise<Response<any, Record<string, any>>> => {
	const auth_header = req.headers.authorization;
	if (auth_header) {
		const token = getJwtFromHeader(auth_header);
		if (token) {
			try {
				const user = jwt.verify(token, process.env.JWT_PRIVATE_KEY) as User;
				const isRoot = user.id == 0;
				req.body.user = user;
				req.body.isRoot = isRoot;
				next();
			} catch {
				return res.status(StatusCodes.UNAUTHORIZED).send();
			}
		} else {
			return res.status(StatusCodes.UNAUTHORIZED).send();
		}
	} else {
		return res.status(StatusCodes.UNAUTHORIZED).send();
	}
};

export const getJwtFromHeader = (header: string): string | false => {
	const reg = /Bearer (.*)/;
	if (header.match(reg)) {
		const token = reg.exec(header)[1];
		if (token) {
			return token;
		}
		return false;
	}
	return false;
};

export default validateAuthToken;
