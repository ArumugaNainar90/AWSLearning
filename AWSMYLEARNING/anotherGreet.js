exports.anotherGreet = async (event) => {
    try {
        const body = JSON.parse(event.body)
        if (!body.name) {
            return {
                statusCode: 403,
                body: JSON.stringify({
                    message: 'name field is required'
                })
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: `Hi ${body.name} welcome`
            })
        }
    }
    catch (err) {
        return {
            statusCode: 500,
            body: JSON.stringify({
                error: err
            })
        }
    }
}