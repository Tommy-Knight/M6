import jwt from "jsonwebtoken";

//><><><><> MIDDLEWARE FOR GENERATING ACCESS TOKEN <><><><><\\

export const JWTAuthenticate = async (user) => {
	const accessToken = await generateAccessJWT({ _id: user._id });
	const refreshToken = await generateRefreshJWT({ _id: user._id });
	user.refreshToken = refreshToken;
	await user.save();
	return { accessToken, refreshToken };
};

//><><><><> GENERATES ACCESS TOKEN <><><><><\\

const generateAccessJWT = (payload) =>
	new Promise((resolve, reject) =>
		jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: "1 week" }, (err, token) => {
			if (err) reject(err);
			resolve(token);
		})
	);

//><><><><> VERIFY TOKEN <><><><><\\

export const verifyToken = (token) =>
	new Promise((resolve, reject) =>
		jwt.verify(token, process.env.JWT_SECRET, (err, decodedToken) => {
			// console.log("🍿", token, "🍕", decodedToken);
			if (err) reject(err);
			resolve(decodedToken);
		})
	);

//><><><><> GENERATE REFRESH TOKEN <><><><><\\
	
const generateRefreshJWT = (payload) =>
new Promise((resolve, reject) =>
jwt.sign(payload, process.env.JWT_REFRESH, { expiresIn: "1 week" }, (err, token) => {
	if (err) reject(err);
			resolve(token);
		})
		);

// import { promisify } from "util"
// const promisifiedJWTSign = promisify(jwt.sign)
// promisifiedJWTSign(payload, ).then()
