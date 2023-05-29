import express from "express"


const app = express();
app.use(cors());
const port = 5000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.listen(port, () => {
    console.log(`UM app listening on port ${port}`)
})