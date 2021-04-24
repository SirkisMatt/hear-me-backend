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

  function seedUsers(db, users) {
    const preppedUsers = users.map(user => ({
      ...user,
      password: bcrypt.hashSync(user.password, 1)
    }))
    return db.into('users').insert(preppedUsers)
      .then(() =>
        // update the auto sequence to stay in sync
        db.raw(
          `SELECT setval('users_id_seq', ?)`,
          [users[users.length - 1].id],
        )
      )
  }

module.exports = {
    makeAuthHeader,
    filterIncidentsForUser,
    cleanTables,
    seedUsers
}

