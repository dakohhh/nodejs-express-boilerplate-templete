import express from 'express';
import authentication from './authentication';
import upload from './upload';
import user from './user';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    user(router);
    upload(router);

    return router;
};
