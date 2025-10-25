
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')
const {SQSClient, SendMessageCommand} = require('@aws-sdk/client-sqs')
const crypto = require('crypto')

const dynamoClient = new DynamoDBClient({ region: process.env.REGION })
const sqsClient = new SQSClient({ region: process.env.REGION })

exports.insertOrder = async (event) => {
    try {
        
        const { productId, quantity, email  } = JSON.parse(event.body)
        const TABLE_NAME = process.env.PRODUCT_TABLE_NAME

        if (!productId || !quantity || !email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "All fields are required" })
            }
        }

        const orderId = crypto.randomUUID().toString();
        const orderPayload = {
            id: orderId,
            productId,
            quantity,
            email,
            status: "Pending",
            createdAt: new Date().toISOString()
        }

        const sendmessage = new SendMessageCommand({
                QueueUrl: process.env.ORDER_QUEUE_URL,
                MessageBody: JSON.stringify(orderPayload)
            })

        await sqsClient.send(sendmessage)

        return {
            statusCode: 201,
            body: 'Message Queue Successfully'
        }
    }
    catch (err) {
        console.log('insertOrder-error', err)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        }
    }
}