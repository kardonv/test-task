import {
    NextFunction,
    Request,
    Response,
    Router,
} from 'express';
import { checkSchema, validationResult } from 'express-validator';
import {
    createUser,
    deleteUser,
    getUser,
    listUsers,
    updateUser,
} from '../controllers/user';
import { NOT_FOUND } from '../Error';
import {
    CreateUserValidator,
    UpdateUserValidator,
    UserIdParamValidator,
    UserQueryValidator,
} from './validators';

const router = Router();


router.route('/users')
    .get(checkSchema(UserQueryValidator),
        async (req: Request, res: Response) => {
            const { data } = await listUsers(req.query);

            return res.status(200).json(data);
        })
    .post(checkSchema(CreateUserValidator),
        async (req: Request, res: Response) => {
            const validatedResult = validationResult(req);

            if (!validatedResult.isEmpty()) {
                return res.status(400).json(validatedResult.mapped());
            }

            const { data } = await createUser(req.body);

            res.status(201).send(data);
        },
    );

router.route('/users/:userId')
    .all(checkSchema(UserIdParamValidator))
    .patch(checkSchema(UpdateUserValidator))
    .all((req: Request, res: Response, next: NextFunction) => {
        const validatedResult = validationResult(req);

        if (!validatedResult.isEmpty()) {
            return res.status(400).json(validatedResult.mapped());
        }

        next();
    })
    .get(async (req: Request, res: Response) => {
        const { err, data } = await getUser(req.params.userId);

        if (err) {
            return res.status(404).json({ message: err.message });
        }

        return res.status(200).json(data);
    })
    .patch(checkSchema(UpdateUserValidator),
        async (req: Request, res: Response) => {
            const { err, data } = await updateUser(req.params.userId, req.body);

            if (err && err.name === NOT_FOUND) {
                return res.status(404).json({ message: err.message });
            }

            return res.status(200).json(data);

        })
    .delete(async (req: Request, res: Response) => {
        const err = await deleteUser(req.params.userId);

        if (err && err.name === NOT_FOUND) {
            return res.status(404).json({ message: err.message });
        }

        return res.status(204).json();
    });

export {
    router as userRouter,
};
