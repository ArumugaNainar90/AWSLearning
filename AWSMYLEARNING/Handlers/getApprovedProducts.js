const { DynamoDBClient, ScanCommand } = require('@aws-sdk/client-dynamodb')

const dynamoClient = new DynamoDBClient({ region: process.env.REGION })

exports.getApprovedProducts = async () => {

    try {
        const tableName = process.env.PRODUCT_TABLE_NAME

        const scanCommand = new ScanCommand({
            TableName: tableName,
            FilterExpression: "approved = :trueVal",
            ExpressionAttributeValues: {
                ":trueVal": { BOOL: true }
            }
        });        

        console.log('called1.......')

        
        const { Items } = await dynamoClient.send(scanCommand)
        

        console.log('getApprovedProducts-items', Items)
        //console.log('getApprovedProducts-data', data)

        return {
            statusCode: 200,
            body: JSON.stringify({ products: Items || [] })
        }
    }
    catch (err) {
        console.log('getApprovedProducts-error', err)
        return {
            statusCode: 500,
            body: err
        }
    }

}