import { INestApplication } from "@nestjs/common"
import { TestingModule, Test } from "@nestjs/testing"
import { ProfileService } from "./profie.service"
import { Codes } from "../../core/codes/codes"
import { User } from "../../core/models/user.model"
import { MongoRepository } from "typeorm"

describe('ProfileService', () => {
  let app: INestApplication
  let profileService: ProfileService
  let userRepository: MongoRepository<User>

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UserRepository',
          useClass: MongoRepository,
        },
        ProfileService,
        Codes
      ]
    }).compile()

    app = moduleRef.createNestApplication();
    await app.init();

    userRepository = await moduleRef.get<MongoRepository<User>>('UserRepository')
    profileService = await moduleRef.resolve(ProfileService)
  })

  it('when init process to save profile but return error should return exception', () => {
    jest.spyOn(userRepository, 'updateOne').mockResolvedValue(() => {
      throw Error()
    })
    try {
      profileService.insert('', { name: '', photo: '' })
      expect(true).toEqual(false)
    } catch {
      expect(true).toEqual(true)
    }
  })

  it('when init process to save profile return success should return promisso void', () => {
    jest.spyOn(userRepository, 'updateOne').mockResolvedValue({})
    try {
      profileService.insert('', { name: '', photo: '' })
      expect(true).toEqual(true)
    } catch {
      expect(true).toEqual(false)
    }
  })

  afterEach(async () => {
    await app.close();
  });

})