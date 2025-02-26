import Koa, { Middleware } from 'koa'
import jwt, { Secret } from 'jsonwebtoken'
import slugify from 'slugify'
import { prisma } from '../../prisma/client'
import { MissingParamError } from '../../helpers/errors'

export const createResource: Middleware = async (ctx: Koa.Context) => {
  const token = ctx.cookies.get('token') as string
  const { userId } = jwt.verify(token, process.env.JWT_KEY as Secret) as {
    userId: string
  }
  const resource = ctx.request.body

  const slug = slugify(resource.title, { lower: true })
  const { categoryId } = resource as { categoryId: string }
  const topicIds: string[] = resource.topics

  if (topicIds.length === 0) throw new MissingParamError('topics')

  const databaseTopics = await prisma.topic.findMany({
    where: {
      id: {
        in: topicIds,
      },
    },
  })

  if (topicIds.length !== databaseTopics.length)
    throw new MissingParamError('valid topic/s')

  resource.topics = {
    create: resource.topics.map((topicId: string) => ({
      topic: {
        connect: {
          id: topicId,
        },
      },
    })),
  }

  await prisma.resource.create({
    data: { ...resource, userId, categoryId, slug },
  })

  ctx.status = 204
}
