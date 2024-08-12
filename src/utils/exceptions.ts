import { StatusCodes } from 'http-status-codes';

export class UnauthorizedException<T> extends Error {
    statusCode: number = StatusCodes.UNAUTHORIZED;
    data: T | null;
    constructor(message: string, data: T | null = null) {
        super(message);
        this.name = this.constructor.name;
        this.data = data;
    }
}

export class ServerErrorException<T> extends Error {
    statusCode: number = StatusCodes.INTERNAL_SERVER_ERROR;
    data: T | null;

    constructor(message: string, data: T | null = null) {
        super(message);
        this.name = this.constructor.name;
        this.data = data;
    }
}

export class NotFoundException<T> extends Error {
    statusCode: number = StatusCodes.NOT_FOUND;
    data: T | null;

    constructor(message: string, data: T | null = null) {
        super(message);
        this.name = this.constructor.name;
        this.data = data;
    }
}

export class BadRequestException<T> extends Error {
    statusCode: number = StatusCodes.BAD_REQUEST;
    data: T | null;
    constructor(message: string, data: T | null = null) {
        super(message);
        this.name = this.constructor.name;
        this.data = data;
    }
}

export class CredentialException<T> extends Error {
    statusCode: number = StatusCodes.UNAUTHORIZED;
    data: T | null;
    constructor(message: string, data: T | null = null) {
        super(message);
        this.name = this.constructor.name;
        this.data = data;
    }
}

export class ForbiddenException<T> extends Error {
    statusCode: number = StatusCodes.FORBIDDEN;
    data: T | null;

    constructor(message: string, data: T | null = null) {
        super(message);
        this.name = this.constructor.name;
        this.data = data;
    }
}
