const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const productsFilePath = 'products.json';
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Serve admin.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Post a new product
app.post('/products', upload.single('image'), (req, res) => {
  try {
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.file.filename,
    };
    products.push(product);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(product); // Return 201 Created status code
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Get a single product by index
app.get('/products/:index', (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < products.length) {
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Update a product
app.put('/products/:index', upload.single('image'), (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < products.length) {
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.file ? req.file.filename : products[index].image,
    };
    products[index] = product;
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Delete a product
app.delete('/products/:index', (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < products.length) {
    products.splice(index, 1);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Serve images
app.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Create upload directory if it doesn't exist
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 5, // 5MB file size limit
  },
  fileFilter(req, file, cb) {
    if (!file.originalname.match(/\.(jpg|jpeg|png)$/)) {
      return cb(new Error('Only image files are allowed'));
    }
    cb(null, true);
  },
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(__dirname));

const productsFilePath = 'products.json';
let products = JSON.parse(fs.readFileSync(productsFilePath, 'utf8'));

// Serve admin.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'admin.html'));
});

// Get all products
app.get('/products', (req, res) => {
  res.json(products);
});

// Post a new product
app.post('/products', upload.single('image'), (req, res) => {
  try {
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.file.filename,
    };
    products.push(product);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.status(201).json(product); // Return 201 Created status code
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error uploading file' });
  }
});

// Get a single product by index
app.get('/products/:index', (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < products.length) {
    res.json(products[index]);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Update a product
app.put('/products/:index', upload.single('image'), (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < products.length) {
    const product = {
      name: req.body.name,
      description: req.body.description,
      price: req.body.price,
      image: req.file ? req.file.filename : products[index].image,
    };
    products[index] = product;
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.json(product);
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Delete a product
app.delete('/products/:index', (req, res) => {
  const index = req.params.index;
  if (index >= 0 && index < products.length) {
    products.splice(index, 1);
    fs.writeFileSync(productsFilePath, JSON.stringify(products, null, 2));
    res.json({ message: 'Product deleted successfully' });
  } else {
    res.status(404).json({ message: 'Product not found' });
  }
});

// Serve images
app.get('/uploads/:imageName', (req, res) => {
  const imageName = req.params.imageName;
  const imagePath = path.join(__dirname, 'uploads', imageName);
  if (fs.existsSync(imagePath)) {
    res.sendFile(imagePath);
  } else {
    res.status(404).json({ message: 'Image not found' });
  }
});

app.listen(port, () => {
  console.log(`Server started on port ${port}`);
});
fetch('your/api/endpoint') //check this URL
  .then(response => {
    if (!response.ok) {
      // Handle HTTP errors (e.g., 404, 500)
      throw new Error('Network response was not ok');
    }
    // Check if the Content-Type is JSON before parsing
    const contentType = response.headers.get('content-type');
    if (!contentType || !contentType.includes('application/json')) {
      throw new TypeError('Expected JSON, but received ' + contentType);
    }
    return response.json(); // If it's JSON, parse it
  })
  .then(data => {
    // Process the JSON data here
    console.log(data);
  })
  .catch(error => {
    // Handle parsing errors or network errors
    console.error('Error:', error);
  });
