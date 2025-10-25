const { DynamoDBClient, UpdateItemCommand, ScanCommand } = require('@aws-sdk/client-dynamodb')

const dynamoClient = new DynamoDBClient({ region: process.env.REGION })
exports.updateProductImage = async (event) => {
    try {

        console.log('updateProductImage Called........')

        const TABLE_NAME = process.env.PRODUCT_TABLE_NAME
        const BUCKET_NAME = process.env.PRODUCT_BUCKET_NAME
        const record = event.Records[0]

        const fileName = record.s3.object.key
        const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`

        const scanCommand = new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: "fileName = :fileName",
            ExpressionAttributeValues: {
                ":fileName": { S: fileName }
            }
        })


        const scanResult = await dynamoClient.send(scanCommand)
        if (!scanResult || scanResult.Items.length == 0) {
            return {
                statusCode: 404,
                msg: JSON.stringify({ msg: 'product not found' })
            }
        }

        const productId = scanResult.Items[0].id.S

        const updateItemCommand = new UpdateItemCommand({
            TableName: TABLE_NAME,
            Key: { id: { S: productId } },
            UpdateExpression: "SET imageUrl= :imageUrl",
            ExpressionAttributeValues: {
                ":imageUrl": { S: imageUrl }
            }
        })

        await dynamoClient.send(updateItemCommand)

        return {
            statusCode: 200,
            msg: 'Image URL updated Successfully'
        }

    } catch (error) {
        console.log('updateProductImage Called1........', error)
        return {
            statusCode: 500,
            msg: error.message
        }
    }
}