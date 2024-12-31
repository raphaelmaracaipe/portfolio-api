import { INestApplication } from "@nestjs/common"
import { ContactConsultService } from "./contact-consult.service"
import { MongoRepository } from "typeorm"
import { User } from "src/core/models/user.model"
import { TestingModule, Test } from "@nestjs/testing"

describe('ContactConsultService', () => {
  let app: INestApplication
  let contactConsultService: ContactConsultService
  let userRepository: MongoRepository<User>

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UserRepository',
          useClass: MongoRepository,
        },
        ContactConsultService
      ]
    }).compile()

    app = moduleRef.createNestApplication();
    await app.init();

    userRepository = await moduleRef.get<MongoRepository<User>>('UserRepository')
    contactConsultService = await moduleRef.resolve(ContactConsultService)
  })

  it('when consult contacts but return list empty', async () => {
    jest.spyOn(userRepository, 'find').mockResolvedValue([])
    const users = await contactConsultService.consult([]);
    expect(users.length).toEqual(0);
  })

  afterEach(async () => {
    await app.close();
  })

 })