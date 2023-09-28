import { INestApplication } from '@nestjs/common';
import { IndexController } from './index.controller';
import { Test } from '@nestjs/testing';

describe('IndexController', () => {
  let app: INestApplication;
  let indexController: IndexController;

  beforeEach(async () => {
    const moduleRef = await Test.createTestingModule({
      controllers: [IndexController],
    }).compile();

    app = moduleRef.createNestApplication();
    await app.init();

    indexController = await moduleRef.resolve(IndexController);
  });

  describe('Index', () => {
    it('When call endpoint index', () => {
      const returnOfEndpoint = indexController.getHello();
      expect(returnOfEndpoint).not.toEqual(undefined);
    });
  });

  afterEach(async () => {
    await app.close();
  });
});
