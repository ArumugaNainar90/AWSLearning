const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const { getSignedUrl } = require('@aws-sdk/s3-request-presigner');
const { DynamoDBClient, PutItemCommand } = require('@aws-sdk/client-dynamodb')
const crypto = require('crypto')

const s3Client = new S3Client({ region: process.env.REGION })
const dynamoClient = new DynamoDBClient({ region: process.env.REGION })

exports.insertProduct = async (event) => {
    try {
        const bucketName = process.env.PRODUCT_BUCKET_NAME;
        const { fileName, fileType, category, productName, productPrice, quantity, description, email  } = JSON.parse(event.body)
        const TABLE_NAME = process.env.PRODUCT_TABLE_NAME

        if (!fileName || !fileType || !category || !productName || !productPrice || !quantity || !description || !email) {
            return {
                statusCode: 400,
                body: JSON.stringify({ error: "All fields are required" })
            }
        }
        const command = new PutObjectCommand({
            Bucket: bucketName,
            Key: fileName,
            ContentType: fileType
        })
        const signedUrl = await getSignedUrl(s3Client, command, { expireIn: 3600 })

        const productId = crypto.randomUUID().toString();
        const putItemCommand = new PutItemCommand({
            TableName: TABLE_NAME,
            Item: {
                id: {S: productId},
                fileName: { S: fileName },
                category: { S: category },
                productName: { S: productName },
                productPrice: { N: productPrice.toString() },
                quantity: { N: quantity.toString() },
                description: { S: description },
                email: { S: email },
                approved: {BOOL: false},
                createdAt: { S: new Date().toISOString() }
            }
        })

     //   console.log('input', 'productId-'+productId+'fileName-'+fileName+'category-'+category+'productName-'+productName+'productPrice-'+productPrice+'quantity-'+quantity+'description-'+description)

        await dynamoClient.send(putItemCommand)

        return {
            statusCode: 201,
            body: JSON.stringify({ uploadUrl: signedUrl })
        }
    }
    catch (err) {
        console.log('insertProduct-error', err)
        return {
            statusCode: 500,
            body: JSON.stringify({ error: err.message })
        }
    }
}