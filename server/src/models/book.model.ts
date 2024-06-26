import {Entity, model, property} from '@loopback/repository';

@model()
export class Book extends Entity {
  @property({
    type: 'string',
    required: true,
  })
  title: string;

  @property({
    type: 'string',
    required: true,
  })
  author?: string;

  @property({
    type: 'string',
    required: true,
  })
  description: string;

  @property({
    type: 'number',
    required: true,
  })
  publicationYear: number;

  @property({
    type: 'string',
    required: true,
    pattern:'^[0-9]{13}$'
  })
  ISBN: number;

  @property({
    type: 'string',
    required: true,
  })
  genre: string;

  @property({
    type: 'string',
  })
  language?: string;

  @property({
    type: 'string',
    id: true,
    generated: true,
  })
  id?: string;


  constructor(data?: Partial<Book>) {
    super(data);
  }
}

export interface BookRelations {
}

export type BookWithRelations = Book & BookRelations;
