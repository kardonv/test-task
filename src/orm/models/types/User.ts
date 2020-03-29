import { Document } from 'mongoose';

export type User = Document & {
    email: string;
    password: string;
    firstName: string;
    lastName: string;
    city?: string;
};
