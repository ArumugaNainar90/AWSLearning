const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')

const dynamoClient = new DynamoDBClient({ region: process.env.REGION })
exports.confirmUpload = async (event) => {
    try {

        const TABLE_NAME = process.env.BANNER_TABLE_NAME
        const BUCKET_NAME = process.env.BUCKET_NAME
        const record = event.Records[0]

        const fileName = record.s3.object.key
        const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`

        const putItemCommand = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                fileName: { S: fileName },
                imageUrl: { S: imageUrl },
                updatedAt: { S: new Date().toISOString() }
            }
        })

        await dynamoClient.send(putItemCommand)

        return {
            statusCode: 200,
            msg: 'Image URL Inserted Successfully'
        }

    } catch (error) {
        return {
            statusCode: 500,
            msg: error.message
        }
    }
}