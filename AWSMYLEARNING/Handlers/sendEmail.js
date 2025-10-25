const {SESClient, SendEmailCommand} = require('@aws-sdk/client-ses')

const sesClient = new SESClient({region: process.env.REGION})

exports.sendOrderEmail = async(toEmail, orderId, productName) => {
    console.log('sendOrderEmail called....')
  const emailParams = {
    Source : "arnainar@gmail.com",
    Destination: {
        ToAddresses: [toEmail]
    },
    Message: {
        Subject: {
            Data: 'Your Order Confirmation'
        },
        Body: {
            Text: {
                Data: 'Thank you for your order Id-' + orderId
            }
        }
    }
  }
  try{
    const command = new SendEmailCommand(emailParams)
    const resp = await sesClient.send(command)
    console.log('sendOrderEmail called1....', resp)
  }
  catch(err){
        console.log('sendOrderEmail-err', err)
        throw new Error(err)
  }
}