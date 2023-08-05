const mongoose = require("mongoose");
const { Schema } = mongoose;

const questionsDataSchema = new Schema({
	username: { type: String, required: true },
	password: { type: String, required: true },
	headerData: {
		type: [Schema.Types.Mixed],
	},
	data: {
		type: [Schema.Types.Mixed],
		default: [],
	},
});

module.exports = mongoose.model("QuestionData", questionsDataSchema);
