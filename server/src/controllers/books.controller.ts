import {
  Count,
  CountSchema,
  Filter,
  FilterExcludingWhere,
  repository,
  Where,
} from '@loopback/repository';
import {
  post,
  param,
  get,
  getModelSchemaRef,
  patch,
  put,
  del,
  requestBody,
  response, HttpErrors,
} from '@loopback/rest';
import {Book} from '../models';
import {BookRepository} from '../repositories';

export class BooksController {
  constructor(
    @repository(BookRepository)
    public bookRepository : BookRepository,
  ) {}

  @post('/books/add')
  @response(200, {
    description: 'Book model instance',
    content: {'application/json': {schema: getModelSchemaRef(Book)}},
  })
  async create(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {
            title: 'NewBook',
            exclude: ['id'],
          }),
        },
      },
    })
    book: Omit<Book, 'id'>,
  ): Promise<{success:boolean}> {
    const existingISBN = await this.bookRepository.findOne({where: {ISBN: book.ISBN}});
    if(existingISBN){
      return {success:false}
    }
    await this.bookRepository.create(book);
    return {success:true};
  }

  @get('/books/count')
  @response(200, {
    description: 'Book model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    return this.bookRepository.count(where);
  }

  @get('/books/fetch')
  @response(200, {
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(Book) filter?: Filter<Book>,
  ): Promise<{success:boolean,data:Book[]}> {
    const data = await this.bookRepository.find(filter);
    return { success: true, data: data };
  }

  @patch('/books')
  @response(200, {
    description: 'Book PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    book: Book,
    @param.where(Book) where?: Where<Book>,
  ): Promise<Count> {
    return this.bookRepository.updateAll(book, where);
  }

  @post('/books/search')
  @response(200, {
    description: 'Array of Book model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(Book, { includeRelations: true }),
        },
      },
    },
  })
  async search(
      @requestBody() value: {value:string}
  ): Promise<{ success: boolean, data: {} }> {
    const filter: Filter<Book> = {
      where: {
        title: {
          regexp: new RegExp(value.value, 'i')
        }
      }
    };
    const data = await this.bookRepository.find(filter);
    return { success: true, data: data };
  }


  @get('/books/{id}')
  @response(200, {
    description: 'Book model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(Book, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(Book, {exclude: 'where'}) filter?: FilterExcludingWhere<Book>
  ): Promise<Book> {
    return this.bookRepository.findById(id, filter);
  }

  @patch('/books/{id}')
  @response(204, {
    description: 'Book PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(Book, {partial: true}),
        },
      },
    })
    book: Book,
  ): Promise<void> {
    await this.bookRepository.updateById(id, book);
  }

  @put('/books/edit/{id}')
  @response(204, {
    description: 'Book PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() book: Book,
  ): Promise<{success:boolean}> {
    await this.bookRepository.replaceById(id, book);
    return {success:true};
  }

  @del('/books/delete/{ISBNs}')
  async deleteByISBN(@param.path.string('ISBNs') isbns: string): Promise<{ success: boolean }> {
    const ISBNArray = isbns.split(','); // Split the comma-separated string into an array of ISBNs
    try {
      for (const ISBN of ISBNArray) {
        const ISBNNumber = Number(ISBN.trim());
        if (isNaN(ISBNNumber)) {
          throw new HttpErrors.BadRequest(`Invalid ISBN: ${ISBN}`);
        }
        const existingBook = await this.bookRepository.findOne({ where: { ISBN: ISBNNumber } });
        if (!existingBook) {
          throw new HttpErrors.NotFound(`Book with ISBN ${ISBN} not found`);
        }
        await this.bookRepository.delete(existingBook);
      }
      return { success: true };
    } catch (error) {
      if (error instanceof HttpErrors.BadRequest || error instanceof HttpErrors.NotFound) {
        return { success: false };
      } else {
        throw new HttpErrors.InternalServerError('An unexpected error occurred');
      }
    }
  }


}
