const { DynamoDBClient, UpdateItemCommand } = require('@aws-sdk/client-dynamodb')

const dynamoClient = new DynamoDBClient({ region: process.env.REGION })
exports.updateCategoryImage = async (event) => {
  try {

    console.log('updateCategoryImage Called........')
  
          const TABLE_NAME = process.env.CATEGORY_TABLE_NAME
          const BUCKET_NAME = process.env.CATEGORY_BUCKET_NAME
          const record = event.Records[0]
  
          const fileName = record.s3.object.key
          const imageUrl = `https://${BUCKET_NAME}.s3.amazonaws.com/${fileName}`
  
          const updateItemCommand = new UpdateItemCommand({
              TableName: TABLE_NAME,
              Key: {fileName: {S: fileName}},
              UpdateExpression: "SET imageUrl= :imageUrl",
              ExpressionAttributeValues: {
                ":imageUrl": {S:imageUrl}
              }
          })
  
          await dynamoClient.send(updateItemCommand)
  
          return {
              statusCode: 200,
              msg: 'Image URL updated Successfully'
          }
  
      } catch (error) {
        console.log('updateCategoryImage Called1........', error)
          return {
              statusCode: 500,
              msg: error.message
          }
      }
}