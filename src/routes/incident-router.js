const express = require('express')
const path = require('path')
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

        const { userName, timeOfIncident, type, coordinates } = req.body
        const newIncident = {
            'user_name': userName,
            'time_of_incident': timeOfIncident,
            type,
            coordinates
        }

        for (const [key, value] of Object.entries(newIncident))
            if(value == null)
                return res.status(400).json({
                    error: `Missing '${key}' in request body`
                })
        newIncident.user_id = userId

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

module.exports = incidentRouter