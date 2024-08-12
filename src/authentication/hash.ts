import bcrypt from 'bcrypt';
import settings from '@/settings';

const hashPassword = async (password: string): Promise<string> => {
    return bcrypt.hash(password, settings.BCRYPT_SALT);
};

const comparePassword = async (password: string, hash: string): Promise<boolean> => {
    return bcrypt.compare(password, hash);
};

export { hashPassword, comparePassword };
