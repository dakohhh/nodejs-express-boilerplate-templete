import ms from 'ms';
import dotenv from 'dotenv';
import packageInfo from '../../package.json';
dotenv.config();

// How to use this:
// ============================================================
// This file is used to store all the environment variables and constants used in the application.

// # To add a new variable:
// ============================================================
// - For environment variables & constants that are the same across all environments, add them to the GLOBAL_CONSTANTS object.
// - For environment-specific variables (i.e they change depending on the environment), add them to the environment's object in each of the CONFIG_BUILDER object.

// # To add a new environment:
// ============================================================
// 1. Add a new key to the CONFIG_BUILDER object with the environment name.
// 2. Duplicate the development object and replace the values with the new environment's values.

const DEPLOYMENT_ENV: string = process.env.NODE_ENV ? 'development' : 'production';

const GLOBAL_CONFIG = {
    // System Constants
    // ============================================================

    APP_NAME: (packageInfo.name as string) || '<application-name>',
    APP_VERSION: (packageInfo.version as string) || '<application-version>',
    PORT: process.env.PORT || 3000,

    // Security / Auth Configs
    // ============================================================
    BCRYPT_SALT: 10,
    ACCESS_TOKEN_JWT_EXPIRES_IN: ms('1h'),
    REFRESH_TOKEN_JWT_EXPIRES_IN: ms('30d'),
    DEFAULT_DB_TOKEN_EXPIRY_DURATION: ms('5m'),

    // Email / Auth Configs
    // ============================================================
    SUPPORT_EMAIL: 'support@nodejs-boilertemplate.com',
    DEFAULT_EMAIL_FROM: 'nodejs-boilertemplate <no-reply@nodejs-boilertemplate.com>',
    MAILER: {
        USE_AWS_SES: false,
        SMTP_HOST: process.env.MAIL_HOST?.toString(),
        SMTP_PORT: process.env.MAIL_PORT ? Number(process.env.MAIL_PORT) : undefined,
        SMTP_USER: process.env.MAIL_USERNAME?.toString(),
        SMTP_PASSWORD: process.env.MAIL_PASSWORD?.toString(),
        MAIL_SECURE: process.env.MAIL_SECURE,
    },

    USER_ROLES: {
        ADMIN: 'admin',
        STUDENT: 'student',
    },

    USE_AWS_S3: process.env.USE_AWS_S3 ? true : false,

    AWS: {
        AWS_REGION: process.env.AWS_REGION as string,
        AWS_S3_CONFIG: {
            BUCKET_NAME: process.env.S3_BUCKET_NAME as string,
        },

        AWS_ACCESS_KEY_ID: process.env.AWS_ACCESS_KEY_ID as string,
        AWS_SECRET_ACCESS_KEY: process.env.AWS_SECRET_ACCESS_KEY as string,

        AWS_CLOUD_FRONT: {
            CLOUDFRONT_DISTRIBUTION_ID: process.env.CLOUDFRONT_DISTRIBUTION_ID as string,
            CLOUDFRONT_KEY_PAIR_ID: process.env.CLOUDFRONT_KEY_PAIR_ID as string,
            CLOUDFRONT_PRIVATE_KEY: process.env.CLOUDFRONT_PRIVATE_KEY as string,
            CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME: process.env.CLOUDFRONT_DISTRIBUTION_DOMAIN_NAME as string,
        },
    },
};

const config = {
    development: {
        // Development environment settings

        ...GLOBAL_CONFIG,
        port: process.env.PORT || 3000,
        JWT_SECRET: '19d56917f78c581c15056ae050a6f2b790db82c5',

        // DB Configs
        // ============================================================
        MONGODB_URI: process.env.DEV_MONGO_URL as string,

        // App Level Configs
        // ============================================================

        // e.g
        // STRIPE: {
        //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        //     SECRET_KEY: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        // },

        BASE_URL: `http://localhost:3000`,
    },

    production: {
        // Production environment settings

        ...GLOBAL_CONFIG,
        port: process.env.PORT || 3000,
        MONGODB_URI: process.env.PROD_MONGO_URL as string,
        JWT_SECRET: process.env.SECRET_KEY as string,

        BASE_URL: ``,

        // App Level Configs
        // ============================================================

        // e.g
        // STRIPE: {
        //     PUBLIC_KEY: "pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        //     SECRET_KEY: "sk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx",
        // },
    },
} as const;

export default config[DEPLOYMENT_ENV as keyof typeof config];
