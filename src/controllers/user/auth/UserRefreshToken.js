import createError from "http-errors";
import ExtractRefreshToken from "../../../helpers/ExtractRefreshToken.js";
import print_error from "../../../helpers/print_error.js";
import SignAccessToken from "../../../helpers/tokens/SignAccessToken.js";
import SignRefreshToken from "../../../helpers/tokens/SignRefreshToken.js";
import VerifyRefreshToken from "../../../helpers/tokens/VerifyRefreshToken.js";

const UserRefreshToken = async (request, response, next) => {
	try {
		// getting refresh_token from request body
		const refresh_token = ExtractRefreshToken(request.headers.cookie);

		// ? if no refresh_token then throw error which will be caught by error handler
		if (!refresh_token) throw createError.BadRequest();
		// ? storing id that will be returned by VerifyRefreshToken upon successful verification so that we can user this id to SignAccessToken
		const id = await VerifyRefreshToken(refresh_token);

		//? creating new sets of access_token and refresh_token
		const new_access_token = await SignAccessToken(id);
		const new_refresh_token = await SignRefreshToken(id);

		// ? setting new refresh token in cookie of client
		response.setHeader(
			"Set-Cookie",
			`refresh_token=${new_refresh_token}; HttpOnly`
		);

		// ? sending new access_token to the client
		response.send({
			token: {
				access_token: new_access_token,
			},
		});
	} catch (error) {
		print_error("28 :: Error occurred in UserRefreshToken", error);
		next(error);
	}
};

export default UserRefreshToken;
