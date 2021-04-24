const jwt = require('jsonwebtoken')
require('dotenv').config()




function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`

}

function filterIncidentsForUser(testUserIncidents) {
    let expectedIncidents = []

    for( i = 0; i < testUserIncidents.length; i++) {
        expectedIncidents.push(
            {
                'id': testUserIncidents[i].id,
                'userName': testUserIncidents[i].user_name,
                'timeOfIncident': testUserIncidents[i].time_of_incident,
                'type': testUserIncidents[i].type,
                'description': testUserIncidents[i].description,
                'coordinates': testUserIncidents[i].coordinates.toString(),
                'createdAt': testUserIncidents[i].created_at
            }
        )
    }

    return(expectedIncidents)
}

function cleanTables(db) {
    return db.transaction(trx =>
      trx.raw(
        `TRUNCATE
          users,
          incident
        `
      )
      .then(() =>
        Promise.all([
          trx.raw(`ALTER SEQUENCE users_id_seq minvalue 0 START WITH 1`),
          trx.raw(`ALTER SEQUENCE incident_id_seq minvalue 0 START WITH 1`),
          trx.raw(`SELECT setval('users_id_seq', 0)`),
          trx.raw(`SELECT setval('incident_id_seq', 0)`),
        ])
      )
    )
  }

module.exports = {
    makeAuthHeader,
    filterIncidentsForUser,
    cleanTables
}

