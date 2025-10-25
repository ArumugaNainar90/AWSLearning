const { CognitoIdentityProviderClient, ConfirmSignUpCommand } = require('@aws-sdk/client-cognito-identity-provider')
const client = new CognitoIdentityProviderClient({ region: process.env.REGION })
const CLIENT_ID = process.env.CLIENT_ID

exports.confirmSignUp = async (event) => {
    try {
        const { email, signUpCode } = JSON.parse(event.body)
        const input = {
            ClientId: CLIENT_ID,
            Username: email,
            ConfirmationCode: signUpCode
        };
        const command = new ConfirmSignUpCommand(input);
        const response = await client.send(command);

        console.log('response', JSON.stringify(response))
        return {
            statusCode: 200,
            body: JSON.stringify({
                msg: 'User Successfully Confirmed!!'
            })
        }
    } catch (error) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                msg: 'Confirmation Failed',
                error: error.message
            })
        }
    }
}
