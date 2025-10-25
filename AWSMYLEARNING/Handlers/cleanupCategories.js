const { DynamoDBClient, ScanCommand, DeleteItemCommand } = require('@aws-sdk/client-dynamodb');
const {SNSClient, PublishCommand} = require('@aws-sdk/client-sns');

const dynamoDBClient = new DynamoDBClient({ region: process.env.region })
const snsClient = new SNSClient({region: process.env.region})

exports.cleanupCategory = async () => {
    try {
        const TABLE_NAME = process.env.CATEGORY_TABLE_NAME
        const snsTopicArn = process.env.SNS_TOPIC

        const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();

        const scanCommand = new ScanCommand({
            TableName: TABLE_NAME,
            FilterExpression: "updatedAt < :oneHourAgo and attribute_not_exists(imageUrl)",
            ExpressionAttributeValues: {
                ":oneHourAgo": {S: oneHourAgo}
            }
        });

        const { Items } = await dynamoDBClient.send(scanCommand)

        console.log('Items', Items)

        const snsMessage = "clean up completed"

        // await snsClient.send(new PublishCommand({
        //     TopicArn : snsTopicArn,
        //     Message: snsMessage,
        //     Subject: 'Category CleanUp'
        // }))

        if (!Items || Items.length == 0) {
            return {
                statusCode: 200,
                msg: 'No Category older than one day'
            }
        }

        let deleteCount = 0
        for (const item of Items) {
            const deleteItemCommand = new DeleteItemCommand({
                TableName: TABLE_NAME,
                Key: { fileName: item.fileName}
            })

            await dynamoDBClient.send(deleteItemCommand)

            deleteCount++
        
        }
        console.log('cleanUp-Number of delete category', deleteCount)
        return {
            statusCode: 200,
            msg: 'Number of delete category older than 24 hours-' + deleteCount
        }
    }
    catch (err) {
        console.log('error-cleanUp', err)
        return {
            statusCode: 500,
            msg: err
        }
    }

}