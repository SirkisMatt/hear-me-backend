const jwt = require('jsonwebtoken')
require('dotenv').config()



function makeAuthHeader(user, secret = process.env.JWT_SECRET) {
    const token = jwt.sign({ id: user.id }, secret, {
      subject: user.user_name,
      algorithm: 'HS256',
    })
    return `Bearer ${token}`

}

module.exports = {
    makeAuthHeader
}

