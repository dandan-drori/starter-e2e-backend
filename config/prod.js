module.exports = {
	dbURL: `mongodb+srv://${process.env.MONGO_ORG_NAME}:${process.env.MONGO_PASS}@${process.env.MONGO_DB_LINK}/${process.env.MONGO_DB_NAME}?retryWrites=true&w=majority`,
}
