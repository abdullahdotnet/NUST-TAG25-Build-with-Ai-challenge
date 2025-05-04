"""
news_api.py
-----------
FastAPI service to serve video URLs from news text files.
"""

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware
from typing import List, Dict
import os
import re
from glob import glob

# Initialize FastAPI app
app = FastAPI(
    title="News Video API",
    description="API to retrieve AI-generated news video URLs",
    version="1.0.0"
)

# Configuration - Update path to point to Backend/news folder (one level up)
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
PARENT_DIR = os.path.dirname(BASE_DIR)  # Go up one level from FastApi to Backend
NEWS_FOLDER = os.path.join(PARENT_DIR, "news")

# Or if you're running from a different location, use absolute path:
# NEWS_FOLDER = "E:/University/NUST-TAG25-Build-with-Ai-challenge/Backend/news"

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"], 
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Response model
class NewsVideo(BaseModel):
    video_id: int
    title: str
    source: str
    video_url: str
    script: str

class NewsResponse(BaseModel):
    count: int
    videos: List[NewsVideo]

# Helper function to extract number from filename
def get_file_number(filename: str) -> int:
    """Extract number from news_video_X.txt filename."""
    match = re.search(r'news_video_(\d+)\.txt', filename)
    return int(match.group(1)) if match else -1

# Helper function to parse text file
def parse_news_file(filepath: str) -> Dict[str, str]:
    """Parse news text file and extract information."""
    info = {}
    try:
        with open(filepath, "r") as f:
            content = f.read()
        
        # Extract information using regex
        title_match = re.search(r'Title:\s*(.*)', content)
        source_match = re.search(r'Source:\s*(.*)', content)
        url_match = re.search(r'Video URL:\s*(.*)', content)
        script_match = re.search(r'Script:\s*(.*?)(?=\n*$)', content, re.DOTALL)
        
        info['title'] = title_match.group(1).strip() if title_match else "Untitled"
        info['source'] = source_match.group(1).strip() if source_match else "Unknown source"
        info['video_url'] = url_match.group(1).strip() if url_match else ""
        info['script'] = script_match.group(1).strip() if script_match else ""
        
        return info
    except Exception as e:
        print(f"Error reading file {filepath}: {e}")
        return {}

# API Routes
@app.get("/", response_model=Dict[str, str])
async def root():
    """Root endpoint with API information."""
    return {
        "message": "Welcome to News Video API",
        "endpoints": ["/news/videos", "/news/videos/{video_id}", "/news/summary"],
        "docs": "/docs",
        "news_folder": NEWS_FOLDER
    }

@app.get("/news/videos", response_model=NewsResponse)
async def get_news_videos(limit: int = 10):
    """Get the first N video URLs from news files."""
    # Check if news folder exists
    if not os.path.exists(NEWS_FOLDER):
        raise HTTPException(status_code=404, detail=f"News folder not found at {NEWS_FOLDER}")
    
    # Get all text files
    pattern = os.path.join(NEWS_FOLDER, "news_video_*.txt")
    files = glob(pattern)
    
    if not files:
        # List all files in the directory for debugging
        all_files = os.listdir(NEWS_FOLDER) if os.path.exists(NEWS_FOLDER) else []
        raise HTTPException(
            status_code=404, 
            detail=f"No news files found. Found files: {all_files}"
        )
    
    # Sort files by number
    files.sort(key=get_file_number)
    
    # Process first N files
    videos = []
    for filepath in files[:limit]:
        file_number = get_file_number(os.path.basename(filepath))
        info = parse_news_file(filepath)
        
        if info and info.get('video_url'):
            videos.append(NewsVideo(
                video_id=file_number,
                title=info['title'],
                source=info['source'],
                video_url=info['video_url'],
                script=info['script']
            ))
    
    return NewsResponse(count=len(videos), videos=videos)

@app.get("/news/videos/{video_id}", response_model=NewsVideo)
async def get_news_video_by_id(video_id: int):
    """Get specific news video by ID."""
    filepath = os.path.join(NEWS_FOLDER, f"news_video_{video_id}.txt")
    
    if not os.path.exists(filepath):
        raise HTTPException(status_code=404, detail=f"News video {video_id} not found")
    
    info = parse_news_file(filepath)
    
    if not info or not info.get('video_url'):
        raise HTTPException(status_code=500, detail="Error parsing news file")
    
    return NewsVideo(
        video_id=video_id,
        title=info['title'],
        source=info['source'],
        video_url=info['video_url'],
        script=info['script']
    )

@app.get("/news/summary")
async def get_news_summary():
    """Get a summary of all available news videos."""
    # Check if news folder exists
    if not os.path.exists(NEWS_FOLDER):
        return {
            "total_videos": 0,
            "videos": [],
            "error": f"News folder not found at {NEWS_FOLDER}"
        }
    
    pattern = os.path.join(NEWS_FOLDER, "news_video_*.txt")
    files = glob(pattern)
    
    summary = []
    for filepath in files:
        file_number = get_file_number(os.path.basename(filepath))
        info = parse_news_file(filepath)
        
        if info:
            summary.append({
                "video_id": file_number,
                "title": info['title'],
                "has_video": bool(info.get('video_url'))
            })
    
    # Sort by video_id
    summary.sort(key=lambda x: x['video_id'])
    
    return {
        "total_videos": len(summary),
        "videos": summary,
        "news_folder": NEWS_FOLDER
    }

# Debug endpoint to check folder existence
@app.get("/debug/folder-info")
async def debug_folder_info():
    """Debug endpoint to check news folder information."""
    folder_exists = os.path.exists(NEWS_FOLDER)
    files_in_folder = []
    
    try:
        if folder_exists:
            files_in_folder = os.listdir(NEWS_FOLDER)
    except Exception as e:
        files_in_folder = [f"Error listing files: {str(e)}"]
    
    return {
        "news_folder": NEWS_FOLDER,
        "folder_exists": folder_exists,
        "files_in_folder": files_in_folder,
        "base_dir": BASE_DIR,
        "current_working_dir": os.getcwd()
    }

# Run the server
if __name__ == "__main__":
    import uvicorn
    # Run the server
    uvicorn.run(app, host="0.0.0.0", port=8000)