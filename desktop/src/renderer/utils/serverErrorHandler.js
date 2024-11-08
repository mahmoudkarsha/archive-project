export default function (error) {
  if (error.response) {
    console.log(error.response.data);
    console.log(error.response.status);
    console.log(error.response.headers);
    console.log(error.config);
    return error.response?.data?.message || 'خطأ';
  } else if (error.request) {
    console.log(error.request);
    console.log(error.config);
    return error.message;
  } else {
    console.log('Error', error.message);
    console.log(error.config);
    return error.message;
  }
}
