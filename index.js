const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.all('/proxy', async (req, res) => {
  try {
    const url = req.query.url;
    if (!url) {
      return res.status(400).send('Paramètre "url" requis !');
    }
    const axiosConfig = {
      method: req.method,
      url: url,
      headers: { ...req.headers, host: undefined },
      data: req.body,
    };
    const response = await axios(axiosConfig);
    res.status(response.status).send(response.data);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
