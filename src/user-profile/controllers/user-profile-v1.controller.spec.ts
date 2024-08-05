import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserProfileV1Controller } from "./user-profile-v1.controller";
import { ProfileService } from "../services/profie.service";
import { Response, Request } from 'express';
import { MongoRepository } from "typeorm/repository/MongoRepository";
import { Codes } from "../../core/codes/codes";
import { ResponseEncrypted } from "../../core/response/response.encrypted";
import { LbCryptoService } from "@app/lb-crypto";
import { ConfigService } from "@nestjs/config";

describe('UserProfileV1Controller', () => {
  let app: INestApplication;
  let userProfileV1Controller: UserProfileV1Controller
  let profileService: ProfileService

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [
        UserProfileV1Controller
      ],
      providers: [
        {
          provide: 'UserRepository',
          useClass: MongoRepository,
        },
        {
          provide: 'KeyRepository',
          useClass: MongoRepository,
        },
        ProfileService,
        ConfigService,
        LbCryptoService,
        ResponseEncrypted,
        Codes
      ]
    }).compile()

    app = moduleRef.createNestApplication();
    await app.init();

    userProfileV1Controller = await moduleRef.resolve(UserProfileV1Controller)
    profileService = await moduleRef.resolve(ProfileService)
  })

  const mockResponse: Response = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as any;

  const mockRequest: Request = {
    headers: {
      device_id: 'AAA',
    },
  } as any;

  it('a', async () => {
    jest.spyOn(profileService, 'insert').mockResolvedValue()

    await userProfileV1Controller.register({ name: '', photo: '' }, mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
  })

  afterEach(async () => {
    await app.close();
  });


})