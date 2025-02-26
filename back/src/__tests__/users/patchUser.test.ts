import supertest from 'supertest'
import { expect, it, describe, afterEach, beforeEach } from 'vitest'
import { USER_ROLE, USER_STATUS, User } from '@prisma/client'
import { server, testUserData } from '../globalSetup'
import { prisma } from '../../prisma/client'
import { pathRoot } from '../../routes/routes'
import { authToken } from '../setup'
import { checkInvalidToken } from '../helpers/checkInvalidToken'
import { userPatchSchema } from '../../schemas'

let sampleUser: User | null

beforeEach(async () => {
  const existingTestCategory = await prisma.category.findUnique({
    where: { name: 'Testing' },
  })
  sampleUser = await prisma.user.create({
    data: {
      email: 'sampleUser1@sampleUser.com',
      name: 'sampleUser1',
      dni: '99999999Z',
      password: 'samplePassword1',
      role: USER_ROLE.REGISTERED,
      status: USER_STATUS.ACTIVE,
      specializationId: existingTestCategory!.id,
    },
  })
})

afterEach(async () => {
  await prisma.user.deleteMany({
    where: {
      OR: [
        { email: 'sampleUser1@sampleUser.com' },
        { email: 'sampleUser2@sampleUser.com' },
      ],
    },
  })
})

describe('Testing user patch endpoint', () => {
  it('Should return error if no token is provided', async () => {
    const response = await supertest(server).patch(`${pathRoot.v1.users}`)
    expect(response.status).toBe(401)
    expect(response.body.message).toBe('Missing token')
  })
  it('Check invalid token', async () => {
    checkInvalidToken(`${pathRoot.v1.users}`, 'patch', {
      id: sampleUser!.id,
      role: USER_ROLE.MENTOR,
    })
  })

  it('Should NOT be able to access if user level is not ADMIN', async () => {
    const response = await supertest(server)
      .patch(`${pathRoot.v1.users}`)
      .set('Cookie', authToken.mentor)
    expect(response.status).toBe(403)
  })
  it('An ADMIN user should be able to access the endpoint without updating the user', async () => {
    const modifiedUser = {
      id: sampleUser!.id,
      role: USER_ROLE.MENTOR,
    }

    const response = await supertest(server)
      .patch(`${pathRoot.v1.users}`)
      .set('Cookie', authToken.admin)
      .send(modifiedUser)

    expect(response.status).toBe(204)
  })
  it('An ADMIN user should be able to update user data', async () => {
    const modifiedUser = {
      id: sampleUser!.id,
      email: 'sampleUser2@sampleUser.com',
      name: 'UpdatedSampleUser',
      dni: '88888888X',
      password: 'UpdatedSamplePassword1',
      status: USER_STATUS.INACTIVE,
      updatedAt: new Date().toISOString(),
    }
    expect(userPatchSchema.safeParse(modifiedUser).success).toBeTruthy()
    const response = await supertest(server)
      .patch(`${pathRoot.v1.users}`)
      .set('Cookie', authToken.admin)
      .send(modifiedUser)

    expect(response.status).toBe(204)
  })
  it('User patch should fail if attempted with duplicate data', async () => {
    const modifiedUser = {
      id: sampleUser!.id,
      name: 'UpdatedSampleUser',
      dni: testUserData.user.dni,
      email: testUserData.user.email,
    }
    const response = await supertest(server)
      .patch(`${pathRoot.v1.users}`)
      .set('Cookie', authToken.admin)
      .send(modifiedUser)
    expect(response.status).toBe(409)
  })
  it('User patch should fail if attempted with invalid data', async () => {
    const modifiedUser = {
      id: sampleUser!.id,
      name: 'UpdatedSampleUser',
      dni: '8X',
      password: 'hola',
    }
    const response = await supertest(server)
      .patch(`${pathRoot.v1.users}`)
      .set('Cookie', authToken.admin)
      .send(modifiedUser)

    expect(response.status).toBe(400)
  })
})
