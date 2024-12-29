import { Logger } from '@nestjs/common';
import {
  MessageBody,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server } from 'socket.io';
import { ContactStatusService } from '../services/contact-status.service';

@WebSocketGateway(3001, {
  namespace: 'contact-status'
})
export class ContactStatusSocket {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(ContactStatusSocket.name);

  constructor(private readonly contactStatusService: ContactStatusService) {}

  @SubscribeMessage('checkStatus')
  async status(@MessageBody() data: string) {
    this.logger.log('called socket');
    this.logger.log(data);

    if (await this.contactStatusService.isOnline(data)) {
      this.logger.warn('Status of contact saved in cache, emmit event');
      this.server.emit(`isHeOnline${data}`);
      return;
    }

    this.logger.log('Contact not saved in cache, emmit event');
    this.server.emit(`status${data}`);
  }

  @SubscribeMessage('iAmOnline')
  async iAmOnline(@MessageBody() phone: string) {
    this.logger.log('called socket');
    await this.contactStatusService.setStatus(phone);
    this.server.emit(`isHeOnline${phone}`);
  }
}
