const { CognitoIdentityProviderClient, InitiateAuthCommand } = require('@aws-sdk/client-cognito-identity-provider')

const client = new CognitoIdentityProviderClient({ region: process.env.REGION })
const CLIENT_ID = process.env.CLIENT_ID

exports.signIn = async (event) => {
    try {
        const { email, password } = JSON.parse(event.body)
        const input = {
            ClientId: CLIENT_ID,
            AuthFlow: 'USER_PASSWORD_AUTH',
            AuthParameters: {
                USERNAME: email,
                PASSWORD: password
            }
        };
        const command = new InitiateAuthCommand(input);
        const response = await client.send(command);

        console.log('response', JSON.stringify(response))
        return {
            statusCode: 200,
            body: JSON.stringify({
                msg: 'SignIn Successfully',
                token:  response.AuthenticationResult
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                msg: 'SignIn Failed',
                error: error.message
            })
        }
    }
}
