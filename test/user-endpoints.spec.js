const { expect } = require('chai')
const knex = require('knex')
const bcrypt = require('bcryptjs')
const app = require('../src/app')
const { makeUsersArray } = require('./user.fixtures')

describe('users Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
          client: 'pg',
          connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
      })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    afterEach('cleanup',() => db.raw('TRUNCATE users RESTART IDENTITY CASCADE'))

    describe(`POST /api/users/register`, () => {
        context(`User Validation`, () => {
            const testUsers = makeUsersArray()
            
            this.beforeEach('insert users', () => {
                return db 
                .into('users')
                .insert(testUsers)
            })

            const requiredFields = ['userName', 'email', 'password']

            requiredFields.forEach(field => {
                const registerAttemptBody = {
                    userName: 'test user_name',
                    email: 'testtest@test.com',
                    password: 'password'
                }

                it(`responds with 400 required error when '${field}' is missing`, () => {
                    delete registerAttemptBody[field]
          
                    return supertest(app)
                        .post('/api/users/register')
                        .send(registerAttemptBody)
                        .expect(400, {
                            error: `Missing '${field}' in request body`,
                    })
                })
                it(`responds 400 'Password must be longer than 8 characters' when empty password`, () => {
                    const userShortPassword = {
                        userName: 'testuser_name',
                        email: 'testtest@test.com',
                        password: '1234567'
                    }
                    return supertest(app)
                        .post('/api/users/register')
                        .send(userShortPassword)
                        .expect(400, { error: `Password must be longer than 8 characters` })
                })
                it(`responds 400 'Password must be less than 72 characters' when long password`, () => {
                    const userLongPassword = {
                        userName: 'testuser_name',
                        email: 'testtest@test.com',
                        password: '*'.repeat(73)
                    }
                    return supertest(app)
                        .post('/api/users/register')
                        .send(userLongPassword)
                        .expect(400, { error: `Password must be less than 72 characters` })
                })
                it(`responds 400 'error when password starts with spaces'`, () => {
                    const userPasswordStartsSpaces = {
                        userName: 'testuser_name',
                        email: 'testtest@test.com',
                        password: ' Aa!2Bb@'
                    }
                    return supertest(app)
                        .post('/api/users/register')
                        .send(userPasswordStartsSpaces)
                        .expect(400, { error: `Password must not start or end with empty spaces` })
                })
                it(`responds 400 'error when password starts with spaces'`, () => {
                    const userPasswordStartsSpaces = {
                        userName: 'testuser_name',
                        email: 'testtest@test.com',
                        password: 'Aa!2Bb@ '
                    }
                    return supertest(app)
                        .post('/api/users/register')
                        .send(userPasswordStartsSpaces)
                        .expect(400, { error: `Password must not start or end with empty spaces` })
                })
                it(`responds 400 error when password isn't complex enough`, () => {
                    const userPasswordNotComplex = {
                        userName: 'testuser_name',
                        email: 'testtest@test.com',
                        password: '11AAaabb'
                    }
                    return supertest(app)
                      .post('/api/users/register')
                      .send(userPasswordNotComplex)
                      .expect(400, { error: `Password must contain one upper case, lower case, number and special character` })
                  })
                  it(`responds 400 'User name already taken' when user_name isn't unique`, () => {
                    const duplicateUser = {
                        userName: 'testUser1',
                        email: 'testtest@test.com',
                        password: '11AAaa!!'
                    }
                    return supertest(app)
                      .post('/api/users/register')
                      .send(duplicateUser)
                      .expect(400, { error: `username already taken` })
                  })
                  it(`responds 400 'Email already taken' when email isn't unique`, () => {
                    const duplicateUser = {
                        userName: 'testuser_name',
                        email: 'test1@test.com',
                        password: '11AAaa!!'
                    }
                    return supertest(app)
                      .post('/api/users/register')
                      .send(duplicateUser)
                      .expect(400, { error: `Email already taken` })
                  })
            })
            context(`Happy path`, () => {
                
                it(`responds 201, serialized user, storing bcryped password`, async () => {
                  const newUser = {
                    userName: 'testuser_name',
                    email: 'testtest@test.com',
                    password: '11AAaa!!'
                  }
                  await supertest(app)
                    .post('/api/users/register')
                    .send({newUser})
                    expect(201)
                    expect(res => {
                      expect(res.body).to.have.property('id')
                      expect(res.body.user_name).to.eql(newUser.userName)
                      expect(res.body.email).to.eql(newUser.email)
                      expect(res.body).to.not.have.property('password')
                      expect(actual).to.eql(expected)
                      const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                      const actualDate = new Date(res.body.created_at).toLocaleString()
                      expect(actualDate).to.eql(expectedDate)
                    })
                    expect(res =>
                        db
                            .from('users')
                            .select('*')
                            .where( 'id', res.body.id )
                            .first()
                            .then(row => {
                            expect(row.body.user_name).to.eql(newUser.userName)
                            expect(row.body.email).to.eql(newUser.email)
                            const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                            const actualDate = new Date(row.created_at).toLocaleString()
                            expect(actualDate).to.eql(expectedDate)
            
                            return bcrypt.compare(newUser.password, row.password)
                        })
                        .then(compareMatch => {
                            expect(compareMatch).to.be.true
                        })
                        .done()
                    )
                })
            })   
        })
    })
})
   