import { Body, Controller, HttpStatus, Logger, Post, Req, Res } from "@nestjs/common";
import { Response, Request } from 'express';
import { ContactConsultService } from "../services/contact-consult.service";
import { ResponseEncrypted } from "../../core/response/response.encrypted";

@Controller('v1/contacts')
export class ContactsV1Controller {

  private logger = new Logger(ContactsV1Controller.name)

  constructor(
    private readonly contactConsultService: ContactConsultService,
    private readonly responseEncrypted: ResponseEncrypted
  ) { }

  @Post('')
  async consult(
    @Body() contacts: string[],
    @Req() req: Request,
    @Res() res: Response,
  ) {
    this.logger.log("Call endpoint: (POST) v1/contacts");
    const contactsConsult = await this.contactConsultService.consult(contacts);

    return await this.responseEncrypted.encrypted({
      data: contactsConsult,
      request: req,
      response: res,
      httpStatus: HttpStatus.OK
    })
  }
}