import { AuthRequest } from '@/types/auth';

class UserService {
    static async getUserSession({ user }: Partial<AuthRequest>) {
        const context = {
            session: {
                role: user?.role,
                email: user?.email,
                isVerified: user?.isVerified,
                lastActive: user?.lastActive,
            },
        };

        return context;
    }
}

export default UserService;
