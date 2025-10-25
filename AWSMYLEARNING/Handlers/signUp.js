const { CognitoIdentityProviderClient, SignUpCommand } = require('@aws-sdk/client-cognito-identity-provider')

const client = new CognitoIdentityProviderClient({ region: process.env.REGION })
const userModel = require('../Models/userModel')
const CLIENT_ID = process.env.CLIENT_ID

exports.signUp = async (event) => {
    try {
        const { email, password, name } = JSON.parse(event.body)
        const input = {
            ClientId: CLIENT_ID,
            Username: email,
            Password: password,
            UserAttributes: [
                {
                    Name: "email",
                    Value: email,
                },
                {
                    Name: "name",
                    Value: name
                }
            ]
        };
        const command = new SignUpCommand(input);
        const response = await client.send(command);

        const usermodel = new userModel(email, name)
        await usermodel.save();

        console.log('response', JSON.stringify(response))
        return {
            statusCode: 200,
            body: JSON.stringify({
                msg: 'User Registered Successfully'
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                msg: 'Registeration Failed',
                error: error.message
            })
        }
    }
}
