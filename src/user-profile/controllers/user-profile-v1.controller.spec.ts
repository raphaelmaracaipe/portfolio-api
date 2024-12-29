import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { UserProfileV1Controller } from "./user-profile-v1.controller";
import { Response, Request } from 'express';
import { MongoRepository } from "typeorm/repository/MongoRepository";
import { Codes } from "../../core/codes/codes";
import { ResponseEncrypted } from "../../core/response/response.encrypted";
import { LbCryptoService } from "@app/lb-crypto";
import { ConfigService } from "@nestjs/config";
import { ProfileInsertService } from "../services/profie-insert.service";
import { ProfileSavedService } from "../services/profile-saved.service";

describe('UserProfileV1Controller', () => {
  let app: INestApplication;
  let userProfileV1Controller: UserProfileV1Controller
  let profileInsertService: ProfileInsertService
  let profileSavedService: ProfileSavedService
  
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
        ProfileInsertService,
        ProfileSavedService,
        ConfigService,
        LbCryptoService,
        ResponseEncrypted,
        Codes
      ]
    }).compile()

    app = moduleRef.createNestApplication();
    await app.init();

    userProfileV1Controller = await moduleRef.resolve(UserProfileV1Controller)
    profileInsertService = await moduleRef.resolve(ProfileInsertService)
    profileSavedService = await moduleRef.resolve(ProfileSavedService)
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

  it('when insert profile', async () => {
    jest.spyOn(profileInsertService, 'insert').mockResolvedValue()

    await userProfileV1Controller.register({ name: '', photo: '', reminder: '' }, mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
  })

  afterEach(async () => {
    await app.close();
  });


})