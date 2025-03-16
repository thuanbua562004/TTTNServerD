const axios = require('axios');


let getUser = async (req, res) => {
  const url = 'http://localhost:3000/api/user';
  try {
    const response = await axios({
      method: "POST",
      url: url,
      data: {
        username: "v@gmail.com", 
        password: "123", 
      },
    });

    res.send(response.data);
  } catch (error) {
    res.send(error.message);
  }
};

module.exports ={
getUser

}