const express = require("express");
const passport = require("passport");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const { Storage } = require("@google-cloud/storage");
require("./services/passport");
require("dotenv").config();

const keys = require("./config/keys");

const User = require("./schemas/user");
const QuestionsDataModel = require("./schemas/build");

const app = express();

app.use(
	cors({
		origin: "http://localhost:5173",
		credentials: true,
	})
);

app.use(express.json());

mongoose
	.connect(keys.mongoURI)
	.then((value) => console.log("Connection has been Established"));

const path = require("path");
const keyPath = path.resolve(__dirname, "credentials.json");

const storage = new Storage({
	projectId: process.env.PROJECTID,
	keyFilename: keyPath,
});

const bucketName = "formbuilderimages";

app.use(passport.initialize());

app.post("/login", (req, res, next) => {
	passport.authenticate("local", { session: false }, (err, user, info) => {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({ message: "Invalid username or password." });
		}

		const payload = { id: user._id };
		const token = jwt.sign(payload, keys.jwtSecret, {
			expiresIn: "6h",
		});

		return res.json({ message: "User authenticated", token: token });
	})(req, res, next);
});

app.post("/signup", async (req, res, next) => {
	const { username, password } = req.body;

	try {
		const existingUser = await User.findOne({ username: username });

		if (existingUser) {
			return res.status(409).json({ message: "Username already exists." });
		}

		const newUser = new User({ username, password });

		bcrypt.genSalt(10, (err, salt) => {
			if (err) {
				return next(err);
			}
			bcrypt.hash(newUser.password, salt, async (err, hash) => {
				if (err) {
					return next(err);
				}
				newUser.password = hash;

				try {
					const savedUser = await newUser.save();

					const payload = { id: savedUser._id };
					const token = jwt.sign(payload, keys.jwtSecret, { expiresIn: "6h" });

					return res.json({
						message: "User created successfully.",
						token: token,
					});
				} catch (err) {
					return next(err);
				}
			});
		});
	} catch (err) {
		return next(err);
	}
});

app.post(
	"/save",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		try {
			const username = req.user.username;
			const password = req.user.password;

			const existingData = await QuestionsDataModel.findOne({
				username,
				password,
			});

			if (existingData) {
				const dataArr = existingData.data;
				const objectType = req.body.type;

				if (objectType === "formName") {
					existingData.headerData = req.body;
					await existingData.save();
					res.status(200).json({ message: "Data Updated successfully" });
					return;
				}

				const existingIndex = dataArr.findIndex(
					(item) => item.id === req.body.id
				);

				if (existingIndex !== -1) {
					dataArr[existingIndex] = req.body;
				} else {
					dataArr.push(req.body);
				}
				await existingData.save();
				console.log("Data saved successfully");
			} else {
				let newData;
				if (req.body.type === "formName") {
					newData = new QuestionsDataModel({
						username: username,
						password: password,
						headerData: req.body,
					});
				} else {
					newData = new QuestionsDataModel({
						username: username,
						password: password,
						data: [req.body],
					});
				}

				await newData.save();
				console.log("Data saved successfully");
				res.status(200).json({ message: "Data saved successfully" });
			}
		} catch (err) {
			res.status(500).json({ error: "Failed to save objects" });
		}
	}
);

const upload = multer({
	storage: multer.memoryStorage(),
	limits: {
		fileSize: 5 * 1024 * 1024, // limit to 5MB
	},
});

app.post("/upload-image", upload.single("image"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No image file found" });
		}

		const dataObjectId = req.body.id;
		const blobName = dataObjectId + "_image";
		const bucket = storage.bucket(bucketName);
		const blob = bucket.file(blobName);

		const stream = blob.createWriteStream({
			metadata: {
				contentType: req.file.mimetype,
			},
			resumable: true,
		});

		stream.on("error", (err) => {
			req.file.cloudStorageError = err;
			return res.status(500).json({ error: "Error during image upload" });
		});

		stream.on("finish", () => {
			res.status(200).json({
				imageURL: getPublicUrl(bucketName, blobName),
			});
		});

		stream.end(req.file.buffer);
	} catch (error) {
		res.status(500).json({ error: "Oops! there is some error" });
	}
});

const getPublicUrl = (bucketName, fileName) =>
	`https://storage.googleapis.com/${bucketName}/${fileName}`;

app.get(
	"/fetch",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		try {
			const username = req.user.username;
			const password = req.user.password;

			const questionsData = await QuestionsDataModel.findOne({
				username,
				password,
			});

			if (!questionsData) {
				return res.status(404).json({ message: "No saved data found" });
			}

			// Send headerData only if it exists, otherwise send an empty object
			const headerData = questionsData.headerData
				? questionsData.headerData
				: {};

			res.status(200).json({
				data: questionsData.data,
				headerData: headerData,
			});
		} catch (err) {
			res.status(500).json({ error: "Failed to fetch array data" });
		}
	}
);

app.delete(
	"/delete/:id",
	passport.authenticate("jwt", { session: false }),
	async (req, res) => {
		try {
			const username = req.user.username;
			const password = req.user.password;
			const deleteId = req.params.id;

			console.log(deleteId);

			const existingData = await QuestionsDataModel.findOne({
				username,
				password,
			});

			if (!existingData) {
				return res.status(404).json({ message: "Data not found" });
			}

			const dataArr = existingData.data; // Get the existing 'data' array

			// Find the index of the data object with the matching id
			const deleteIndex = dataArr.findIndex(
				(item) => item.id.toString() === deleteId
			);

			if (deleteIndex === -1) {
				return res.status(404).json({ message: "Data object not found" });
			}

			dataArr.splice(deleteIndex, 1);

			dataArr.forEach((item, index) => {
				item.id = index.toString();
			});

			await existingData.save();

			res
				.status(200)
				.json({ message: "Data object deleted successfully", data: dataArr });
		} catch (err) {
			res.status(500).json({ error: "Failed to delete data object" });
		}
	}
);

app.listen(3000, () => {
	console.log("Server is Listening");
});
