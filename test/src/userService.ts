import { expect } from 'chai';
import { MongoMemoryServer } from 'mongodb-memory-server';
import * as mongoose from 'mongoose';
import * as supertest from 'supertest';
import { API_VERSION } from '../../config';
import { server } from '../../src';
import { User, UserModel } from '../../src/orm';

// tslint:disable-next-line: no-var-requires
const users: any[] = require('./users.json');

describe('UserService', () => {
    const mongoServer = new MongoMemoryServer();
    let connection: mongoose.Mongoose | null = null;

    const app = supertest(server);
    const baseUrl = `${API_VERSION}/users`;

    let userCollection: User[] = [];
    const invalidId = new mongoose.Types.ObjectId();

    before(async () => {
        const url = await mongoServer.getConnectionString();
        connection = await mongoose.connect(url, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useFindAndModify: false,
        });
        connection.connection.useDb(await mongoServer.getDbName());
    });

    after(async () => {
        if (connection) {
            await connection.disconnect();
            mongoServer.stop();
        }
    });

    beforeEach(async () => {
        userCollection = [];
        for (const user of users) {
            const u = await UserModel.create(user);
            userCollection.push(u);
        }
    });

    afterEach(async () => {
        if (connection) {
            await connection.connection.dropCollection('users');
        }
    });

    it('List users. Should return 3 element in array.', (done) => {
        app.get(baseUrl)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                const body = res.body;

                expect((body || []).length).to.be
                    .equal(3, 'Array contains wrong number of elements.');

                done();
            });
    });

    it('List users with search. Should return 2 element in array.', (done) => {
        app.get(baseUrl + '?text=k')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                const body = res.body;
                expect((body || []).length).to.be
                    .equal(2, 'Array contains wrong number of elements.');

                done();
            });
    });

    it('List users with pagination options. Should return 1 element in array.',
        (done) => {
            app.get(baseUrl + '?pageSize=1&pageToken=1')
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const body = res.body;
                    expect((body || []).length).to.be
                        .equal(1, 'Array contains wrong number of elements.');

                    done();
                });
        });

    it('Retrieve user by id. Should return user entity.', (done) => {
        const user = userCollection[0];

        app.get(baseUrl + `/${user._id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                const body = res.body;
                expect(body._id).to.be.equal(user._id.toString());

                done();
            });
    });

    it('Retrieve user by wrong id. Should return error.', (done) => {
        app.get(baseUrl + `/5e8081a1a0abb111eaf2a26a`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                done();
            });
    });

    it('Retrieve user by incorrect id. Should return error.', (done) => {
        const id = 'test';
        app.get(baseUrl + `/${id}`)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                const body = res.body;

                expect(body.userId).to.be.exist;
                expect(body.userId.value).to.be.equal(id);

                done();
            });
    });

    it('Create user. Should return success response with user entity.',
        (done) => {
            const user = {
                email: 'test@gmail.com',
                password: 'teSt0test',
                firstName: 'Ivan',
                lastName: 'Ivanov',
                city: 'Kyiv',
            };

            app.post(baseUrl).send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(201)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const body = res.body;
                    expect(body).to.include.all.keys(
                        '_id', 'email', 'firstName', 'lastName', 'city',
                    );
                    expect(body.password).to.be.a('null', 'Password must be empty.');

                    done();
                });
        });

    it('Create user with invalid email. Should return error.',
        (done) => {
            const user = {
                email: 'invalid_email.com',
                password: 'teSt0test',
                firstName: 'Ivan',
                lastName: 'Ivanov',
                city: 'Kyiv',
            };

            app.post(baseUrl).send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const body = res.body;
                    expect(body.email).to.be.exist;
                    expect(body.email.value).to.be.equal(user.email);

                    done();
                });
        });

    it('Create user with invalid password. Should return error.',
        (done) => {
            const user = {
                email: 'user@email.com',
                password: 'invalid',
                firstName: 'Ivan',
                lastName: 'Ivanov',
                city: 'Kyiv',
            };

            app.post(baseUrl).send(user)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const body = res.body;
                    expect(body.password).to.be.exist;
                    expect(body.password.value).to.be.equal(user.password);

                    done();
                });
        });

    it(
        'Update user. Should return success response with updated user entity.',
        (done) => {
            const user = userCollection[0];
            const updatedUser = {
                email: 'updated@email.com',
                city: 'Chernivtsy',
            };
            app.patch(baseUrl + `/${user._id}`)
                .send(updatedUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(200)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const body = res.body;
                    expect(body.email).to.be
                        .equal(updatedUser.email, 'User email is not equal to updated entity.');
                    expect(body.email).to.be
                        .equal(updatedUser.email, 'User city is not equal to updated entity.');

                    done();
                });
        });

    it(
        'Update user with invalid params. Should return error.',
        (done) => {
            const user = userCollection[0];
            const updatedUser = {
                email: 'email.com',
                city: 'Chernivtsy',
            };
            app.patch(baseUrl + `/${user._id}`)
                .send(updatedUser)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const body = res.body;
                    expect(body.email).to.be.exist;

                    done();
                });
        });

    it('Update user with invalid password. Should return error.',
        (done) => {
            const user = userCollection[0];
            const update = {
                password: 'invalid',
            };

            app.patch(baseUrl + `/${user._id}`).send(update)
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(400)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    const body = res.body;
                    expect(body.password).to.be.exist;
                    expect(body.password.value).to.be.equal(update.password);

                    done();
                });
        });

    it('Update user with by invalid user id. Should return error.',
        (done) => {
            app.patch(baseUrl + `/${invalidId}`).send({})
                .set('Accept', 'application/json')
                .expect('Content-Type', /json/)
                .expect(404)
                .end((err, res) => {
                    if (err) {
                        return done(err);
                    }

                    done();
                });
        });

    it('Delete user. Should return success response.', (done) => {
        const user = userCollection[0];
        app.delete(baseUrl + `/${user._id}`)
            .expect(204)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                expect(res.body).to.be.empty;

                done();
            });
    });

    it('Delete user that was deleted before. Should return error.', (done) => {
        app.delete(baseUrl + `/5e4081a1a0abb111eaf2a26a`)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }

                done();
            });
    });
});
