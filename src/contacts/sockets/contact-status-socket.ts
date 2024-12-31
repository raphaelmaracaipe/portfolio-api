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
  namespace: 'contact-status',
})
export class ContactStatusSocket {
  @WebSocketServer()
  private readonly server: Server;
  private readonly logger = new Logger(ContactStatusSocket.name);

  constructor(private readonly contactStatusService: ContactStatusService) {}

  @SubscribeMessage('checkStatus')
  async status(@MessageBody() data: string): Promise<void> {
    try {
      this.logger.log(`checkStatus called with data: ${data}`);

      const isOnline = await this.contactStatusService.isOnline(data);
      const event = isOnline ? `isHeOnline${data}` : `status${data}`;

      this.logger.log(`Emitting event: ${event}`);
      this.server.emit(event);
    } catch (error) {
      this.logger.error(`Error in checkStatus: ${error.message}`);
    }
  }

  @SubscribeMessage('iAmOnline')
  async iAmOnline(@MessageBody() phone: string): Promise<void> {
    try {
      this.logger.log(`iAmOnline called with phone: ${phone}`);
      await this.contactStatusService.setStatus(phone);
      this.logger.log(`Emitting event: isHeOnline${phone}`);
      this.server.emit(`isHeOnline${phone}`);
    } catch (error) {
      this.logger.error(`Error in iAmOnline: ${error.message}`);
    }
  }
}
