const express = require('express')
const path = require('path')
const UsersService = require('../services/users-service')

const usersRouter = express.Router()
const jsonBodyParser = express.json()

usersRouter
//validate email before create user
    .post('/register', jsonBodyParser, (req, res, next) => {
        const { userName, email, password } = req.body

        for(const field of ['userName', 'email', 'password'])
            if(!req.body[field])
                return res.status(400).json({
                    error: `Missing '${field}' in request body`
                })
            // TODO: check user_name doesn't start with spaces
            
            const passwordError = UsersService.validatePassword(password)

            if(passwordError)
                return res.status(400).json({ error: passwordError })
            
            UsersService.hasUserWithEmail(
                req.app.get('db'),
                email
            )
                .then(hasUserWithEmail => {
                    if(hasUserWithEmail)
                        return res.status(400).json({ error: `Email already taken` })
                    
                    return UsersService.hashedPassword(password)
                        .then(hashedPassword => {
                            const newUser = {
                                user_name: userName,
                                email,
                                password: hashedPassword,
                                created_at: 'now()'
                            }
                            
                            return UsersService.insertUser(
                                req.app.get('db'),
                                newUser
                            )
                                .then(user => {
                                    res
                                        .status(201)
                                        .location(path.posix.join(req.originalUrl, `/${user.id}`))
                                        .json(UsersService.serializeUser(user))
                                })
                        })
                })
                .catch(next)

            
    })

module.exports = usersRouter