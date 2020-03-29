import { ParamSchema } from 'express-validator';
import {
    EMAIL_PATTERN,
    INCORRECT_EMAIL_ERROR,
    NAME_LENGTH_ERROR,
    PASSWORD_PATTERN,
} from './constants';

export const UpdateUserValidator: {
    [key: string]: ParamSchema
} = {
    email: {
        in: 'body',
        trim: true,
        custom: {
            options: (value) => EMAIL_PATTERN.test(value),
            errorMessage: INCORRECT_EMAIL_ERROR,
        },
        optional: true,
    },
    password: {
        in: 'body',
        custom: {
            options: (value) => {
                return PASSWORD_PATTERN.test(value);
            },
        },
        optional: true,
    },
    firstName: {
        in: 'body',
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 25,
            },
            errorMessage: NAME_LENGTH_ERROR,
        },
        optional: true,
    },
    lastName: {
        in: 'body',
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 25,
            },
            errorMessage: NAME_LENGTH_ERROR,
        },
        optional: true,
    },
    city: {
        in: 'body',
        trim: true,
        isLength: {
            options: {
                min: 1,
                max: 25,
            },
            errorMessage: NAME_LENGTH_ERROR,
        },
        optional: true,
    }
};
