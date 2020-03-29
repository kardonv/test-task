import { NOT_FOUND } from '../Error';
import { User, UserModel } from '../orm';
import { CreateUserInput } from '../types/CreateUserInput';
import { UpdateUserInput } from '../types/UpdateUserInput';

interface OperationResult<T> {
    err: TypeError;
    data: T | T[];
}

interface ListQuery {
    text: string;
    pageSize: number;
    pageToken: number;
}

/**
 * Return list of user entities
 *
 * @param {ListQuery} query - list with params
 * @returns {Promise<Partial<OperationResult<User>>>}
 */
export async function listUsers(
    query?: ListQuery,
): Promise<Partial<OperationResult<User>>> {

    const findQuery: { [key: string]: any } = {};

    if (query && query.text) {
        const regExp = { $regex: query.text, $options: 'ig' };

        findQuery.$or = [{
            firstName: regExp,
        }, {
            lastName: regExp,
        }, {
            email: regExp,
        }, {
            city: regExp,
        }];
    }

    const users = await UserModel.find(findQuery)
        .skip((query || {}).pageToken || 0)
        .limit((query || {}).pageSize || 10);

    return { data: users };
}

/**
 * Finds user by specific user id and return it,
 * if user not found returns error
 *
 * @param {string} userId - identifier of user
 * @returns {Promise<Partial<OperationResult<User>>>} -
 *                                      user which has been found
 */
export async function getUser(
    userId: string,
): Promise<Partial<OperationResult<User>>> {
    const user = await UserModel.findOne({ _id: userId });

    if (!user) {
        const err = new TypeError(`User with identifier ${userId} not found.`);
        err.name = NOT_FOUND;

        return { err };
    }

    return { data: user };
}

/**
 * Create new user entity in database
 *
 * @param {CreateUserInput} user - create user input
 * @returns {Promise<Partial<OperationResult<User>>>}
 */
export async function createUser(
    user: CreateUserInput,
): Promise<Partial<OperationResult<User>>> {
    const createdUser = await UserModel.create(user);

    // NOTE: Won't return password, because it's security data
    delete createdUser.password;

    return { data: createdUser };
}

/**
 * Updates user py specific user id and return updated entity
 * if user not found returns error
 *
 * @param {string} userId - identifier of user
 * @param {UpdateUserInput} user - user input
 * @return {Promise<Partial<OperationResult<User>>>}
 */
export async function updateUser(
    userId: string,
    user: UpdateUserInput,
): Promise<Partial<OperationResult<User>>> {
    const updatedUser = await UserModel.findOneAndUpdate({
        _id: userId,
    }, {
        $set: user,
    }, { new: true, });

    if (!updatedUser) {
        const err = new TypeError(`User with identifier ${userId} not found.`);
        err.name = NOT_FOUND;

        return { err };
    }

    return { data: updatedUser as User };
}

/**
 * Deletes user by specific user id,
 * if user not found returns error
 *
 * @param {string} userId - identifier of user
 * @returns
 */
export async function deleteUser(
    userId: string,
): Promise<TypeError | null> {

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
        const err = new TypeError(`User with identifier ${userId} not found.`);
        err.name = NOT_FOUND;

        return err;
    }

    return null;
}
