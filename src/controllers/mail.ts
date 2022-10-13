import nodemailer from 'nodemailer'
import 'dotenv/config'

export default async function mail(
  downApps: string[],
  network: string,
  test?: boolean
): Promise<string> {
  let testAccount
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
    to: process.env.EMAIL,
    subject: 'Service Down',
    text: `The following services are down on ${network}:\n - ${downApps
      .toString()
      .replace(/,/g, '\n- ')}`
  })

  console.log('Message sent: %s', info.messageId)

  // Preview only available when sending through an Ethereal test account
  test && console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))

  return 'message sent'
}
