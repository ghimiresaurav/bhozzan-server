type ErrorResponseFunc = (err: Error | unknown, message?: string) => { errorMsg: string };

const errorHandlers: ErrorResponseFunc = (err, message = "Internal Server Error") => {
	const extractErrMsg = (err as Error).message;
	const errMsg = extractErrMsg ? extractErrMsg : message;
	return { errorMsg: errMsg };
};

export default errorHandlers;
