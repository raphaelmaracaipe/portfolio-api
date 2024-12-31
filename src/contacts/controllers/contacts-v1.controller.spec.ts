import { HttpStatus, INestApplication } from "@nestjs/common";
import { ContactsV1Controller } from "./contacts-v1.controller";
import { ContactConsultService } from "../services/contact-consult.service";
import { Test, TestingModule } from "@nestjs/testing";
import { MongoRepository } from "typeorm";
import { ResponseEncrypted } from "../../core/response/response.encrypted";
import { Response, Request } from 'express';
import { LbCryptoService } from "@app/lb-crypto";
import { ConfigService } from "@nestjs/config";

describe('ContactsV1Controller', () => {
  let app: INestApplication
  let contactsV1Controller: ContactsV1Controller
  let contactConsultService: ContactConsultService

  const mockResponse: Response = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn(),
  } as any;

  const mockRequest: Request = {
    headers: {
      device_id: 'AAA',
    },
  } as any;

  beforeEach(async () => {
    const moduleRef: TestingModule = await Test.createTestingModule({
      controllers: [
        ContactsV1Controller
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
        ContactConsultService,
        ResponseEncrypted,
        ConfigService,
        LbCryptoService
      ]
    }).compile()

    app = moduleRef.createNestApplication();
    await app.init();

    contactsV1Controller = await moduleRef.resolve(ContactsV1Controller);
    contactConsultService = await moduleRef.resolve(ContactConsultService);
  });

  it('when consult contact sent and return datas', async () => {
    jest.spyOn(contactConsultService, 'consult').mockResolvedValue([{ name: 'name te', phone: 'aa', photo: 'cc' }]);

    await contactsV1Controller.consult([], mockRequest, mockResponse);
    expect(mockResponse.status).toHaveBeenCalledWith(HttpStatus.OK);
  });

  afterEach(async () => {
    await app.close();
  });

});