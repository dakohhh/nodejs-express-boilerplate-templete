export function generateWalletId(): string {
    let digits = '';

    for (let i = 0; i < 9; i++) {
        digits += Math.floor(Math.random() * 10);
    }

    return '4' + digits;
}

export function generateRandomOtp(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}
