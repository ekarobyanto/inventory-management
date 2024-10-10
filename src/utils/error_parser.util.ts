export const errorParser = (error: string | object) => {
  if (typeof error === 'string') {
    return error;
  }

  return error['message'] || error['error'] || 'Internal Server Error';
};
