import { ParamSchema } from 'express-validator';
import {
    EMAIL_PATTERN,
    INCORRECT_EMAIL_ERROR,
    NAME_LENGTH_ERROR,
    PASSWORD_PATTERN,
    REQUIRED_ERROR,
} from './constants';

export const CreateUserValidator: {
    [key: string]: ParamSchema
} = {
    email: {
        in: 'body',
        trim: true,
        exists: {
            errorMessage: REQUIRED_ERROR,
        },
        custom: {
            options: (value) => {
                const isValid = EMAIL_PATTERN.test(value);

                if (isValid) {
                    return isValid;
                }

                return isValid;
            },
            errorMessage: INCORRECT_EMAIL_ERROR,
        }
    },
    password: {
        in: 'body',
        exists: {
            errorMessage: REQUIRED_ERROR,
        },
        custom: {
            options: (value) => {
                return PASSWORD_PATTERN.test(value);
            },
        },
    },
    firstName: {
        in: 'body',
        trim: true,
        exists: {
            errorMessage: REQUIRED_ERROR,
        },
        isLength: {
            options: {
                min: 1,
                max: 25,
            },
            errorMessage: NAME_LENGTH_ERROR,
        },
    },
    lastName: {
        in: 'body',
        trim: true,
        exists: {
            errorMessage: REQUIRED_ERROR,
        },
        isLength: {
            options: {
                min: 1,
                max: 25,
            },
            errorMessage: NAME_LENGTH_ERROR,
        },
    },
    city: {
        in: 'body',
        trim: true,
        optional: true,
        isLength: {
            options: {
                min: 1,
                max: 25,
            },
            errorMessage: NAME_LENGTH_ERROR,
        },
    }
};
