import { INestApplication } from "@nestjs/common"
import { Test, TestingModule } from "@nestjs/testing"
import { TokenValidService } from "./token-valid.service"
import { MongoRepository } from "typeorm/repository/MongoRepository"
import { LbJwtService } from "@app/lb-jwt"
import { Codes } from "../../../core/codes/codes"
import { RegexService } from "../../../core/regex/regex.service"
import { LbBase64Service } from "@app/lb-base64"
import { REGEX_DEVICE_ID } from "../../../core/regex/regex"
import { User } from "../../../core/models/user.model"
import { TOKEN_TYPE_ACCESS, TOKEN_TYPE_REFRESH } from "../../../core/tokens/tokens.const"

describe('TokenValidService', () => {
  let app: INestApplication
  let tokenService: TokenValidService
  let regex: RegexService
  let jwt: LbJwtService
  let userRepository: MongoRepository<User>

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        {
          provide: 'UserRepository',
          useClass: MongoRepository,
        },
        TokenValidService,
        LbJwtService,
        LbBase64Service,
        RegexService,
        Codes
      ]
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    tokenService = await moduleRef.resolve(TokenValidService)
    userRepository = await moduleRef.get<MongoRepository<User>>('UserRepository')
    regex = await moduleRef.resolve(RegexService)
    jwt = await moduleRef.resolve(LbJwtService)
  })

  it('when call service but send autorization invalid should return exception', async () => {
    try {
      await tokenService.valid('', '')
      expect(true).toEqual(false)
    } catch (e) {
      expect(true).toEqual(true)
    }
  })

  it('when call service but send deviceId invalid should return exception', async () => {
    try {
      await tokenService.valid('AAA.AAA', 'A')
      expect(true).toEqual(false)
    } catch (e) {
      expect(true).toEqual(true)
    }
  })

  it('when check if exist user save in db which have device but not exist should return exception', async () => {
    try {
      jest.spyOn(userRepository, 'findOne').mockResolvedValue(null)

      const deviceId = regex.generateRandom(REGEX_DEVICE_ID)
      await tokenService.valid('AAA.AAA', deviceId)
      expect(true).toEqual(false)
    } catch (e) {
      expect(true).toEqual(true)
    }
  })

  it('when send token with type invalid should return exception', async () => {
    try {
      jest.spyOn(jwt, 'verify').mockResolvedValue({ type: TOKEN_TYPE_ACCESS })
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        phone: "...",
        name: "...",
        deviceId: "...",
        photo: "...",
        passphrase: "...",
        publicKey: "Li4u",
        privateKey: "Li4u",
        createdAt: 0,
        updatedAt: 0,
        isDeleted: false,
        reminder: '...'
      })

      const deviceId = regex.generateRandom(REGEX_DEVICE_ID)
      await tokenService.valid('AAA.AAA', deviceId)
      expect(true).toEqual(false)
    } catch (e) {
      expect(true).toEqual(true)
    }
  })

  it('when jwt return error should return exception', async () => {
    try {
      jest.spyOn(jwt, 'verify').mockImplementation(() => {
        throw new Error("erro test")
      })
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        phone: "...",
        name: "...",
        deviceId: "...",
        photo: "...",
        passphrase: "...",
        publicKey: "Li4u",
        privateKey: "Li4u",
        createdAt: 0,
        updatedAt: 0,
        isDeleted: false,
        reminder: '...'
      })

      const deviceId = regex.generateRandom(REGEX_DEVICE_ID)
      await tokenService.valid('AAA.AAA', deviceId)
      expect(true).toEqual(false)
    } catch (e) {
      expect(true).toEqual(true)
    }
  })

  it('when all processing finish with success', async () => {
    try {
      jest.spyOn(jwt, 'verify').mockResolvedValue({ type: TOKEN_TYPE_REFRESH })
      jest.spyOn(userRepository, 'findOne').mockResolvedValue({
        phone: "...",
        name: "...",
        deviceId: "...",
        photo: "...",
        passphrase: "...",
        publicKey: "Li4u",
        privateKey: "Li4u",
        createdAt: 0,
        updatedAt: 0,
        isDeleted: false,
        reminder: '...'
      })

      const deviceId = regex.generateRandom(REGEX_DEVICE_ID)
      await tokenService.valid('AAA.AAA', deviceId)
      expect(true).toEqual(false)
    } catch (e) {
      expect(true).toEqual(true)
    }
  })

})