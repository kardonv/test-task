import { ParamSchema } from 'express-validator';
import {
    INCORRECT_USER_ID,
    OBJECT_ID_PATTERN,
} from './constants';

export const UserIdParamValidator: {
    [key: string]: ParamSchema
} = {
    userId: {
        in: 'params',
        trim: true,
        custom: {
            options: (value) => OBJECT_ID_PATTERN.test(value),
            errorMessage: INCORRECT_USER_ID,
        },
    },
};
