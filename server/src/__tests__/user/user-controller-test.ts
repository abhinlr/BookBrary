import { UserController } from '../../controllers';
import { UserRepository } from '../../repositories';
import { User, UserRelations } from '../../models';
import { MongoDataSource } from "../../datasources";
import bcrypt from "bcrypt";
const assert = require('assert');

describe('UserController', () => {
    let userController: UserController;
    let userRepository: UserRepository;
    let dataSource;

    beforeEach(() => {
        dataSource = new MongoDataSource();
        userRepository = new UserRepository(dataSource);
        userController = new UserController(userRepository);
    });

    describe('create', () => {
        it('should create a new user', async () => {
            userRepository.findOne = async () => null;

            const user = {
                name: 'Test User', // Add name property
                email: 'test@example.com',
                password: 'password',
            };

            const result = await userController.create(user);
            assert.strictEqual(result.success, true);
        });

        it('should return failure if user already exists', async () => {
            userRepository.findOne = async (): Promise<(User & UserRelations) | null> => {
                const user: (User & UserRelations) | null = {
                    id: '1',
                    name: 'Test User',
                    email: 'test@example.com',
                    password: 'password',
                    getId: () => '1',
                    getIdObject: () => ({ id: '1' }),
                    toJSON: () => ({ id: '1', name: 'Test User', email: 'test@example.com' }), // Add toJSON method
                    toObject: () => ({ id: '1', name: 'Test User', email: 'test@example.com' }) // Add toObject method
                };

                return user;
            };

            const user = {
                name: 'Test User', // Add name property
                email: 'test@example.com',
                password: 'password',
            };

            const result = await userController.create(user);
            assert.strictEqual(result.success, false);
        });
    });


    describe('login', () => {
        it('should login user with correct credentials', async () => {
            userRepository.findOne = async (filter?, options?): Promise<(User & UserRelations) | null> => {
                const hashedPassword = await bcrypt.hash('password', 10);

                const user: (User & UserRelations) | null = {
                    id: '1',
                    name: 'Test User',
                    email: 'test@example.com',
                    password: hashedPassword,
                    getId: () => '1',
                    getIdObject: () => ({ id: '1' }),
                    toJSON: () => ({ id: '1', name: 'Test User', email: 'test@example.com' }), // Add toJSON method
                    toObject: () => ({ id: '1', name: 'Test User', email: 'test@example.com' }) // Add toObject method
                };

                return user;
            };


            const userData = {
                email: 'test@example.com',
                password: 'password',
            };

            const result = await userController.login(userData);
            assert.strictEqual(result.success, true);
            assert.ok(result.token);
            assert.ok(result.user);
        });

        it('should return failure for incorrect password', async () => {
            userRepository.findOne = async (): Promise<(User & UserRelations) | null> => {
                const hashedPassword = await bcrypt.hash('password', 10);

                const user: (User & UserRelations) | null = {
                    id: '1',
                    name: 'Test User',
                    email: 'test@example.com',
                    password: hashedPassword,
                    getId: () => '1',
                    getIdObject: () => ({ id: '1' }),
                    toJSON: () => ({ id: '1', name: 'Test User', email: 'test@example.com' }), // Add toJSON method
                    toObject: () => ({ id: '1', name: 'Test User', email: 'test@example.com' }) // Add toObject method
                };

                return user;
            };


            const userData = {
                email: 'test@example.com',
                password: 'incorrectpassword',
            };

            const result = await userController.login(userData);
            assert.strictEqual(result.success, false);
            assert.strictEqual(result.token, null);
            assert.strictEqual(result.user, null);
        });

        it('should return failure for invalid user credentials', async () => {
            userRepository.findOne = async () => null;

            const userData = {
                email: 'invalid@example.com',
                password: 'password',
            };

            const result = await userController.login(userData);
            assert.strictEqual(result.success, false);
            assert.strictEqual(result.token, null);
            assert.strictEqual(result.user, null);
        });
    });
});
