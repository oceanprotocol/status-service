import nodemailer from 'nodemailer'

export default async function mail(test?: boolean) {
  console.log('Mail test: ', true)
  console.log('Host: ', test ? 'smtp.ethereal.email' : process.env.SMTP_HOST)
  let testAccount
  if (test === true) testAccount = await nodemailer.createTestAccount()

  //   const transporter = nodemailer.createTransport({
  //     host: 'smtp.ethereal.email',
  //     port: 587,
  //     secure: false, // true for 465, false for other ports
  //     auth: {
  //       user: testAccount.user, // generated ethereal user
  //       pass: testAccount.pass // generated ethereal password
  //     }
  //   })
  const transporter = nodemailer.createTransport({
    host: test ? 'smtp.ethereal.email' : process.env.SMTP_HOST,
    port: test ? 587 : Number(process.env.SMTP_PORT),
    secure: false, // true for 465, false for other ports
    auth: {
      user: test ? testAccount.user : process.env.SMTP_USER,
      pass: test ? testAccount.pass : process.env.SMTP_PASS
    }
  })

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: '"Fred Foo 👻" <foo@example.com>', // sender address
    to: process.env.EMAIL, // list of receivers
    subject: 'Hello ✔', // Subject line
    text: 'Hello world?', // plain text body
    html: '<b>Hello world?</b>' // html body
  })

  console.log('Message sent: %s', info.messageId)

  // Preview only available when sending through an Ethereal test account
  test && console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info))
}
