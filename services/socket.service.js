const asyncLocalStorage = require('./als.service')
const logger = require('./logger.service')

module.exports = {
	connectSockets,
	emitToAll,
	emitTo,
	emitToUser,
	broadcast,
}

var gIo = null
var gSocketBySessionIdMap = {}

function connectSockets(http, session) {
	gIo = require('socket.io')(http)

	const sharedSession = require('express-socket.io-session')

	gIo.use(
		sharedSession(session, {
			autoSave: true,
		})
	)
	gIo.on('connection', socket => {
		console.log('New socket - socket.handshake.sessionID', socket.handshake.sessionID)
		gSocketBySessionIdMap[socket.handshake.sessionID] = socket
		socket.on('disconnect', socket => {
			console.log('Someone disconnected')
			if (socket.handshake) {
				gSocketBySessionIdMap[socket.handshake.sessionID] = null
			}
		})
		// sockets listeners here
	})
}

function emitToAll({ type, data, room = null }) {
	if (room) gIo.to(room).emit(type, data)
	else gIo.emit(type, data)
}

function emitTo({ type, data, label }) {
	if (label) gIo.to('watching:' + label).emit(type, data)
	else gIo.emit(type, data)
}

function emitToUser({ type, data, userId }) {
	gIo.to(userId).emit(type, data)
}

function broadcast({ type, data, room = null }) {
	const store = asyncLocalStorage.getStore()
	const { sessionId } = store
	if (!sessionId) return logger.debug('Shoudnt happen, no sessionId in asyncLocalStorage store')
	const excludedSocket = gSocketBySessionIdMap[sessionId]
	if (!excludedSocket) return logger.debug('Shouldnt happen, No socket in map')
	if (room) excludedSocket.broadcast.to(room).emit(type, data)
	else excludedSocket.broadcast.emit(type, data)
}
