const xss = require('xss')

const IncidentService = {
    getAllIncidents(db) {
        return db 
            .select('*')  
            .from('incident')
    },
    getUserIncidents(knex, userId) {
        return knex('incident')
        .select('*')
        .where('userId', userId)
    },
    insertIncident(db, newIncident) {
        return db
        .insert(newIncident)
        .into('incident')
        .returning('*')
        .then(([incident]) => incident)
    },
    serializeIncident(incident) {
        return{
            id: incident.id,
            userName: xss(incident.user_name),
            timeOfIncident: new Date(incident.time_of_incident),
            type: incident.type,
            description: xss(incident.description),
            coordinates: xss(incident.coordinates),
        }
    }
}

module.exports = IncidentService