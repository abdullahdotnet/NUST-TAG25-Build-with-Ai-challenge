Here's the complete README in markdown format for your Anchora AI News Anchor project:

# Anchora - AI News Anchor

## 📰 Overview

Anchora is an innovative AI-powered news platform that creates personalized news videos using virtual anchors. This system automatically fetches the latest news, transforms it into conversational scripts, and generates lifelike videos with both male and female virtual anchors presenting the news in a professional broadcast style.

## ✨ Key Features

- 🤖 **AI News Presenters** - Realistic virtual anchors present the latest news
- 🔄 **Automated Pipeline** - Complete automation from news fetching to video generation
- 🌐 **Multi-Category News** - Coverage across business, technology, sports, and general news
- 🎭 **Gender Diversity** - Both male and female virtual anchors
- 🧠 **AI-Powered Scripts** - Uses Gemini AI to craft natural, broadcast-ready news scripts
- 📱 **Modern Frontend** - React-based responsive web interface
- 🔌 **FastAPI Backend** - Robust API system to serve news content

## 🏗️ Project Architecture

```
Anchora/
├── Backend/              # Server-side components
│   ├── FastApi/          # FastAPI implementation
│   │   └── news_api.py   # API endpoints for news content
│   ├── news/             # Generated news content
│   └── scripts/
│       ├── apipipeline.py        # News API data pipeline
│       └── webscrapepipeline.py  # Web scraping pipeline
├── Avatar/               # Virtual anchor generation
│   └── work3.py          # Video generation script
├── Frontend/             # React-based web interface
│   ├── public/
│   └── src/
│       ├── components/
│       │   ├── Navbar.js
│       │   └── Footer.js
│       ├── pages/
│       │   ├── Home.js
│       │   ├── News.js
│       │   ├── About.js
│       │   └── Contact.js
│       └── App.js
└── scripts/              # Automation scripts
    └── run_pipeline.bat  # Automated pipeline executor
```

## 🚀 Getting Started

### Prerequisites

- Python 3.10+ with pip
- Node.js and npm
- MongoDB
- API keys:
  - NewsAPI
  - Google Gemini

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/anchora.git
   cd anchora
   ```

2. **Set up the backend**
   ```bash
   cd Backend
   pip install -r requirements.txt
   ```

3. **Create .env file with your API keys**
   ```
   MONGO_URI="mongodb://localhost:27017/"
   NEWS_API_KEY="your_news_api_key"
   GEMINI_API_KEY="your_gemini_api_key"
   ```

4. **Set up the frontend**
   ```bash
   cd ../Frontend
   npm install
   ```

### Running the Application

1. **Start the backend server**
   ```bash
   cd Backend/FastApi
   uvicorn news_api:app --reload
   ```

2. **Run the automated pipeline**
   ```bash
   cd ../../scripts
   run_pipeline.bat
   ```

3. **Start the frontend**
   ```bash
   cd ../Frontend
   npm start
   ```

4. **Access the application**
   Open your browser and go to: `http://localhost:3000`

## 🔄 Pipeline Workflow

1. **News Collection**
   - Fetches latest news from NewsAPI
   - Scrapes additional news from trusted web sources
   - Stores raw articles in MongoDB

2. **Content Transformation**
   - Processes raw news into conversational scripts using Google's Gemini AI
   - Optimizes scripts for broadcast-style delivery
   - Removes greetings and maintains consistent professional tone

3. **Video Generation**
   - Generates realistic news anchor videos
   - Synchronizes lip movements with script audio
   - Outputs MP4 files with news presentation

4. **Content Serving**
   - FastAPI serves video URLs and metadata
   - Frontend displays videos in an intuitive interface

## 📋 API Endpoints

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/` | GET | API information and available endpoints |
| `/news/videos` | GET | List of news videos with pagination support |
| `/news/videos/{video_id}` | GET | Get specific news video by ID |
| `/news/summary` | GET | Summary of all available news videos |
| `/debug/folder-info` | GET | Debug endpoint for folder information |

## 🛠️ Technologies Used

- **Backend:**
  - FastAPI
  - MongoDB
  - Google Generative AI (Gemini)
  - NewsAPI
  - Python requests/BeautifulSoup

- **Frontend:**
  - React
  - React Router
  - Tailwind CSS

- **AI & Media:**
  - Google Gemini AI for script generation
  - Custom avatar generation technology

## 🧩 Project Components

### Backend

The backend system consists of:

1. **News Collection Pipeline** - Fetches and processes news from various sources
2. **FastAPI Service** - Serves video URLs and metadata
3. **MongoDB Database** - Stores raw news and processed conversational scripts

### Frontend

The React-based frontend provides:

1. **Home Page** - Introduction to Anchora with featured news
2. **News Page** - Complete listing of all news videos
3. **About Page** - Information about the project
4. **Contact Page** - Contact information

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgements

- [NewsAPI](https://newsapi.org) for providing news data
- [Google Generative AI](https://ai.google.dev/) for script generation
- [FastAPI](https://fastapi.tiangolo.com/) for the robust API framework
- [React](https://reactjs.org/) for the frontend framework
- [Tailwind CSS](https://tailwindcss.com/) for styling the frontend