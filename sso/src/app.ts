import 'dotenv/config'
import Koa from 'koa'
// import ejs from 'koa-ejs'
// import path from 'path'
import cors from '@koa/cors'
import helmet from 'koa-helmet'
import { HttpMethodEnum, koaBody } from 'koa-body'
import yamljs from 'yamljs'
import { koaSwagger } from 'koa2-swagger-ui'
import * as Routes from './routes'
import { errorMiddleware } from './middleware/errorMiddleware'
import { generateOpenapiFile } from './openapi/generateFile'
import { openapiFilename, swaggeruiUrl } from './openapi/config'
import { swaggeruiCSPMiddleware } from './middleware/swaggeruiCSPMiddleware'
import { appConfig } from './config/index'
import { client } from './models/db'

const app = new Koa()

app.use(cors())
app.use(helmet())
app.use(
  koaBody({
    parsedMethods: [
      HttpMethodEnum.POST,
      HttpMethodEnum.PUT,
      HttpMethodEnum.PATCH,
      HttpMethodEnum.DELETE,
    ],
  })
)
app.use(errorMiddleware)

// Template engine setup
// ejs(app, {
//   root: path.resolve(__dirname, './views'),
//   layout: false,
//   viewExt: 'ejs',
//   cache: false,
//   debug: false,
// })

// app.use(async (ctx) => {
//   await ctx.render('index', {
//     title: 'Molt bona nit',
//   })
// })

// Routes
app.use(Routes.authRoutes.routes())
app.use(Routes.tokenRoutes.routes())
app.use(Routes.itineraryRoutes.routes())

// Swagger UI
app.use(swaggeruiCSPMiddleware)
generateOpenapiFile()
const spec = yamljs.load(openapiFilename)
app.use(koaSwagger({ routePrefix: swaggeruiUrl, swaggerOptions: { spec } }))
client
  .connect()
  .then(() => {
    if (process.env.NODE_ENV !== 'test') {
      app.listen(appConfig.port, () => {
        // eslint-disable-next-line no-console
        console.log(`🚀 Server ready at http://localhost:${appConfig.port}`)
      })
    }
  })
  .catch((error: unknown) =>
    // eslint-disable-next-line no-console
    console.error('Unable to connect to the database:', error)
  )

export { app }
