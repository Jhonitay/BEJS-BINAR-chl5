const express = require('express'),
    app = express(),
    PORT = process.env.PORT || 4000,
    router = require('./routers/index'),
    swaggerUi = require('swagger-ui-express'),
    swaggerJson = require('./openAPI.json'),
    cors = require('cors')

require('dotenv').config()

app.use(express.json({strict : false}))
app.use(cors())
app.use('/api/v1',router)
app.use('/documentation',swaggerUi.serve,swaggerUi.setup(swaggerJson))
//handle 404 
app.get('*', (req, res) => {
    return res.status(404).json({
        error: 'End point is not registered'
    })
})

app.listen(PORT,()=>{
    console.log(`server is running at PORT ${PORT}`)
})