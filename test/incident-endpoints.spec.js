const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./user.fixtures')
const { makeIncidentsArray } = require('./incident.fixtures')
const { makeAuthHeader } = require('./test-helpers')

describe.only('incident Endpoints', function() {
    let db

    before('make knex instance', () => {
        db = knex({
            client: 'pg',
            connection: process.env.TEST_DATABASE_URL,
        })
        app.set('db', db)
    })

    after('disconnect from db', () => db.destroy())

    before('clean the table', () => db.raw('TRUNCATE users, incident RESTART IDENTITY CASCADE'))

    afterEach('cleanup', () => db.raw('TRUNCATE users, incident RESTART IDENTITY CASCADE'))

    describe(`GET /api/incident`, () => {
        context(`Given no incidents`, () => {
            it(`responds with 200 and an empty list`, () => {
              return supertest(app)
                .get('/api/incident')
                // .set('Authorization', `Bearer ${process.env.API_TOKEN}`)
                .expect(200, [])
            })
        })

        context('Given there are Incidents in the database', () => {
            const testUsers = makeUsersArray()
            const testIncidents = makeIncidentsArray()

            beforeEach('insert Incidents', () => {
                return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                    .into('incident')
                    .insert(testIncidents)
                })
            })

            it('responds with 200 and all of the goals', () => {
                let expectedIncidents = []
                testIncidents.map(incident => {
                    expectedIncidents.push({
                        'id': incident.id,
                        'userName': incident.user_name,
                        'timeOfIncident': incident.time_of_incident,
                        'type': incident.type,
                        'description': incident.description,
                        'coordinates': incident.coordinates.toString(),
                        'createdAt': incident.created_at
                    })
                })
                return supertest(app)
                    .get('/api/incident')
                    .expect(200, expectedIncidents)
            })
        })
    })

    describe(`GET /api/incident/user`, () => {
        context(`Given no incidents`, () => {
            const testUsers = makeUsersArray()
            beforeEach('insert Incidents', () => {
                return db
                .into('users')
                .insert(testUsers)
            })

            console.log(makeAuthHeader(testUsers[0]))
            it(`responds with 404`, () => {
                
                return supertest(app)
                    .get(`/api/incident/user`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `No Incidents` }})
            })
        })
    })
})