function response<T>(message: string, data?: T | null, success?: boolean) {
    return {
        success: success == null ? true : success,
        message: message,
        data: data || null,
    };
}

export default response;
