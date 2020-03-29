import * as crypto from 'crypto';
import { model, Schema } from 'mongoose';
import { PASSWORD_SALT } from '../../../config';
import { User } from './types/User';

export * from './types/User';

const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
        minlength: 8,
        select: false,
    },
    firstName: {
        type: String,
        required: true,
        maxlength: 25,
    },
    lastName: {
        type: String,
        required: true,
        maxlength: 25,
    },
    city: {
        type: String,
        maxlength: 25,
    },
}, {
    timestamps: true,
    versionKey: false,
});

userSchema.post('save', (doc: User) => {
    doc.set('password', null);
});

userSchema.pre('save', function (next: any) {
    const user: any = this;

    const hash = crypto.createHash('sha256')
        .update(PASSWORD_SALT + user.password)
        .digest('hex');
    user.password = hash;

    next();
});

userSchema.index({
    email: 1,
    firstName: 1,
    lastName: 1,
    city: 1
});

export const UserModel = model<User>('users', userSchema);
