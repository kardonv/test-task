import { connect } from 'mongoose';

export const API_VERSION = '/v1';
export const PORT = 8080;
export const PASSWORD_SALT = process.env.PASSWORD_SALT || 'sdfhgaelifuagwehfba.jwuvf;a43t523h98tq43pfgb31gqp984gtfb3uof4gw';

export const DEFAULT_DB_NAME = 'test-task';
export const DEFAULT_DB_PORT = 27017;
export const DEFAULT_DB_HOST = 'localhost';
export const DEFAULT_DB_DIALECT = 'mongodb';

export const DB_CONN_STR = process.env.DB_CONN_STR || `${
    DEFAULT_DB_DIALECT}://${
    DEFAULT_DB_HOST}:${
    DEFAULT_DB_PORT}/${
    DEFAULT_DB_NAME}`;

export async function dbConfig() {
    return await connect(DB_CONN_STR, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useFindAndModify: false,
        useCreateIndex: true,
    });
}
