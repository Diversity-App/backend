import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { User } from '../types';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export const generateToken = (user: User): string => {
    return jwt.sign(user, JWT_SECRET, {
        expiresIn: '12h',
    });
};

export function hashPassword(password: string) {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
}

export function checkPassword(password: string, hash: string) {
    return bcrypt.compareSync(password, hash);
}
