const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./user.fixtures')
const { makeIncidentsArray } = require('./incident.fixtures')
const { makeAuthHeader, cleanTables } = require('./test-helpers')

describe(`Protected endpoints`, function () {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('cleanup', () => cleanTables(db))
  
    afterEach('cleanup', () => cleanTables(db))

    const testUsers = makeUsersArray()
    const testIncidents = makeIncidentsArray()
    beforeEach('insert users', () => {
        return db
        .into('users')
        .insert(testUsers)
            .then(() => {
                return db
                    .into('incident')
                    .insert(testIncidents)
            })
    })

    const protectedEndpoints = [
        {
            name: 'GET /api/incident/user',
            path: '/api/incident/user',
            method: supertest(app).get
        },
        {
            name: 'POST /api/incident/:incidentId',
            path: '/api/incident/1',
            method: supertest(app).post
        },
        {
            name: 'DELETE /api/incident/:incidentId',
            path: '/api/incident/1',
            method: supertest(app).delete
        },
        {
            name: 'PATCH /api/incident/:incidentId',
            path: '/api/incident/1',
            method: supertest(app).patch
        }
    ]

    protectedEndpoints.forEach(endpoint => {
        describe(endpoint.name, () => {
            it(`responds 401 'Missing bearer token' when no bearer token`, () => {
                return endpoint.method(endpoint.path)
                    .expect(401, { error: { message: `Missing bearer token` } })
            })
    
            it(`responds 401 'Unauthorized request' when invalid JWT secret`, () => {
                const validUser = testUsers[0]
                const invalidSecret = 'bad-secret'
                return endpoint.method(endpoint.path)
                    .set('Authorization', makeAuthHeader(validUser, invalidSecret))
                    .expect(401, { error: { message: `Unauthorized request` } })
            })
    
            it(`responds 401 'Unauthorized request' when invalid sub in payload`, () => {
                const invalidUser = { user_name: 'user-not-existy', id: 1 }
                return endpoint.method(endpoint.path)
                    .set('Authorization', makeAuthHeader(invalidUser))
                    .expect(401, { error: { message: `Unauthorized request` } })
            })
        })
    })
})