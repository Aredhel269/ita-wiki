import supertest from 'supertest'
import { expect, it, describe, afterAll, beforeAll } from 'vitest'
import { server } from '../globalSetup'
import { pathRoot } from '../../routes/routes'
import { client } from '../../models/db'

let itineraryId: string = ''
beforeAll(async () => {
  const { rows } = await client.query('SELECT id FROM "itinerary" LIMIT 1')
  const [id] = rows
  itineraryId = id.id
})
afterAll(async () => {
  await client.query('DELETE FROM "user" WHERE dni = $1 AND email = $2', [
    '11111111Q',
    'example@example.com',
  ])
})

describe('Testing registration endpoint', () => {
  it('should succeed with correct credentials', async () => {
    const response = await supertest(server)
      .post(`${pathRoot.v1.auth}/register`)
      .send({
        dni: '11111111Q',
        email: 'example@example.com',
        password: 'password1',
        confirmPassword: 'password1',
        itineraryId,
      })
    expect(response.status).toBe(204)
  })

  describe('should fail with duplicate', () => {
    it('should fail with duplicate: DNI', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '11111111A',
          email: 'anotherexample@example.com',
          password: 'password1',
          confirmPassword: 'password1',
          itineraryId,
        })
      expect(response.status).toBe(500)
      expect(response.body.message).toContain(
        'duplicate key value violates unique constraint "user_dni_key"'
      )
    })

    it('should fail with duplicate: email', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'testingUser@user.cat',
          password: 'password1',
          confirmPassword: 'password1',
          itineraryId,
        })

      expect(response.status).toBe(500)
      expect(response.body.message).toBe(
        'duplicate key value violates unique constraint "user_email_key"'
      )
    })
  })

  describe('should fail with missing required fields', () => {
    it('should fail with missing required fields: dni', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          email: 'example2@example.com',
          password: 'password1',
          confirmPassword: 'password1',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].message).toBe('Required')
      expect(response.body.message[0].path).toContain('dni')
    })

    it('should fail with missing required fields: email', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          password: 'password1',
          confirmPassword: 'password1',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].message).toBe('Required')
      expect(response.body.message[0].path).toContain('email')
    })

    it('should fail with missing required fields: password', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'example2@example.com',
          confirmPassword: 'password1',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].message).toBe('Required')
      expect(response.body.message[0].path).toContain('password')
    })

    it('should fail with missing required fields: confirmPassword', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'example2@example.com',
          password: 'password1',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].message).toBe('Required')
      expect(response.body.message[0].path).toContain('confirmPassword')
    })
    it('should fail with missing required fields: itineraryId', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'example2@example.com',
          password: 'password1',
          confirmPassword: 'password1',
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].message).toBe('Required')
      expect(response.body.message[0].path).toContain('itineraryId')
    })
  })

  describe('should fail with invalid input', () => {
    it('should fail with invalid input: dni', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: 'notRealDNI',
          email: 'example2@example.com',
          password: 'password1',
          confirmPassword: 'password1',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].validation).toBe('regex')
      expect(response.body.message[0].path).toContain('dni')
    })

    it('should fail with invalid input: email', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'notAValidEmail',
          password: 'password1',
          confirmPassword: 'password1',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].validation).toBe('email')
      expect(response.body.message[0].path).toContain('email')
    })

    it('should fail with invalid input: password too short', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'example2@example.com',
          password: 'pswd1',
          confirmPassword: 'pswd1',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].path).toContain('password')
      expect(response.body.message[0].code).toBe('too_small')
    })

    it('should fail with invalid input: password has no numbers', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'example2@example.com',
          password: 'password',
          confirmPassword: 'password',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].validation).toBe('regex')
      expect(response.body.message[0].path).toContain('password')
    })

    it('should fail with invalid input: password contains non-alfanumeric', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'example2@example.com',
          password: 'password1?',
          confirmPassword: 'password1?',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].validation).toBe('regex')
      expect(response.body.message[0].path).toContain('password')
    })
    it('should fail with invalid input: passwords do not match', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'example2@example.com',
          password: 'password1',
          confirmPassword: 'password2',
          itineraryId,
        })
      expect(response.status).toBe(400)
      expect(response.body.message[0].message).toBe('Passwords must match')
      expect(response.body.message[0].path).toContain('confirmPassword')
    })
    it('should fail with non existing itineraryId', async () => {
      const response = await supertest(server)
        .post(`${pathRoot.v1.auth}/register`)
        .send({
          dni: '45632452c',
          email: 'example2@example.com',
          password: 'password1',
          confirmPassword: 'password1',
          itineraryId: 'clpb25e1l000008jr7j505s0o',
        })
      expect(response.status).toBe(422)
      expect(response.body.message).toBe('Invalid itinerary')
    })
  })
})
