import { BooksController } from '../../controllers';
import { BookRepository } from '../../repositories';
import { Book } from '../../models';
import { MongoDataSource } from "../../datasources";
import {AnyObject, Options} from "@loopback/repository";
import {expect, sinon} from "@loopback/testlab";
import assert from "node:assert";
describe('BooksController', () => {
    let booksController: BooksController;
    let bookRepository: BookRepository;
    let dataSource;

    beforeEach(() => {
        dataSource = new MongoDataSource();
        bookRepository = new BookRepository(dataSource);
        booksController = new BooksController(bookRepository);
    });

    describe('create', () => {
        it('should create a new book with unique ISBN', async () => {
            const findOneStub = sinon.stub(bookRepository, 'findOne').resolves(null);
            const createStub = sinon.stub(bookRepository, 'create').resolves();

            const newBook: Omit<Book, 'id'> = {
                getId(): any {
                }, getIdObject(): Object {
                    return {};
                }, toJSON(): Object {
                    return {};
                }, toObject(options: Options | undefined): Object {
                    return {};
                },
                title: 'New Book Title',
                author: 'Author Name',
                description: 'Book Description',
                publicationYear: 2022,
                ISBN: 9934567890123,
                genre: 'Fiction'
            };

            const result = await booksController.create(newBook);

            expect(result.success).to.be.true;

            sinon.assert.calledOnce(findOneStub);
            sinon.assert.calledWithExactly(findOneStub, {where: {ISBN: newBook.ISBN}});

            sinon.assert.calledOnce(createStub);
            sinon.assert.calledWithExactly(createStub, newBook);
        });

        it('should return failure if book with same ISBN already exists', async () => {
            const existingBook: Book = {
                getId(): any {
                }, getIdObject(): Object {
                    return {};
                }, toJSON(): Object {
                    return {};
                }, toObject(options?: Options): Object {
                    return {};
                },
                title: 'Existing Book Title',
                author: 'Existing Author Name',
                description: 'Existing Book Description',
                publicationYear: 2021,
                ISBN: 9134567890123, // ISBN already exists in the database
                genre: 'Non-Fiction'
            };

            const findOneStub = sinon.stub(bookRepository, 'findOne').resolves(existingBook);
            ;
            const createStub = sinon.stub(bookRepository, 'create').resolves();
            const newBook: Omit<Book, 'id'> = {
                getId(): any {
                }, getIdObject(): Object {
                    return {};
                }, toJSON(): Object {
                    return {};
                }, toObject(options: Options | undefined): Object {
                    return {};
                },
                title: 'New Book Title',
                author: 'Author Name',
                description: 'Book Description',
                publicationYear: 2022,
                ISBN: 9134567890123,
                genre: 'Fiction'
            };

            const result = await booksController.create(newBook);

            expect(result.success).to.be.false;

            sinon.assert.calledOnce(findOneStub);
            sinon.assert.calledWithExactly(findOneStub, {where: {ISBN: newBook.ISBN}});
            sinon.assert.notCalled(createStub);
        });
    });

    describe('find', () => {
        it('should return an array of Book model instances', async () => {
            const mockBooks: Book[] = [
                {
                    id: '1',
                    title: 'Book 1',
                    author: 'Author 1',
                    description: 'Description 1',
                    publicationYear: 2021,
                    ISBN: 1234567890123,
                    genre: 'Fiction',
                    getId: function () {
                        throw new Error('Function not implemented.');
                    },
                    getIdObject: function (): Object {
                        throw new Error('Function not implemented.');
                    },
                    toJSON: function (): Object {
                        throw new Error('Function not implemented.');
                    },
                    toObject: function (options?: AnyObject | undefined): Object {
                        throw new Error('Function not implemented.');
                    }
                },
                {
                    id: '2',
                    title: 'Book 2',
                    author: 'Author 2',
                    description: 'Description 2',
                    publicationYear: 2022,
                    ISBN: 2345678901234,
                    genre: 'Non-Fiction',
                    getId: function () {
                        throw new Error('Function not implemented.');
                    },
                    getIdObject: function (): Object {
                        throw new Error('Function not implemented.');
                    },
                    toJSON: function (): Object {
                        throw new Error('Function not implemented.');
                    },
                    toObject: function (options?: AnyObject | undefined): Object {
                        throw new Error('Function not implemented.');
                    }
                }
            ];

            const findStub = sinon.stub(bookRepository, 'find').resolves(mockBooks);

            const result = await booksController.find();

            assert.strictEqual(result.success, true);
            assert.deepStrictEqual(result.data, mockBooks);

            sinon.assert.calledOnce(findStub);
            sinon.assert.calledWithExactly(findStub, undefined);
        });
    });

    describe('search', () => {
        it('should return an array of Book model instances matching the search value', async () => {
            const mockBooks: Book[] = [
                {
                    id: '1',
                    title: 'Book 1',
                    author: 'Author 1',
                    description: 'Description 1',
                    publicationYear: 2021,
                    ISBN: 1234567890123,
                    genre: 'Fiction',
                    getId: function () {
                        throw new Error('Function not implemented.');
                    },
                    getIdObject: function (): Object {
                        throw new Error('Function not implemented.');
                    },
                    toJSON: function (): Object {
                        throw new Error('Function not implemented.');
                    },
                    toObject: function (options?: AnyObject | undefined): Object {
                        throw new Error('Function not implemented.');
                    }
                },
                {
                    id: '2',
                    title: 'Book 2',
                    author: 'Author 2',
                    description: 'Description 2',
                    publicationYear: 2022,
                    ISBN: 2345678901234,
                    genre: 'Non-Fiction',
                    getId: function () {
                        throw new Error('Function not implemented.');
                    },
                    getIdObject: function (): Object {
                        throw new Error('Function not implemented.');
                    },
                    toJSON: function (): Object {
                        throw new Error('Function not implemented.');
                    },
                    toObject: function (options?: AnyObject | undefined): Object {
                        throw new Error('Function not implemented.');
                    }
                }
            ];

            const requestBody = { value: 'book' };

            const findStub = sinon.stub(bookRepository, 'find').resolves(mockBooks);

            const result = await booksController.search(requestBody);

            assert.strictEqual(result.success, true);
            assert.deepStrictEqual(result.data, mockBooks);

            sinon.assert.calledOnce(findStub);
            sinon.assert.calledWithExactly(findStub, {
                where: {
                    title: {
                        regexp: new RegExp(requestBody.value, 'i')
                    }
                }
            });
        });
    });

    describe('replaceById', () => {
        it('should replace a book by its ID', async () => {
            const id = '1';
            const updatedBook: Book = {
                getId(): any {
                }, getIdObject(): Object {
                    return {};
                }, toJSON(): Object {
                    return {};
                }, toObject(options?: Options): Object {
                    return {};
                },
                id: '1',
                title: 'Updated Book Title',
                author: 'Updated Author Name',
                description: 'Updated Book Description',
                publicationYear: 2023,
                ISBN: 3456789012345,
                genre: 'Updated Genre'
            };

            const replaceByIdStub = sinon.stub(bookRepository, 'replaceById').resolves();

            const result = await booksController.replaceById(id, updatedBook);

            assert.strictEqual(result.success, true);

            sinon.assert.calledOnce(replaceByIdStub);
            sinon.assert.calledWithExactly(replaceByIdStub, id, updatedBook);
        });
    });

    describe('deleteByISBN', () => {
        it('should delete books by their ISBNs', async () => {
            const isbns = '1234567890123,2345678901234';
            const ISBNArray = isbns.split(',');

            const findOneStub = sinon.stub(bookRepository, 'findOne');
            const deleteStub = sinon.stub(bookRepository, 'delete');

            findOneStub.onCall(0).resolves({
                ISBN: 0, author: "", description: "", genre: "", getId(): any {
                }, getIdObject(): Object {
                    return {};
                }, id: "", language: "", publicationYear: 0, title: "", toJSON(): Object {
                    return {};
                }, toObject(options: Options | undefined): Object {
                    return {};
                }
            });
            findOneStub.onCall(1).resolves({
                ISBN: 0, author: "", description: "", genre: "", getId(): any {
                }, getIdObject(): Object {
                    return {};
                }, id: "", language: "", publicationYear: 0, title: "", toJSON(): Object {
                    return {};
                }, toObject(options: Options | undefined): Object {
                    return {};
                }
            });

            const result = await booksController.deleteByISBN(isbns);

            assert.strictEqual(result.success, true);

            sinon.assert.calledTwice(findOneStub);
            sinon.assert.calledTwice(deleteStub);

            sinon.assert.calledWithExactly(findOneStub.getCall(0), { where: { ISBN: 1234567890123 } });
            sinon.assert.calledWithExactly(findOneStub.getCall(1), { where: { ISBN: 2345678901234 } });

        });

        it('should handle error when ISBN is invalid', async () => {
            const invalidISBN = 'invalidISBN';

            const result = await booksController.deleteByISBN(invalidISBN);

            assert.strictEqual(result.success, false);
        });

        it('should handle error when book with given ISBN is not found', async () => {
            const nonExistingISBN = '1111111111111';

            const findOneStub = sinon.stub(bookRepository, 'findOne').resolves(null);

            const result = await booksController.deleteByISBN(nonExistingISBN);

            assert.strictEqual(result.success, false);

            sinon.assert.calledOnce(findOneStub);
            sinon.assert.calledWithExactly(findOneStub, { where: { ISBN: Number(nonExistingISBN) } });
        });
    });

});
