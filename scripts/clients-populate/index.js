const { default: axios } = require("axios");

axios.get("https://randomuser.me/api/?results=100&nat=BR", {
  headers: {
    "Content-Type": "application/json",

  }
}).then((res) => {

  res.data.results.forEach((client) => {


    axios.post("http://localhost:5000/clients", {
      name: client.name.first + " " + client.name.last,
      contact: client.cell,
      address: client.location.street.name + ", " + client.location.street.number + ", " + client.location.city + ", " + client.location.state + ", " + client.location.country,

    }, {
      headers: {
        "Content-Type": "application/json",
      }
    }).then((res) => {
      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  })
})
