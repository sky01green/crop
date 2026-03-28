# 🌿 Crop Disease Detection - Full-Stack AI Web Application

An AI-powered web application that detects crop leaf diseases from uploaded images and generates detailed health reports with treatment recommendations.

![Tech Stack](https://img.shields.io/badge/React-18-blue) ![Flask](https://img.shields.io/badge/Flask-3.1-green) ![TensorFlow](https://img.shields.io/badge/TensorFlow-2.16-orange) ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-16-blue)

## Features

- **User Authentication** - Register, login, JWT-based session management
- **Image Upload** - Drag-and-drop or click to upload crop leaf images
- **AI Disease Detection** - CNN model (MobileNetV2) trained on 54,000+ images, 38 disease classes
- **Health Reports** - Detailed reports with symptoms, causes, treatment, and prevention
- **Prediction History** - Track all past scans with search and pagination
- **Dashboard** - Stats overview with charts and recent activity
- **Responsive Design** - Works on desktop, tablet, and mobile
- **Demo Mode** - Runs without ML model for testing (returns simulated predictions)

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, React Router v6, Axios, Vite |
| Backend | Python Flask, Flask-SQLAlchemy, Flask-JWT-Extended |
| Database | SQLite (dev) / PostgreSQL (production) |
| AI Model | TensorFlow/Keras, MobileNetV2, Transfer Learning |
| Dataset | PlantVillage (54,000+ images, 38 classes) |

## Project Structure

```
crop-disease-detector/
├── frontend/                # React Application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   │   ├── common/      # Navbar, Footer, Loading, Button, ProtectedRoute
│   │   │   ├── auth/        # LoginForm, RegisterForm
│   │   │   ├── upload/      # ImageUploader, DragDropZone, ImagePreview
│   │   │   ├── prediction/  # PredictionResult, DiseaseInfo, ConfidenceBar
│   │   │   └── report/      # HealthReport, TreatmentCard, ReportDownload
│   │   ├── pages/           # Page components (9 pages)
│   │   ├── context/         # AuthContext (state management)
│   │   ├── services/        # API service layer (axios calls)
│   │   ├── hooks/           # Custom React hooks
│   │   ├── utils/           # Validators, formatters, constants
│   │   └── assets/          # CSS styles, images
│   ├── package.json
│   └── vite.config.js
│
├── backend/                 # Flask Application
│   ├── app/
│   │   ├── __init__.py      # App factory + extensions
│   │   ├── models/          # SQLAlchemy models (User, Prediction, HealthReport)
│   │   ├── routes/          # API blueprints (auth, predictions, reports, users)
│   │   ├── ml/              # ML pipeline (loader, preprocessor, predictor, report_generator)
│   │   └── utils/           # Validators, helpers
│   ├── ml_models/           # Trained .h5 model file (not in git)
│   ├── uploads/             # User uploaded images
│   ├── train_model.py       # Model training script
│   ├── config.py            # App configuration
│   ├── run.py               # Entry point
│   └── requirements.txt
│
├── docker-compose.yml       # Docker setup (optional)
└── README.md
```

## Quick Start

### Prerequisites

- **Python 3.10+** ([Download](https://www.python.org/downloads/))
- **Node.js 18+** ([Download](https://nodejs.org/))
- **Git** ([Download](https://git-scm.com/))

### Step 1: Clone the Project

```bash
git clone <your-repo-url>
cd crop-disease-detector
```

### Step 2: Backend Setup

```bash
# Navigate to backend
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# On macOS/Linux:
source venv/bin/activate
# On Windows:
venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Create environment file
cp .env.example .env
# Edit .env and set your secret keys

# Run the backend server
python run.py
```

The backend starts at **http://localhost:5000**

> **Note:** The app runs in **Demo Mode** without a trained ML model. It will return simulated predictions. See "Train the AI Model" section below to train a real model.

### Step 3: Frontend Setup

Open a **new terminal**:

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Run the development server
npm run dev
```

The frontend starts at **http://localhost:5173**

### Step 4: Use the App

1. Open **http://localhost:5173** in your browser
2. Click **Register** and create an account
3. Go to **Upload** and upload a crop leaf image
4. View the AI prediction and health report
5. Check your **History** for past scans
6. View your **Dashboard** for statistics

## Train the AI Model

### Download the Dataset

1. Go to [PlantVillage Dataset on Kaggle](https://www.kaggle.com/datasets/abdallahalidev/plantvillage-dataset)
2. Download and extract the dataset
3. You should have a `color/` folder with 38 subfolders

### Run Training

```bash
cd backend

# Activate virtual environment
source venv/bin/activate

# Train the model (takes 30-60 minutes depending on hardware)
python train_model.py --data_dir /path/to/plantvillage/color --epochs 15

# The model will be saved to ml_models/crop_disease_model.h5
```

### Training on Google Colab (Free GPU)

If you don't have a GPU, use Google Colab:

1. Upload `train_model.py` to Google Colab
2. Upload the PlantVillage dataset to Google Drive
3. Mount Google Drive in Colab
4. Run with GPU runtime:

```python
!pip install tensorflow
!python train_model.py --data_dir /content/drive/MyDrive/plantvillage/color --epochs 15
```

5. Download the saved `.h5` file and place it in `backend/ml_models/`

## API Documentation

### Authentication

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/auth/register` | `{name, email, password}` | `{token, user}` |
| POST | `/api/auth/login` | `{email, password}` | `{token, user}` |
| GET | `/api/auth/profile` | - | `{user}` |

### Predictions

| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | `/api/predictions/predict` | `FormData: image` | `{prediction, report}` |
| GET | `/api/predictions/history` | `?page=1&per_page=20` | `{predictions, total}` |
| GET | `/api/predictions/:id` | - | `{prediction, report}` |
| DELETE | `/api/predictions/:id` | - | `{message}` |
| GET | `/api/predictions/stats` | - | `{total_scans, ...}` |

### Reports

| Method | Endpoint | Response |
|--------|----------|----------|
| GET | `/api/reports/:id` | `{report, prediction}` |

> All endpoints except register/login require `Authorization: Bearer <token>` header.

## Database Schema

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│    users      │     │   predictions     │     │  health_reports   │
├──────────────┤     ├──────────────────┤     ├──────────────────┤
│ id (PK)      │──┐  │ id (PK)          │──┐  │ id (PK)          │
│ name         │  └──│ user_id (FK)     │  └──│ prediction_id(FK)│
│ email        │     │ image_filename   │     │ severity         │
│ password_hash│     │ predicted_class  │     │ description      │
│ created_at   │     │ confidence       │     │ symptoms         │
│ is_active    │     │ is_healthy       │     │ causes           │
└──────────────┘     │ disease_name     │     │ treatment        │
                     │ crop_name        │     │ prevention       │
                     │ created_at       │     │ recommended_prods│
                     └──────────────────┘     │ created_at       │
                                              └──────────────────┘
```

## Deployment

### Free Tier Deployment

| Service | Platform | Free Tier |
|---------|----------|-----------|
| Frontend | [Vercel](https://vercel.com) | Unlimited deploys, 100GB bandwidth |
| Backend | [Render](https://render.com) | 750 free hours/month |
| Database | [Supabase](https://supabase.com) | 500MB database, 1GB storage |

### Deploy Frontend to Vercel

```bash
cd frontend
npm run build
# Install Vercel CLI: npm i -g vercel
vercel
```

Set environment variable in Vercel dashboard:
- `VITE_API_URL` = `https://your-backend.onrender.com/api`

### Deploy Backend to Render

1. Push code to GitHub
2. Create a new Web Service on [Render](https://render.com)
3. Connect your GitHub repo
4. Set root directory to `backend`
5. Build command: `pip install -r requirements.txt`
6. Start command: `gunicorn run:app`
7. Add environment variables:
   - `DATABASE_URL` = your Supabase PostgreSQL URL
   - `SECRET_KEY` = random string
   - `JWT_SECRET_KEY` = random string
   - `FLASK_ENV` = production

### Docker Deployment

```bash
# Start everything with Docker Compose
docker-compose up -d

# Backend: http://localhost:5000
# Frontend: http://localhost:5173
# Database: localhost:5432
```

## Supported Crops & Diseases (38 Classes)

| Crop | Diseases Detected |
|------|-------------------|
| Apple | Apple Scab, Black Rot, Cedar Apple Rust, Healthy |
| Blueberry | Healthy |
| Cherry | Powdery Mildew, Healthy |
| Corn | Cercospora/Gray Leaf Spot, Common Rust, Northern Leaf Blight, Healthy |
| Grape | Black Rot, Esca, Leaf Blight, Healthy |
| Orange | Huanglongbing (Citrus Greening) |
| Peach | Bacterial Spot, Healthy |
| Pepper | Bacterial Spot, Healthy |
| Potato | Early Blight, Late Blight, Healthy |
| Raspberry | Healthy |
| Soybean | Healthy |
| Squash | Powdery Mildew |
| Strawberry | Leaf Scorch, Healthy |
| Tomato | Bacterial Spot, Early Blight, Late Blight, Leaf Mold, Septoria Leaf Spot, Spider Mites, Target Spot, Yellow Leaf Curl Virus, Mosaic Virus, Healthy |

## Troubleshooting

| Issue | Solution |
|-------|----------|
| `ModuleNotFoundError` | Activate venv: `source venv/bin/activate` |
| CORS errors in browser | Backend CORS is configured for all origins. Check backend is running. |
| "ML model not found" warning | Normal in demo mode. Train model or ignore for testing. |
| Port 5000 already in use | Kill existing process: `lsof -i :5000` then `kill -9 <PID>` |
| npm install fails | Delete `node_modules` and `package-lock.json`, then `npm install` |
| Database errors after model changes | Delete `app.db` and restart backend (tables recreated) |

## License

MIT License - free to use for personal and commercial projects.
