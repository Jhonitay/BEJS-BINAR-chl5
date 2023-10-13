const express = require('express')
// const bodyParser = require('body-parser');
const app = express()
require('dotenv').config()
const PORT = process.env.PORT || 3000
const router = require('./router')
const swaggerUi = require('swagger-ui-express')
const swaggerJson = require('./openAPI.json')

app.use(express.json({strict : false}))
app.use('/documentation',swaggerUi.serve,swaggerUi.setup(swaggerJson))
// app.use(bodyParser.json());
app.use('/api/v1',router)

app.listen(PORT,()=>{
    console.log(`server is running at PORT ${PORT}`)
})