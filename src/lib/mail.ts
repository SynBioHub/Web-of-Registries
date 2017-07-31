import * as SendGrid from 'sendgrid';
import { Promise } from 'es6-promise';
import { Config } from './config';
import { UserInstance } from './db';

function sendMail(user: UserInstance, subject: string, message: string): Promise<any> {
    let config = new Config();
    let sendGridApiKey = config.get('sendgridApiKey');
    let from = config.get('fromAddress');

    let sg = SendGrid(sendGridApiKey.toString());
    let helper = SendGrid.mail;

    const fromEmail = new helper.Email(from.toString());
    const toEmail = new helper.Email(user.email.toString());
    const content = new helper.Content('text/plain', message.toString());
    const mail = new helper.Mail(fromEmail, subject, toEmail, content);

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    })

    return sg.API(request);
}

export { 
    sendMail 
};