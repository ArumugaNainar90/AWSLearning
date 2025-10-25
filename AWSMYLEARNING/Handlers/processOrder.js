
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')

const dynamoClient = new DynamoDBClient({ region: process.env.REGION })
const {sendOrderEmail} = require('../Handlers/sendEmail')

exports.processOrder = async (event) => {
    try {

        const tableName = process.env.ORDER_TABLE_NAME
        for (const record of event.Records) {
            const { id, productId, quantity, email, status, createdAt } = JSON.parse(record.body)

            await dynamoClient.send(new PutItemCommand({
                TableName: tableName,
                Item: {
                    id: { S: id },
                    productId: { S: productId },
                    quantity: { N: quantity.toString() },
                    email: { S: email },
                    status: { S: status },
                    createdAt: { S: createdAt }
                }
            }))

            await sendOrderEmail(email,id)

            console.log('processOrder completed......')
            return {
                statusCode: 201,
                body: 'Order Inserted Successfully'
            }
        }
    }
    catch (err) {
        console.log('processOrder-error', err)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        }
    }
}