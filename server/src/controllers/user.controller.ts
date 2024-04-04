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
  response
} from '@loopback/rest';
import {User} from '../models';
import {UserRepository} from '../repositories';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

export class UserController {
  constructor(
    @repository(UserRepository)
    public userRepository : UserRepository,
  ) {}

  @post('/users/signUp')
  async create(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              title: 'NewUser',
              exclude: ['id'],
            }),
          },
        },
      }) user: { password: string; email: string },
  ): Promise<{ success: boolean }> {
    const existingUser = await this.userRepository.findOne({
      where: { email: user.email },
    });
    if (existingUser) {
      return {success:false};
    }
    user.password = await bcrypt.hash(user.password, 10);
    await this.userRepository.create(user);
    return { success: true };
  }

  @post('/users/login')
  @response(200, {
    description: 'User model instance',
    content: {'application/json': {schema: getModelSchemaRef(User)}},
  })
  async login(
      @requestBody({
        content: {
          'application/json': {
            schema: getModelSchemaRef(User, {
              title: 'LoginUser', // Rename to LoginUser
              exclude: ['id', 'name'], // Exclude id and name properties
            }),
          },
        },
      }) userData: { password: string; email: string },
  ): Promise<{success:boolean, token:any, user:any}> {
    try{
      const user = await this.userRepository.findOne({where: {email: userData.email}});
      if (!user) {
        throw new Error('User not found');
      }
      const passwordMatch = await bcrypt.compare(userData.password, user.password);
      if (!passwordMatch) {
        throw new Error('Incorrect password');
      }
      const token = jwt.sign({ userId: user.email }, 'your-secret-key', {
        expiresIn: '24h',
      });
      const { password, ...userWithoutPassword } = user;
      return { success: true, token:token, user: userWithoutPassword };
    }
    catch (err){
      return {success:false, token:null, user:null};
    }
  }
  @get('/users/count')
  @response(200, {
    description: 'User model count',
    content: {'application/json': {schema: CountSchema}},
  })
  async count(
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.count(where);
  }

  @get('/users')
  @response(200, {
    description: 'Array of User model instances',
    content: {
      'application/json': {
        schema: {
          type: 'array',
          items: getModelSchemaRef(User, {includeRelations: true}),
        },
      },
    },
  })
  async find(
    @param.filter(User) filter?: Filter<User>,
  ): Promise<User[]> {
    console.log(filter);
    return this.userRepository.find(filter);
  }



  @patch('/users')
  @response(200, {
    description: 'User PATCH success count',
    content: {'application/json': {schema: CountSchema}},
  })
  async updateAll(
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
    @param.where(User) where?: Where<User>,
  ): Promise<Count> {
    return this.userRepository.updateAll(user, where);
  }

  @get('/users/{id}')
  @response(200, {
    description: 'User model instance',
    content: {
      'application/json': {
        schema: getModelSchemaRef(User, {includeRelations: true}),
      },
    },
  })
  async findById(
    @param.path.string('id') id: string,
    @param.filter(User, {exclude: 'where'}) filter?: FilterExcludingWhere<User>
  ): Promise<User> {
    return this.userRepository.findById(id, filter);
  }

  @patch('/users/{id}')
  @response(204, {
    description: 'User PATCH success',
  })
  async updateById(
    @param.path.string('id') id: string,
    @requestBody({
      content: {
        'application/json': {
          schema: getModelSchemaRef(User, {partial: true}),
        },
      },
    })
    user: User,
  ): Promise<void> {
    await this.userRepository.updateById(id, user);
  }

  @put('/users/{id}')
  @response(204, {
    description: 'User PUT success',
  })
  async replaceById(
    @param.path.string('id') id: string,
    @requestBody() user: User,
  ): Promise<void> {
    await this.userRepository.replaceById(id, user);
  }

  @del('/users/{id}')
  @response(204, {
    description: 'User DELETE success',
  })
  async deleteById(@param.path.string('id') id: string): Promise<void> {
    await this.userRepository.deleteById(id);
  }
}
