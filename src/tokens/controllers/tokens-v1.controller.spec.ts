import { HttpStatus, INestApplication } from "@nestjs/common";
import { Test, TestingModule } from "@nestjs/testing";
import { TokensServices } from "../services/tokens.service";
import { TokenV1Controller } from "./tokens-v1.controller";
import { Response, Request } from 'express';
import { LbBase64Service } from "@app/lb-base64";
import { LbJwtService } from "@app/lb-jwt";
import { LbKeysService } from "@app/lb-keys";
import { Codes } from "../../core/codes/codes";
import { MongoRepository } from "typeorm";
import { ResponseEncrypted } from "../../core/response/response.encrypted";
import { LbCryptoService } from "@app/lb-crypto";
import { ConfigService } from "@nestjs/config";

describe('TokenV1Controller', () => {
  let app: INestApplication;
  let tokensServices: TokensServices;
  let tokenV1Controller: TokenV1Controller;
  let responseEncrypted: ResponseEncrypted;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [
        TokenV1Controller
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
        TokensServices,
        Codes,
        LbJwtService,
        LbKeysService,
        LbBase64Service,
        LbCryptoService,
        ConfigService,
        ResponseEncrypted,
      ]
    }).compile()

    app = moduleRef.createNestApplication();
    await app.init();

    tokensServices = await moduleRef.resolve(TokensServices);
    tokenV1Controller = await moduleRef.resolve(TokenV1Controller);
    responseEncrypted = await moduleRef.resolve(ResponseEncrypted);
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

  it('when check token and return with success', async () => {
    jest.spyOn(tokensServices, 'valid').mockImplementation(() => Promise.resolve({
      accessToken: 'this is access token',
      refreshToken: 'this is refresh token'
    }))

    await tokenV1Controller.refresh({ refresh: 'refresh' }, mockRequest, mockResponse)
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.CREATED);
  })

  afterEach(async () => {
    await app.close();
  });

})