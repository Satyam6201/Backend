const express = require('express');
const app = express();

app.listen(8080, () => {
    console.log("Server is Started!")
});

app.get("/", (req, res) => {
    res.send("This is a root directery");
})

app.get("/apple", (req, res) => {
    res.send("Apple is Calling!");
});

app.post("/mango", (req, res) => {
    res.send("This is post request!")
});

app.get("/:username", (req, res) => {
    console.log(req.params);
    res.send("Username is Calling!")
})

// app.use((req, res) => {
//     console.log("request recevied!");
//     res.send("<h1>Hello From server!</h1>")
// })