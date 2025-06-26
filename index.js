const express = require('express');
const cors = require('cors');
const axios = require('axios');
const app = express();

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

app.all('/proxy', async (req, res) => {
  // --- LOGS POUR DEBUG ---
  console.log(`[${new Date().toISOString()}] Reçu une requête sur /proxy !`);
  console.log(`Méthode: ${req.method}, URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  // --- FIN DES LOGS ---

  try {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL requise !');
    const response = await axios({
      method: req.method,
      url,
      headers: { ...req.headers, host: undefined },
      data: req.body,
    });
    res.status(response.status).send(response.data);
  } catch (e) {
    res.status(500).send(e.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
