DROP TABLE IF EXISTS admin_settings;
DROP TABLE IF EXISTS contacts;
DROP TABLE IF EXISTS house_types;
DROP TABLE IF EXISTS housing_estates;

CREATE TABLE admin_settings (
  id INTEGER PRIMARY KEY DEFAULT 1,
  username TEXT NOT NULL,
  password TEXT NOT NULL, -- Plain text for simplicity as requested, but conceptually should be hashed. User asked for default admin/admin1234
  hero_title TEXT,
  hero_subtitle TEXT,
  footer_description TEXT
);

INSERT INTO admin_settings (id, username, password, hero_title, hero_subtitle, footer_description) 
VALUES (1, 'admin', 'admin1234', 'Temukan Hunian Impian Anda', 'Pilihan properti terbaik dengan desain modern dan lokasi strategis untuk kenyamanan keluarga Anda.', 'Menyediakan hunian berkualitas dengan desain modern dan lingkungan yang nyaman.');

CREATE TABLE contacts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL,
  phone TEXT NOT NULL
);

INSERT INTO contacts (name, phone) VALUES ('Rizqi', '089669153464'), ('Achmad', '085780574811');

CREATE TABLE housing_estates (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT NOT NULL
);

INSERT INTO housing_estates (name) VALUES ('Cluster Dahlia'), ('Cluster Pinisi'), ('Cluster Edelweiss');

CREATE TABLE house_types (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  housing_estate_id INTEGER,
  name TEXT NOT NULL,
  price TEXT,
  description TEXT,
  specs TEXT, -- JSON string: {"luas": "...", "bedrooms": "...", ...}
  features TEXT, -- JSON string: ["Feature 1", "Feature 2"]
  images TEXT, -- JSON string: ["blob_id_1", "blob_id_2"] or URLs. User asked for BLOB in D1. We will store Base64 or Blob ID referencing another table? 
  -- Storing images directly in D1 text column (Base64) is possible but size limited. 
  -- Better: Create a separate table 'images' with BLOB content if using pure D1.
  video_link TEXT,
  FOREIGN KEY(housing_estate_id) REFERENCES housing_estates(id)
);

CREATE TABLE if not exists images (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  house_type_id INTEGER,
  type TEXT CHECK(type IN ('hero', 'house')) NOT NULL, 
  mime_type TEXT,
  data BLOB,
  FOREIGN KEY(house_type_id) REFERENCES house_types(id) ON DELETE CASCADE
);
