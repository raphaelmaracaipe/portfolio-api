import { Body, Controller, HttpStatus, Logger, Post, Req, Res } from "@nestjs/common";
import { Response, Request } from 'express';
import { ContactConsultService } from "../services/contact-consult.service";

@Controller('v1/contacts')
export class ContactsV1Controller {

  private logger = new Logger(ContactsV1Controller.name)

  constructor(
    private readonly contactConsultService: ContactConsultService
  ) { }

  @Post('')
  async consult(
    @Body() contacts: string[],
    @Res() res: Response,
  ) {
    this.logger.log("Call endpoint: (POST) v1/contacts");
    const contactsConsult = await this.contactConsultService.consult(contacts);
    return res.status(HttpStatus.OK).send(contactsConsult);
  }
}