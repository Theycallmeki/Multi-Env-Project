const sendSuccess = (res, statusCode = 200, message = 'Success', data = null) => {
  const response: Record<string, any> = { status: 'success', message };
  if (data !== null) response.data = data;
  return res.status(statusCode).json(response);
};

const sendError = (res, statusCode = 500, message = 'Something went wrong', errors = null) => {
  const response: Record<string, any> = { status: 'error', message };
  if (errors !== null) response.errors = errors;
  return res.status(statusCode).json(response);
};

export {  sendSuccess, sendError  };