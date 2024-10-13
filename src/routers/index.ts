import express from 'express';
import authentication from './authentication';
import upload from './upload';
import user from './user';
import roles from './roles';
import permission from './permission';

const router = express.Router();

export default (): express.Router => {
    authentication(router);
    permission(router);
    roles(router);
    user(router);
    upload(router);

    return router;
};
