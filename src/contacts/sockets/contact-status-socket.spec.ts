import { Test, TestingModule } from '@nestjs/testing';
import { ContactStatusSocket } from './contact-status-socket';
import { ContactStatusService } from '../services/contact-status.service';
import { Server } from 'socket.io';

describe('ContactStatusSocket', () => {
  let gateway: ContactStatusSocket;
  let contactStatusService: ContactStatusService;
  let server: Server;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ContactStatusSocket,
        {
          provide: ContactStatusService,
          useValue: {
            isOnline: jest.fn(),
            setStatus: jest.fn(),
          },
        },
        {
          provide: Server,
          useValue: {
            emit: jest.fn(),
          },
        },
      ],
    }).compile();

    gateway = module.get<ContactStatusSocket>(ContactStatusSocket);
    contactStatusService =
      module.get<ContactStatusService>(ContactStatusService);
    server = module.get<Server>(Server);
    (gateway as any).server = server; // Inject the mocked server
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });

  describe('status', () => {
    it('should emit isHeOnline event if contact is online', async () => {
      const phone = '123456789';
      jest.spyOn(contactStatusService, 'isOnline').mockResolvedValue(true);
      const emitSpy = jest.spyOn(server, 'emit');
      const logSpy = jest.spyOn(gateway['logger'], 'log');

      await gateway.status(phone);

      expect(emitSpy).toHaveBeenCalledWith(`isHeOnline${phone}`);
      expect(logSpy).toHaveBeenCalledWith(`Emitting event: isHeOnline${phone}`);
    });

    it('should emit status event if contact is offline', async () => {
      const phone = '123456789';
      jest.spyOn(contactStatusService, 'isOnline').mockResolvedValue(false);
      const emitSpy = jest.spyOn(server, 'emit');
      const logSpy = jest.spyOn(gateway['logger'], 'log');

      await gateway.status(phone);

      expect(emitSpy).toHaveBeenCalledWith(`status${phone}`);
      expect(logSpy).toHaveBeenCalledWith(`Emitting event: status${phone}`);
    });

    it('should log error if an exception occurs in status method', async () => {
      const phone = '123456789';
      const error = new Error('Something went wrong');
      jest.spyOn(contactStatusService, 'isOnline').mockRejectedValue(error);
      const errorSpy = jest.spyOn(gateway['logger'], 'error');

      await gateway.status(phone);

      expect(errorSpy).toHaveBeenCalledWith(
        `Error in checkStatus: ${error.message}`,
      );
    });
  });

  describe('iAmOnline', () => {
    it('should set status and emit isHeOnline event', async () => {
      const phone = '123456789';
      const setStatusSpy = jest
        .spyOn(contactStatusService, 'setStatus');
      const emitSpy = jest.spyOn(server, 'emit');
      const logSpy = jest.spyOn(gateway['logger'], 'log');

      await gateway.iAmOnline(phone);

      expect(setStatusSpy).toHaveBeenCalledWith(phone);
      expect(emitSpy).toHaveBeenCalledWith(`isHeOnline${phone}`);
      expect(logSpy).toHaveBeenCalledWith(`Emitting event: isHeOnline${phone}`);
    });
  });
});
