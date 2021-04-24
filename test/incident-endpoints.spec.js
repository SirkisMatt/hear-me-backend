const { expect } = require('chai')
const knex = require('knex')
const app = require('../src/app')
const { makeUsersArray } = require('./user.fixtures')
const { makeIncidentsArray } = require('./incident.fixtures')
const { makeAuthHeader, filterIncidentsForUser, cleanTables } = require('./test-helpers')

describe('incident Endpoints', function() {
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

            it('responds with 200 and all of the incidents', () => {
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
            beforeEach('insert users', () => {
                return db
                .into('users')
                .insert(testUsers)
            })

            it(`responds with 404`, () => {
                
                return supertest(app)
                    .get(`/api/incident/user`)
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(404, { error: { message: `No Incidents` }})
            })
        })

        context(`Given there are incidents`, () => {
            const testUsers = makeUsersArray()
            const testIncidents = makeIncidentsArray()

            beforeEach('insert users and incidents', () => {
                return db
                .into('users')
                .insert(testUsers)
                .then(() => {
                    return db
                    .into('incident')
                    .insert(testIncidents)
                })
            })

            it('responds with 200 and all of the incidents', () => {
              
                let testUserIncidents = testIncidents.filter(item => 
                    item.user_id === testUsers[0].id
                )
                
                return supertest(app)
                    .get('/api/incident/user')
                    .set('Authorization', makeAuthHeader(testUsers[0]))
                    .expect(200, filterIncidentsForUser(testUserIncidents))
            })

        })
    })
    describe(`POST /api/incident`, () => {
        context(`Given there are users`, () => {
            const testUsers = makeUsersArray()
            beforeEach('insert users', () => {
                return db
                .into('users')
                .insert(testUsers)
            })

            it(`responds 201, serialized incident`, async () => {
                const newIncident = {
                    userName: "testUser5",
                    timeOfIncident: "2021-04-16T08:00:00.000Z",
                    type: "race",
                    description: "Lorem isum",
                    coordinates: [-79.47606660156234,45.070533083787325],
                }
                await supertest(app)
                  .post('/api/incident')
                  .set('Authorization', makeAuthHeader(testUsers[0]))
                  .send(newIncident)
                  .expect(201)
                  expect(res => {
                    expect(res.body).to.have.property('id')
                    expect(res.body.user_name).to.eql(newIncident.userName)
                    expect(res.body.type).to.eql(newIncident.type)
                    expect(res.body.description).to.eql(newIncident.description)
                    expect(res.body.coordinates).to.eql(newIncident.coordinates.toString())
                    expect(actual).to.eql(expected)
                    const expectedDate = new Date().toLocaleString('en', { timeZone: 'UTC' })
                    const actualDate = new Date(res.body.createAt).toLocaleString()
                    expect(actualDate).to.eql(expectedDate)
                  })
            })
        })
    })
})