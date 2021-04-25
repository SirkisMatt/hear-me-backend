const express = require('express')
const IncidentService = require('../services/incident-service')
const AuthService = require('../services/auth-service')
const { requireAuth } = require('../middleware/jwt-auth')

const incidentRouter = express.Router()
const jsonBodyParser = express.json()

incidentRouter
    .route('/')
    .post(requireAuth, jsonBodyParser, (req, res, next) => {
        //Get userId
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.status(401)
        const userId = AuthService.verifyJwt(token).id
        const userName = AuthService.verifyJwt(token).sub

        const { timeOfIncident, type, coordinates, description } = req.body

        if(!timeOfIncident) 
                return res.status(400).json({
                    error: `Missing 'time_of_incident' in request body`
                })
        const newIncident = {
            'user_name': userName,
            'time_of_incident': timeOfIncident,
            type,
            coordinates
        }


        for (const field of [ 'type', 'coordinates', ])
        if (!req.body[field])
            return res.status(400).json({
                error: `Missing '${field}' in request body`
            })
            
            
        newIncident.user_id = userId
        newIncident.description = description

        IncidentService.insertIncident(
            req.app.get('db'),
            newIncident
        )
            .then(incident => {
                res 
                    .status(201)
                    .json(IncidentService.serializeIncident(incident))
            })
            .catch(next)
    })

    .get(jsonBodyParser, (req, res, next) => {
        IncidentService.getAllIncidents(
            req.app.get('db')
        )
            .then(incidents => {
                res.status(200)
                .json(incidents.map(IncidentService.serializeIncident))
            })
    })

incidentRouter
    .route('/user')
    .all(requireAuth)
    .all(checkIfIncidentsExists)
    .get((req, res) => {
        res.json(res.incidents.map(IncidentService.serializeIncident))
    })

incidentRouter
    .route('/:incidentId')
    .all(requireAuth)
    .all((req, res, next) => {
           //Get userId
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader.split(' ')[1]
        if (token == null) return res.status(401)
        const userId = AuthService.verifyJwt(token).id

        IncidentService.getById(
            req.app.get('db'),
            userId,
            req.params.incidentId
        )
            .then(incident => {
                if(!incident) {
                    return res.status(404).json({
                        error: { message: `Incident doesn't exist` }
                    })
                }
                res.incident = incident
                req.userId = userId
                next()
            })
            .catch(next)
    })
    .delete((req, res, next) => {
        IncidentService.deleteIncident(
            req.app.get('db'),
            req.params.incidentId
        )
            .then(numRowsAffected => {
                res.status(204).end()
            })
            .catch(next)
    })
    .patch(jsonBodyParser, (req, res, next) => {
        const { timeOfIncident, type, description, coordinates } = req.body
        // if(!timeOfIncident) 
        //         return res.status(400).json({
        //             error: `Missing time_of_incident in request body`
        //         })
        const incidentToUpdate = { 
            'time_of_incident': timeOfIncident, 
            type, description, 
            coordinates 
        }

        const numberOfValues = Object.values(incidentToUpdate).filter(Boolean).length
        if(numberOfValues === 0)
            return res.status(400).json({
                error: {
                    message: `Request body must contain title, description, tree_bet, complete_by, goal_type_id or date_published`
                }
            })

        IncidentService.updateIncident(
            req.app.get('db'),
            req.params.incidentId,
            incidentToUpdate
        )
            .then(incident => {
                res.status(201)
                .json(IncidentService.serializeIncident(incident))
            })
            .catch(next)
    })


async function checkIfIncidentsExists(req, res, next) {
    //Get userId
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if (token == null) return res.status(401)
    const userId = AuthService.verifyJwt(token).id


    try{
        const incidents = await IncidentService.getUserIncidents(
            req.app.get('db'),
            userId
        )
        if(incidents.length === 0)
            return res.status(404).json({
                error: {message: `No Incidents`}
            })

        res.incidents = incidents
        next()
    } catch (error) {
        next(error)
    }
}

module.exports = incidentRouter