import nodemailer from 'nodemailer'
import 'dotenv/config'
import { ISummary } from '../@types'
function text(summary: ISummary[]): string {
  let text = '\n'
  summary.forEach((app) => {
    text = text + `\n - ${app.name} on ${app.network}`
  })
  text = 'The following services are down on:' + text
  return text
}
export default async function mail(
  downApps: ISummary[],
  test?: boolean
): Promise<string> {
  let testAccount
  try {
    test && (testAccount = await nodemailer.createTestAccount())

    const transporter = nodemailer.createTransport({
      host: test ? 'smtp.ethereal.email' : process.env.SMTP_HOST,
      port: test ? 587 : Number(process.env.SMTP_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: test ? testAccount.user : process.env.SMTP_USER,
        pass: test ? testAccount.pass : process.env.SMTP_PASS
      }
    })

    const info = await transporter.sendMail({
      from: '"Ocean Status Update 🐋" <status@oceanprotocol.com>', // sender address
      to: test ? 'test@oceanprotocol.com' : process.env.EMAIL,
      subject: 'Service Down',
      text: text(downApps)
    })

    console.log('Message sent: %s', info.messageId)

    // Preview only available when sending through an Ethereal test account
    test && console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

    return 'message sent'
  } catch (e) {
    console.log(`#: Failed to send notifications: ${e.message}`)
  }
  return 'failed to send'
}
