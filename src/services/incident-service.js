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
        .where('user_id', userId)
    },
    insertIncident(db, newIncident) {
        return db
        .insert(newIncident)
        .into('incident')
        .returning('*')
        .then(([incident]) => incident)
    },
    getById(knex, userId, id) {
        return knex('incident')
            .select('*')
            .where({
            'user_id': userId,
            'id': id
        }).first()
    },
    deleteIncident(knex, id) {
        return knex('incident')
            .where({ id })
            .delete()
    },
    updateIncident(knex, id, newIncidentFields) {
        return knex('incident')
            .where({ id })
            .update(newIncidentFields)
            .returning('*')
            .then(rows => {
                return rows[0]
            })
    },
    serializeIncident(incident) {
        return{
            id: incident.id,
            userId: incident.user_id,
            userName: xss(incident.user_name),
            timeOfIncident: new Date(incident.time_of_incident),
            type: incident.type,
            description: xss(incident.description),
            coordinates: incident.coordinates,
            createdAt: incident.created_at
        }
    }
}

module.exports = IncidentService