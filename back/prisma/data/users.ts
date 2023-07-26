import { Prisma } from '@prisma/client'

export const users: Prisma.UserCreateArgs['data'][] = [
  {
    email: 'admin@admin.com',
    password: 'password1',
    name: 'Kevin Mamaqi',
    dni: '12345678A',
    status: 'ACTIVE',
    role: 'ADMIN',
    specializationId: '',
  },
  {
    email: 'registered@registered.com',
    password: 'password2',
    name: 'Django Unchained',
    dni: '23456789B',
    status: 'ACTIVE',
    role: 'REGISTERED',
    specializationId: '',
  },
  {
    email: 'mentor@mentor.com',
    password: 'password3',
    name: 'Linux Mint',
    dni: '34567890C',
    status: 'ACTIVE',
    role: 'MENTOR',
    specializationId: '',
  },
]
