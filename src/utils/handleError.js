export const handleAxiosError = (error) => {
  if (error.response) {
    console.error('Error Response:', error.response.data);
    alert(`Error: ${error.response.data.msg || `Status: ${error.response.status}`}`);
  } else if (error.request) {
    console.error('No Response:', error.request);
    alert('Error: No response from server. Please try again later.');
  } else {
    console.error('Request Error:', error.msg);
    alert(`Error: ${error.msg}`);
  }
};
