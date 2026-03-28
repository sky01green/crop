# Project Architecture: Crop Disease Detector

This document provides a detailed breakdown of the complete folder structure, file organization, and overall architecture of the Crop Disease Detector application.

## 🏗️ Overall Architecture
The application follows a standard **Client-Server-Database** architecture:
1.  **Frontend (React + Vite)**: Handles user interaction, image uploads, and dashboard visualization.
2.  **Backend (Flask)**: Processes images using AI, handles authentication, and manages reports.
3.  **Database (Supabase PostgreSQL)**: Persists user data, scan history, and disease health reports.
4.  **ML Engine (TensorFlow)**: Runs real-time inference on leaf images using a trained Convolutional Neural Network (CNN).

---

## 📂 Root Directory
| Folder/File | Description |
| :--- | :--- |
| `backend/` | Contains the Flask API and ML logic. |
| `frontend/` | Contains the React web application. |
| `docker-compose.yml` | Orchestrates running both backend and frontend as containers. |
| `README.md` | General setup and installation guide. |

---

## 🐍 Backend Architecture (`/backend`)
The backend is structured using the **Flask Application Factory Pattern**.

### Core Backend Folders
-   **`app/`**: The main application package containing all logic.
    -   **`ml/`**: Machine Learning pipeline.
        -   `preprocessor.py`: Resizes (to 128x128) and normalizes images for the model.
        -   `model_loader.py`: Loads the `.h5` model file from disk once at startup.
        -   `predictor.py`: Runs images through the model and parses output classes.
        -   `report_generator.py`: Generates detailed symptoms and treatments based on the detected disease.
    -   **`models/`**: SQLAlchemy Database models.
        -   `user.py`: User accounts and password hashing (Bcrypt).
        -   `prediction.py`: Stores scan metadata (confidence, class, path).
        -   `report.py`: Stores health report details for each scan.
    -   **`routes/`**: API Endpoints organized by blueprint.
        -   `auth.py`: Login, Register, Profile, and Password Reset.
        -   `predictions.py`: Image upload (POST /predict) and Scan History.
        -   `users.py`: Profile updates and management.
-   **`ml_models/`**: Storage for your trained AI models (e.g., `trained_model.h5`).
-   **`uploads/`**: Local storage for uploaded leaf images.
-   **`migrations/`**: Database schema version history (Alembic).

### Key Backend Files
-   **`run.py`**: Entry point to start the Flask development server.
-   **`config.py`**: Configuration for environment variables, Database URL, and model paths.
-   **`.env`**: Private configuration (Database passwords, API keys).
-   **`requirements.txt`**: List of all Python dependencies (Flask, TensorFlow, SQLAlchemy, etc.).

---

## ⚛️ Frontend Architecture (`/frontend`)
Built with React and Vite for a fast development experience and high-performance production build.

### Core Frontend Folders
-   **`src/`**: React source code.
    -   **`pages/`**: Full-page components (Home, Dashboard, History, Scan Result).
    -   **`components/`**: Reusable UI elements (Navbar, Cards, Buttons, Form inputs).
    -   **`services/`**: API communication layer using Axios.
        -   `api.js`: Central configuration with interceptors for JWT tokens.
        -   `authService.js`: User-related API calls.
        -   `predictionService.js`: Scanning and history-related API calls.
    -   **`context/`**: Global state management (e.g., `AuthContext` to track logged-in state).
    -   **`utils/`**: Helper functions like `formatters.js` (date formatting, URL generation).
    -   **`styles/`**: Global CSS and theme tokens.

### Key Frontend Files
-   **`.env`**: Contains `VITE_API_URL` pointing to the backend (http://localhost:5000/api).
-   **`vite.config.js`**: Build configuration for Vite.
-   **`package.json`**: NPM scripts and frontend dependencies (React Router, Axios, Lucide-react).

---

## 💾 Database Integration (Supabase)
We use a cloud-hosted PostgreSQL database on **Supabase**.
-   The backend connects via the `DATABASE_URL` in `.env`.
-   **Relationships**: Each `User` has many `Predictions`. Each `Prediction` has one `HealthReport`.
-   **Auto-Sync**: When you run the app, the backend automatically ensures the schema matches your models using `db.create_all()`.

---

## 🧠 ML Integration
1.  **Image Upload**: Farmer uploads a leaf photo.
2.  **Processing**: Backend resizes it to **128x128 pixels** (RGB).
3.  **Inference**: The `trained_model.h5` predicts the most likely disease index.
4.  **Mapping**: The index is mapped to a human-readable name in `model_loader.py`.
5.  **Reporting**: A specialized library matches the disease to a treatment database to provide immediate action items.

---

## 🚀 Summary of Data Flow
**Upload Image** ➔ **Check Auth** ➔ **Save Image** ➔ **Preprocess (128x128)** ➔ **CNN Prediction** ➔ **Save to Supabase** ➔ **Generate Report** ➔ **Display on Result Page**
