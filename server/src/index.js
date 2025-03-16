import dotenv from 'dotenv'
import { connectDb } from './Db/index.js'
import { app } from './app.js'

dotenv.config({
    path: '.env'
})

connectDb()
.then(() => {
    app.on("error", (error) => {
        console.error(error);
    })
    app.listen(process.env.PORT || 5000, () => {
        console.log(`Server is running on port ${process.env.PORT || 5000}`)
    })
})