class apiResponce{
    constructor(
        statusCode,
        message,
        data
    )
    {
        this.statusCode = statusCode;
        this.message = message,
        this.success = true,
        this.data = data
    }
}

export {apiResponce}