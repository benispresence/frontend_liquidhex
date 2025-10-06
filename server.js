import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.static(path.join(__dirname, 'dist')));

app.use('/merkle_tree_proofs', express.static(path.join(__dirname, 'merkle_tree_proofs')));

app.get('/merkle_tree_base.csv', (req, res) => {
  res.sendFile(path.join(__dirname, 'merkle_tree_base.csv'));
});

app.get('/eligible_stakes.csv', (req, res) => {
  res.sendFile(path.join(__dirname, 'eligible_stakes.csv'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server running on http://0.0.0.0:${PORT}`);
});
