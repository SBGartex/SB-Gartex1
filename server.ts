import express from "express";
import { createServer as createViteServer } from "vite";
import Database from "better-sqlite3";
import path from "path";
import fs from "fs";
import multer from "multer";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const db = new Database("sb_gartex.db");

// Ensure uploads directory exists
const uploadDir = path.join(process.cwd(), "uploads");
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

// Configure Multer
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  },
});
const upload = multer({ storage });

// Initialize Database
db.exec(`
  CREATE TABLE IF NOT EXISTS settings (
    key TEXT PRIMARY KEY,
    value TEXT
  );

  CREATE TABLE IF NOT EXISTS posts (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title_ko TEXT,
    title_en TEXT,
    content_ko TEXT,
    content_en TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );

  CREATE TABLE IF NOT EXISTS products (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name_ko TEXT,
    name_en TEXT,
    description_ko TEXT,
    description_en TEXT,
    category TEXT,
    image_url TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  );
`);

// Seed default settings if not exists
const seedSettings = [
  ['site_name', 'SB Gartex'],
  ['primary_color', '#008080'], // Teal
  ['bg_color', '#001f3f'],      // Navy
  ['font_family', 'Inter'],
  ['contact_email', 'andy@sbgartex.com'],
  ['logo_url', 'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=200&h=80'],
  ['about_title_ko', '품질과 신뢰의 파트너'],
  ['about_title_en', 'Your Partner in Quality & Trust'],
  ['about_content_ko', 'SB Gartex는 20년 이상의 업력을 가진 의류 제조 전문 기업입니다. 최첨단 설비와 숙련된 기술력을 바탕으로 전 세계 유명 브랜드의 OEM/ODM 생산을 담당하고 있습니다.'],
  ['about_content_en', 'SB Gartex is a specialized apparel manufacturing company with over 20 years of experience. Based on state-of-the-art facilities and skilled technology, we are responsible for OEM/ODM production for famous brands worldwide.'],
  ['about_image_url', 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&q=80&w=800'],
  ['partner_logos', JSON.stringify([
    'https://images.unsplash.com/photo-1599305090748-366398a67cb1?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1599305090839-1191d3a11957?auto=format&fit=crop&q=80&w=200',
    'https://images.unsplash.com/photo-1599305090748-366398a67cb1?auto=format&fit=crop&q=80&w=200'
  ])],
  ['social_links', JSON.stringify({ linkedin: 'https://linkedin.com', instagram: 'https://instagram.com', facebook: 'https://facebook.com' })],
  ['hero_bg_url', 'https://images.unsplash.com/photo-1551488831-00ddcb6c6bd3?auto=format&fit=crop&q=80&w=1920&sat=-100'],
  ['hero_title_ko', '이런 마음으로 이렇게 귀하게'],
  ['hero_title_en', 'Setting the new standard for global apparel production'],
  ['hero_subtitle_ko', '최고의 품질과 기술력으로 글로벌 패션 브랜드의 성공적인 파트너가 되어드립니다.'],
  ['hero_subtitle_en', 'We are a successful partner for global fashion brands with the best quality and technology.'],
  ['formspree_url', 'https://formspree.io/f/xykdqogd']
];

const insertSetting = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
seedSettings.forEach(([key, value]) => insertSetting.run(key, value));

// Seed initial posts and products
const postCount = db.prepare('SELECT COUNT(*) as count FROM posts').get() as { count: number };
if (postCount.count === 0) {
  const insertPost = db.prepare('INSERT INTO posts (title_ko, title_en, content_ko, content_en, image_url) VALUES (?, ?, ?, ?, ?)');
  insertPost.run(
    '2024 F/W 컬렉션 생산 시작', 
    '2024 F/W Collection Production Starts', 
    '새로운 시즌을 위한 고품질 의류 생산이 본격적으로 시작되었습니다.', 
    'High-quality apparel production for the new season has officially begun.',
    'https://images.unsplash.com/photo-1523381210434-271e8be1f52b?auto=format&fit=crop&q=80&w=800'
  );
  insertPost.run(
    '친환경 소재 도입 확대', 
    'Expanding Eco-friendly Materials', 
    '지속 가능한 패션을 위해 리사이클 폴리에스터 사용을 확대합니다.', 
    'We are expanding the use of recycled polyester for sustainable fashion.',
    'https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?auto=format&fit=crop&q=80&w=800'
  );
}

const productCount = db.prepare('SELECT COUNT(*) as count FROM products').get() as { count: number };
if (productCount.count === 0) {
  const insertProduct = db.prepare('INSERT INTO products (name_ko, name_en, description_ko, description_en, category, image_url) VALUES (?, ?, ?, ?, ?, ?)');
  insertProduct.run(
    '프리미엄 코튼 티셔츠', 'Premium Cotton T-shirt', '최고급 수피마 코튼을 사용한 베이직 티셔츠입니다.', 'Basic t-shirt made with premium Supima cotton.', 'T-Shirts', 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&q=80&w=800'
  );
  insertProduct.run(
    '테크니컬 윈드브레이커', 'Technical Windbreaker', '방수 및 투습 기능이 뛰어난 기능성 자켓입니다.', 'Functional jacket with excellent waterproof and breathable features.', 'Outerwear', 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?auto=format&fit=crop&q=80&w=800'
  );
  insertProduct.run(
    '슬림핏 데님 팬츠', 'Slim Fit Denim Pants', '자연스러운 워싱과 편안한 신축성을 가진 데님입니다.', 'Denim with natural washing and comfortable stretch.', 'Pants', 'https://images.unsplash.com/photo-1542272604-787c3835535d?auto=format&fit=crop&q=80&w=800'
  );
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());
  app.use("/uploads", express.static(uploadDir));

  // File Upload Endpoint
  app.post("/api/upload", upload.single("file"), (req, res) => {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ url: fileUrl });
  });

  // API Routes
  app.get("/api/settings", (req, res) => {
    const rows = db.prepare('SELECT * FROM settings').all();
    const settings = rows.reduce((acc: any, row: any) => {
      acc[row.key] = row.value;
      return acc;
    }, {});
    res.json(settings);
  });

  app.post("/api/settings", (req, res) => {
    const updates = req.body;
    const updateStmt = db.prepare('INSERT OR REPLACE INTO settings (key, value) VALUES (?, ?)');
    const transaction = db.transaction((data) => {
      for (const [key, value] of Object.entries(data)) {
        updateStmt.run(key, value);
      }
    });
    transaction(updates);
    res.json({ success: true });
  });

  app.get("/api/posts", (req, res) => {
    const posts = db.prepare('SELECT * FROM posts ORDER BY created_at DESC').all();
    res.json(posts);
  });

  app.post("/api/posts", (req, res) => {
    const { title_ko, title_en, content_ko, content_en, image_url } = req.body;
    const stmt = db.prepare('INSERT INTO posts (title_ko, title_en, content_ko, content_en, image_url) VALUES (?, ?, ?, ?, ?)');
    const info = stmt.run(title_ko, title_en, content_ko, content_en, image_url);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/posts/:id", (req, res) => {
    db.prepare('DELETE FROM posts WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  app.get("/api/products", (req, res) => {
    const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();
    res.json(products);
  });

  app.post("/api/products", (req, res) => {
    const { name_ko, name_en, description_ko, description_en, category, image_url } = req.body;
    const stmt = db.prepare('INSERT INTO products (name_ko, name_en, description_ko, description_en, category, image_url) VALUES (?, ?, ?, ?, ?, ?)');
    const info = stmt.run(name_ko, name_en, description_ko, description_en, category, image_url);
    res.json({ id: info.lastInsertRowid });
  });

  app.delete("/api/products/:id", (req, res) => {
    db.prepare('DELETE FROM products WHERE id = ?').run(req.params.id);
    res.json({ success: true });
  });

  // Vite middleware for development
  const isProd = process.env.NODE_ENV === "production" || fs.existsSync(path.join(__dirname, "dist"));
  
  if (!isProd) {
    console.log("Starting in development mode with Vite middleware...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Starting in production mode, serving static files from dist...");
    app.use(express.static(path.join(__dirname, "dist")));
    app.get("*", (req, res) => {
      res.sendFile(path.join(__dirname, "dist", "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
