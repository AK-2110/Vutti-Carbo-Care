import app from './api/index';

const PORT = 3001;

app.listen(PORT, () => {
  console.log(`[Local Dev] Backend API running on http://localhost:${PORT}`);
});
