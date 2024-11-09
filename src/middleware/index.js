// This function changes the default server timeout
export const setServerTimeout = (millis = 5 * 60 * 1000) => (req, res, next) => {
	req.setTimeout(millis, () => res.status(408).json({ message: "Request Timeout" })); // Set timeout in request object
	res.setTimeout(millis, () => res.status(503).json({ message: "Service Unavailable" })); // Set timeout in response object
	next();
};
