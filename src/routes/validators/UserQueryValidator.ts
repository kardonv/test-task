import { ParamSchema } from 'express-validator';

export const UserQueryValidator: {
    [key: string]: ParamSchema
} = {
    text: {
        in: 'query',
        optional: true,
    },
    pageSize: {
        in: 'query',
        optional: true,
        toInt: true,
    },
    pageToken: {
        in: 'query',
        optional: true,
        toInt: true,
    },
};
