const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb')

const dynamoClient = new DynamoDBClient({ region: process.env.REGION })

exports.getAllCategories = async () => {

    try {
        const tableName = process.env.PRODUCT_TABLE_NAME

        const scanCommand = new ScanCommand({
            TableName: tableName
        });

        const { Items } = await dynamoClient.send(scanCommand)

        if (!Items || Items.length == 0) {
            return {
                statusCode: 404,
                body: 'categories not found'
            }
        }

        let categories = Items.map(m => m.category)

        console.log('getAllCategories-items', Items)

        return {
            statusCode: 200,
            body: JSON.stringify({ category: categories || [] })
        }
    }
    catch (err) {
        console.log('getAllCategories-error', err)
        return {
            statusCode: 500,
            body: err
        }
    }

}