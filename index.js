const express = require('express');
const cors = require('cors');
const axios = require('axios');
const multer = require('multer');
const FormData = require('form-data');
const upload = multer();

const app = express();

app.use(cors());

app.all('/proxy', upload.any(), async (req, res) => {
  // --- LOGS POUR DEBUG ---
  console.log(`[${new Date().toISOString()}] Reçu une requête sur /proxy !`);
  console.log(`Méthode: ${req.method}, URL: ${req.url}`);
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  console.log('Files:', req.files);
  // --- FIN DES LOGS ---

  try {
    const url = req.query.url;
    if (!url) return res.status(400).send('URL requise !');

    // Reconstruire le form-data à forwarder à Make
    const form = new FormData();
    for (const [k, v] of Object.entries(req.body)) form.append(k, v);
    for (const f of req.files) {
      form.append(f.fieldname, f.buffer, { filename: f.originalname, contentType: f.mimetype });
    }

    const response = await axios({
      method: req.method,
      url,
      headers: form.getHeaders(),
      data: form,
      maxContentLength: Infinity,
      maxBodyLength: Infinity,
    });

    res.status(response.status).send(response.data);
  } catch (e) {
    console.error(e);
    res.status(500).send(e.toString());
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Proxy running on port ${PORT}`));
