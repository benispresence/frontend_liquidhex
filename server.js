import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5000;

// Disable caching for CSV files and HTML
app.use((req, res, next) => {
  if (req.url.endsWith('.csv') || req.url.endsWith('.html') || req.url === '/') {
    res.set('Cache-Control', 'no-store, no-cache, must-revalidate, private');
    res.set('Pragma', 'no-cache');
    res.set('Expires', '0');
  }
  next();
});

// Serve static files from dist
app.use(express.static(path.join(__dirname, 'dist')));

// Serve merkle proof files with proper headers
app.use('/merkle_tree_proofs', express.static(path.join(__dirname, 'merkle_tree_proofs')));

// Serve CSV files explicitly with proper Content-Type
app.get('/merkle_tree_base.csv', (req, res) => {
  res.type('text/csv');
  res.sendFile(path.join(__dirname, 'merkle_tree_base.csv'));
});

app.get('/eligible_stakes.csv', (req, res) => {
  res.type('text/csv');
  res.sendFile(path.join(__dirname, 'eligible_stakes.csv'));
});

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`Production server running on http://0.0.0.0:${PORT}`);
});
