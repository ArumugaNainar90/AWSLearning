const {DynamoDBClient, PutItemCommand} = require('@aws-sdk/client-dynamodb')
const crypto = require('crypto')

const TABLE_NAME = "Users"

const dynamoClient = new DynamoDBClient({region: process.env.REGION})

class UserModel {
    constructor(email, fullName){
       this.userId = crypto.randomUUID()
       this.email = email
       this.fullName = fullName
       this.state = ""
       this.city = ""
       this.locality = ""
       this.createdAt = new Date().toISOString();
    }

    // save user details to dynamo

    async save(){
        const param = {
            TableName : TABLE_NAME,
            Item : {
                userId : {S: this.userId},
                email : {S: this.email},
                fullName : {S: this.fullName},
                state : {S: this.state},
                city : {S: this.city},
                locality : {S: this.locality},
                createdAt : {S: this.createdAt}
            }
        }

        try 
        {
           await dynamoClient.send(new PutItemCommand(param))
        }
        catch(err){
            console.log('err', err)
            throw err
        }
    }
}

module.exports = UserModel

