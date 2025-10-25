const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')

const s3Client = new S3Client({ region: process.env.REGION })
const dynamoClient = new DynamoDBClient({ region: process.env.REGION })

exports.insertCategory = async (event) => {
    try {
        const bucketName = process.env.CATEGORY_BUCKET_NAME;
        const { fileName, fileType, categoryName } = JSON.parse(event.body)
        const TABLE_NAME = process.env.CATEGORY_TABLE_NAME

        if (!fileName || !fileType || !categoryName) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "filename, filetype and categoryName are required" })
            }
        }
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            ContentType: fileType
        })
        const signedUrl = await getSignedUrl(s3Client, command, { expireIn: 3600 })

        const putItemCommand = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                fileName: { S: fileName },
                categoryName: { S: categoryName },
                updatedAt: { S: new Date().toISOString() }
            }
        })

        await dynamoClient.send(putItemCommand)

        return {
            statusCode: 200,
            body: JSON.stringify({ uploadUrl: signedUrl })
        }
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        }
    }
}