import { SendGrid.SendGrid, Helper } from 'sendgrid';
import { Config } from './config';
import { UserInstance } from './db';

function sendMail(user: UserInstance, subject: string, message: string) {
    let config = new Config();
    let sendGridApiKey = config.get('sendGridApiKey');
    
    if(typeof sendGridApiKey !== 'string') {
        return
    }

    let sg = SendGrid(sendGridApiKey);

    const fromEmail = new helper.Email(config.get('mail').fromAddress)
    const toEmail = new helper.Email(user.email)
    const content = new helper.Content('text/plain', message)
    const mail = new helper.Mail(fromEmail, subject, toEmail, content)

    var request = sg.emptyRequest({
      method: 'POST',
      path: '/v3/mail/send',
      body: mail.toJSON()
    })

    return new Promise((resolve, reject) => {

        sg.API(request, (err, response) => {

            if(err) {
                reject(err)
            } else {
                resolve(response)
            }

        })
    })
}

export { 
    sendMail 
};