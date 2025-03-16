export const asyncHandler = (fn) => {
    return async (req, res, next) => {
        try {
            await fn(req, res, next)
        } catch (error) {
            console.log("🔴 Async Handler Error:",error);
            res.status(200).json({
                message: error?.message,
                status: error.status || 500,
                success: 'false'
            })
        }
    }
}
