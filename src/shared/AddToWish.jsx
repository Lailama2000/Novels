
export const AddToWish = (token,novel_id) => {
  let status = true;
  if(token){
    const options = {
        method:'POST',
        headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        },
        body: JSON.stringify({ novel_id: novel_id }),
    }
    fetch(`${process.env.REACT_APP_BASE_URL}/wishlist`, options)
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      if(data.status)
      {
        console.log(data.message);
      }
      else
      {
        throw data.message;
      }
    })
    .catch((error) => {
    // Handle any error that occurred during the API request
      status = false
      console.error(error);
      alert(error);
    });
  }
  else{
    status = false;
  }
  return status;
}
