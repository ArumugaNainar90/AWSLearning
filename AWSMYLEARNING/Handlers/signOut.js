const { CognitoIdentityProviderClient, GlobalSignOutCommand } = require('@aws-sdk/client-cognito-identity-provider')

const client = new CognitoIdentityProviderClient({ region: process.env.REGION })
const CLIENT_ID = process.env.CLIENT_ID

exports.signOut = async (event) => {
    try {
        const { accessToken } = JSON.parse(event.body)
        const input = {
            AccessToken: accessToken
        };
        const command = new GlobalSignOutCommand(input);
        const response = await client.send(command);

        console.log('response', JSON.stringify(response))
        return {
            statusCode: 200,
            body: JSON.stringify({
                msg: 'User Successfully signed out',
                token:  response.AuthenticationResult
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                msg: 'SignOut Failed',
                error: error.message
            })
        }
    }
}
