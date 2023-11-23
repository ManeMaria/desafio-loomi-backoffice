const { default: axios } = require("axios");

axios.get("https://dummyjson.com/products", {
  headers: {
    "Content-Type": "application/json",

  }
}).then((res) => {

  res.data.products.forEach((item) => {


    axios.post("http://localhost:5000/products", {
      name: item.title,
      description: item.description,
      cost: item.price,
      quantity: item.stock,
    }, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": "Bearer eyJraWQiOiJqNEVKTXBucmFSM1I4aEFsbGVoMXVRV0hQNXQ1ald6RDF3N1Flb1JzbDdFPSIsImFsZyI6IlJTMjU2In0.eyJzdWIiOiJmYWNlODE4NC04NjgxLTQyOWItOWEyNS05Y2JlNmJlMGQwMzQiLCJpc3MiOiJodHRwczpcL1wvY29nbml0by1pZHAudXMtZWFzdC0xLmFtYXpvbmF3cy5jb21cL3VzLWVhc3QtMV84ZnlWbmgxaW8iLCJjbGllbnRfaWQiOiIzODczYjYwbmhmbzViaDEyb3U4Zml1OGRvcCIsIm9yaWdpbl9qdGkiOiI4N2U4NWE3YS05Y2RiLTQzMmQtOTAxZS00NjFlYmIwYmI1YjIiLCJldmVudF9pZCI6Ijk0NTg4N2QxLTlmZWYtNDhhYi04NzcwLWFmMmFiMmZhMGYxMyIsInRva2VuX3VzZSI6ImFjY2VzcyIsInNjb3BlIjoiYXdzLmNvZ25pdG8uc2lnbmluLnVzZXIuYWRtaW4iLCJhdXRoX3RpbWUiOjE3MDA3MTMzNDUsImV4cCI6MTcwMDczMTM0NSwiaWF0IjoxNzAwNzEzMzQ1LCJqdGkiOiJlZWY5YmViYS01MmY5LTRiYmYtOGVlNi03MjcxN2ZhZjQxYjMiLCJ1c2VybmFtZSI6ImNlc2FyQGxvb21pLmNvbS5icl8xZTQ2ZjJjZi1jMzJhLTRmNGMtYmE2OC01MDgxMDdjMWRjOTAifQ.OQTWXkLFrsKbgaaQOblShv2wvA_wMUoDzPyT2maAfW3A0Bnqkc0WmiFmTZPpD8KnbMpEbvcrGYfgWQBtBUf14vsYB_v__iOpfCppQkduVjvG4qSVm6FZjbKYPojS7PhBHmzm_qn4RGg2o5ZdKFV4fEpnhXkPnMj7tJJ492nkxNxkLuJ11yxhTK7PHB63Tc0CGp7qvMio7YgGbaAuadjHyNXoFaoHjz0raIGNSDvgp7E8r_XsI1k6zFixYuclAlnBr6RXBebTdO-uQWnCf1ns0Qh1IF5eCXmoCM5NRu6EydZ_WrXYObhbX-TnjxOQamVdSErMpK8LZrVgf9-yRPT89A"
      }
    }).then((res) => {

      console.log(res.data)
    }).catch((err) => {
      console.log(err)
    })
  })
})
