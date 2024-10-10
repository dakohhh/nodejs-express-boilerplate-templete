import crypto from 'crypto';

export function generateRandomOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

export function randomFileName(bytes: number = 16) {
    return crypto.randomBytes(bytes).toString('hex');
}
