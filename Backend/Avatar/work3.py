"""
news_to_video.py
----------------
Fetches latest news from MongoDB and creates talking-avatar videos for each story.
With API failover support for both ElevenLabs and D-ID.
"""

import time
import requests
import pymongo
from requests.auth import HTTPBasicAuth
from typing import List, Dict, Optional, Tuple
import random
import os
import re

# -------------------------------------------------------------------
# 🔒  API CREDENTIALS
# -------------------------------------------------------------------
ELEVEN_API_KEY = [
    "sk_593f3748e11c38548bc0f4d78d23de02f393da80d23e2f06",
    "sk_574b462888c0af807691535070b4f69cd24a2068ca615624",
    "sk_61f1bcaefb4fb8c37c6ace0e580f9355170fab078ae984a0",
    "sk_097e749d19537eae752882f3a6ca57545c6b775f9638cd5e",
    "sk_f5b12c9bea368d61c7c37faf01c098952fbdfcaea32bea9d",
    "sk_7bf01ed2c16e6252b7d3f7549d25d9688b88408423c56c75",
    "sk_04477b5473e8d720c5081ef25653cf0df2ef9981c6f709ea"
]
ELEVEN_VOICE_ID = "21m00Tcm4TlvDq8ikWAM"

DID_API_KEY = [
    'YWJkdWxsYWhkb3RuZXQyMEBnbWFpbC5jb20:EGWni8AXBYqoPKfewDZo1',
    'YnNkc2YyMWEwMTlAcHVjaXQuZWR1LnBr:EA-OQ2u6RnxzCd4kwITUl',
    'c3llZC5oYW16YS5kc0BnbWFpbC5jb20:MnhofVPa2OcH3v4nxDZmH',
    'aGFtemFmYWl6OTY3MkBnbWFpbC5jb20:F3l8eJtA1UgBT9kcj0iGm',
    'YXpoYXJ6YWlkaTE1MEBnbWFpbC5jb20:JTObkXu3eXFPQ-CcqUimC',
    'c2NvYmJ5ZG9iYnk0MEBnbWFpbC5jb20:Qd4CPrQ65xEtg4o7xOzFF',
    'YnNkc2YyMW0wNDBAcHVjaXQuZWR1LnBr:afpT-_ER27kZzbErmyO6e',
    'aWFiZHVsbGFoLnNoZWlraDFAZ21haWwuY29t:HqU_1pB7AOLlsk0eFBXwX'
]

# MongoDB Connection
MONGO_URL = "mongodb://localhost:27017"
DB_NAME = "news_database"
COLLECTION_NAME = "conversational_news"

# -------------------------------------------------------------------
# 📰 Transition Messages
# -------------------------------------------------------------------
TRANSITIONS = [
    "Now, let's move on to our next story.",
    "And in other news...",
    "Next up, we have...",
    "Moving to our next headline...",
    "Turning now to another important story...",
    "Coming up next...",
    "And now for our next update...",
    "Let's continue with...",
    "Our next story brings us to...",
    "In another development..."
]

# -------------------------------------------------------------------
# 📱 ElevenLabs TTS Function with Failover
# -------------------------------------------------------------------
def tts_generate_with_failover(text: str, voice_id: str, api_keys: List[str]) -> bytes:
    """Generate speech from text using ElevenLabs API with failover."""
    for attempt, api_key in enumerate(api_keys):
        try:
            print(f"   🔑 Trying ElevenLabs API key {attempt + 1}/{len(api_keys)}...")
            url = f"https://api.elevenlabs.io/v1/text-to-speech/{voice_id}"
            headers = {
                "xi-api-key": api_key,
                "Accept": "audio/mpeg",
                "Content-Type": "application/json"
            }
            body = {
                "text": text,
                "model_id": "eleven_monolingual_v1",
                "voice_settings": {
                    "stability": 0.45,
                    "similarity_boost": 0.75
                }
            }
            
            r = requests.post(url, json=body, headers=headers, timeout=60000)
            if r.status_code == 200:
                return r.content
            else:
                print(f"   ⚠️ ElevenLabs API key {attempt + 1} failed: {r.status_code}")
                continue
        except Exception as e:
            print(f"   ⚠️ ElevenLabs API key {attempt + 1} error: {str(e)}")
            continue
    
    raise RuntimeError("All ElevenLabs API keys failed")

# -------------------------------------------------------------------
# 🎬 D-ID Functions with Failover
# -------------------------------------------------------------------
def parse_did_credentials(credential_string: str) -> Tuple[str, str]:
    """Parse D-ID credentials from 'username:password' format."""
    try:
        username, password = credential_string.split(':')
        return username, password
    except ValueError:
        raise ValueError(f"Invalid D-ID credential format: {credential_string}")

def did_upload_audio_with_failover(mp3_bytes: bytes, filename: str, did_credentials: List[str]) -> str:
    """Upload audio to D-ID with failover."""
    for attempt, credential in enumerate(did_credentials):
        try:
            print(f"   🔑 Trying D-ID credential {attempt + 1}/{len(did_credentials)}...")
            username, password = parse_did_credentials(credential)
            auth = HTTPBasicAuth(username, password)
            
            url = "https://api.d-id.com/audios"
            files = {"audio": (filename, mp3_bytes, "audio/mpeg")}
            r = requests.post(url, files=files, auth=auth, timeout=60)
            
            if r.status_code == 201:
                return r.json()["url"]
            else:
                print(f"   ⚠️ D-ID credential {attempt + 1} failed: {r.status_code}")
                continue
        except Exception as e:
            print(f"   ⚠️ D-ID credential {attempt + 1} error: {str(e)}")
            continue
    
    raise RuntimeError("All D-ID credentials failed for audio upload")

def did_create_video_with_failover(audio_url: str, image_or_presenter: dict, did_credentials: List[str], add_subtitles: bool = True) -> str:
    """Create talking-avatar video with D-ID with failover."""
    for attempt, credential in enumerate(did_credentials):
        try:
            print(f"   🔑 Trying D-ID credential {attempt + 1}/{len(did_credentials)}...")
            username, password = parse_did_credentials(credential)
            auth = HTTPBasicAuth(username, password)
            
            url = "https://api.d-id.com/talks"
            payload = {
                **image_or_presenter,
                "script": {
                    "type": "audio",
                    "audio_url": audio_url
                },
                "config": {
                    "auto_subtitles": add_subtitles  # Enable automatic subtitles
                }
            }
            headers = {"Content-Type": "application/json", "Accept": "application/json"}
            r = requests.post(url, json=payload, auth=auth, headers=headers, timeout=60)
            
            if r.status_code == 201:
                return r.json()["id"]
            else:
                print(f"   ⚠ D-ID credential {attempt + 1} failed: {r.status_code}")
                continue
        except Exception as e:
            print(f"   ⚠ D-ID credential {attempt + 1} error: {str(e)}")
            continue
    
    raise RuntimeError("All D-ID credentials failed for video creation")
def did_poll_video_with_failover(video_id: str, did_credentials: List[str], timeout: int = 600) -> str:
    """Poll D-ID until video is ready with failover."""
    # Use the same credential that created the video
    for attempt, credential in enumerate(did_credentials):
        try:
            username, password = parse_did_credentials(credential)
            auth = HTTPBasicAuth(username, password)
            
            url = f"https://api.d-id.com/talks/{video_id}"
            start = time.time()
            
            while True:
                r = requests.get(url, auth=auth, timeout=30)
                if r.status_code == 200:
                    data = r.json()
                    status = data.get("status")
                    if status == "done":
                        return data["result_url"]
                    if status == "error":
                        raise RuntimeError(f"D-ID reported error: {data.get('error')}")
                    if time.time() - start > timeout:
                        raise TimeoutError(f"Timed out after {timeout} s.")
                    time.sleep(5)
                else:
                    break  # Try next credential
            
        except Exception as e:
            print(f"   ⚠️ D-ID credential {attempt + 1} polling error: {str(e)}")
            continue
    
    raise RuntimeError("All D-ID credentials failed for video polling")

# -------------------------------------------------------------------
# 🔄 MongoDB Functions
# -------------------------------------------------------------------
def fetch_latest_news(mongo_url: str, db_name: str, collection_name: str, limit: int = 10) -> List[Dict]:
    """Fetch latest news from MongoDB."""
    client = pymongo.MongoClient(mongo_url)
    db = client[db_name]
    collection = db[collection_name]
    
    # Fetch latest news sorted by created_at descending
    news_items = list(collection.find().sort("created_at", -1).limit(limit))
    client.close()
    return news_items

# -------------------------------------------------------------------
# 📁 File Management Functions
# -------------------------------------------------------------------
def get_next_file_number(folder_path: str) -> int:
    """Get the next available file number based on existing files."""
    if not os.path.exists(folder_path):
        return 0
    
    existing_files = os.listdir(folder_path)
    numbers = []
    
    for filename in existing_files:
        # Match news_video_X.txt pattern
        match = re.search(r'news_video_(\d+)\.txt', filename)
        if match:
            numbers.append(int(match.group(1)))
    
    if not numbers:
        return 0
    
    return max(numbers) + 1

# -------------------------------------------------------------------
# 📺 Main News Video Generation Pipeline
# -------------------------------------------------------------------
def generate_news_bulletin(mongo_url: str, db_name: str, collection_name: str):
    """Create videos for latest news stories."""
    # Create news folder if it doesn't exist
    news_folder = "news"
    if not os.path.exists(news_folder):
        os.makedirs(news_folder)
        print(f"✨ Created '{news_folder}' folder")
    
    # Get starting file number
    start_number = get_next_file_number(news_folder)
    print(f"📝 Starting file numbering from: {start_number}")
    
    # Fetch latest news
    print("📰 Fetching latest news from MongoDB...")
    news_items = fetch_latest_news(mongo_url, db_name, collection_name,limit=1)
    
    if not news_items:
        print("❌ No news items found in database!")
        return
    
    # Avatar configuration
    AVATAR_INFO = {"source_url": "https://i.ibb.co/Xf0jZSKq/anchor-min.jpg"}
    
    # Opening greeting
    greeting = "Good evening, and welcome to today's news bulletin."
    
    for idx, news in enumerate(news_items):
        file_number = start_number + idx  # Use continuous numbering
        # Extract news data
        headline = news.get("original_title", "Breaking news")
        script = news.get("script", "No details available.")
        source = news.get("source", "Unknown source")
        
        # Create script with transitions
        if idx == 0:
            # First news item includes greeting
            full_script = f"{greeting} {script}"
        else:
            # Subsequent items with transition
            transition = random.choice(TRANSITIONS)
            full_script = f"{transition} {script}"
        
        print(f"\n📝 Processing news {idx + 1}/{len(news_items)}: {headline[:50]}...")
        print(f"   File number: {file_number}")
        
        try:
            # Generate speech with failover
            print("   🗣️ Generating speech with failover...")
            mp3 = tts_generate_with_failover(full_script, ELEVEN_VOICE_ID, ELEVEN_API_KEY)
            print(f"   ✔️ TTS complete – {len(mp3):,} bytes")
            
            # Upload to D-ID with failover
            print("   ⬆️ Uploading audio with failover...")
            audio_url = did_upload_audio_with_failover(mp3, f"news_{file_number}.mp3", DID_API_KEY)
            print(f"   ✔️ Audio URL: {audio_url}")
            
            # Create video with failover
            print("   🎬 Creating video with failover...")
            video_id = did_create_video_with_failover(audio_url, AVATAR_INFO, DID_API_KEY)
            print(f"   ✔️ Video ID: {video_id}")
            
            # Poll for completion with failover
            print("   ⏳ Waiting for video to render with failover...")
            result_url = did_poll_video_with_failover(video_id, DID_API_KEY)
            print(f"   ✅ Video ready: {result_url}\n")
            
            # Save video metadata to file in news folder
            file_path = os.path.join(news_folder, f"news_video_{file_number}.txt")
            with open(file_path, "w") as f:
                f.write(f"Title: {headline}\n")
                f.write(f"Source: {source}\n")
                f.write(f"Video URL: {result_url}\n")
                f.write(f"Script: {full_script}\n")
            
        except Exception as e:
            print(f"   ❌ Error processing news {idx + 1}: {str(e)}")
            # Log the error to a separate file
            error_file = os.path.join(news_folder, f"error_news_{file_number}.txt")
            with open(error_file, "w") as f:
                f.write(f"Title: {headline}\n")
                f.write(f"Source: {source}\n")
                f.write(f"Error: {str(e)}\n")
                f.write(f"Script: {full_script}\n")
            continue
    
    # Create a summary file
    summary_path = os.path.join(news_folder, "news_summary.txt")
    with open(summary_path, "w") as f:
        f.write("NEWS BULLETIN SUMMARY\n")
        f.write("====================\n\n")
        f.write(f"Generated on: {time.strftime('%Y-%m-%d %H:%M:%S')}\n")
        f.write(f"Total stories processed: {len(news_items)}\n\n")
        
        for idx, news in enumerate(news_items):
            file_number = start_number + idx
            headline = news.get("original_title", "Breaking news")
            source = news.get("source", "Unknown source")
            f.write(f"Story {idx + 1} (File #{file_number}): {headline}\n")
            f.write(f"Source: {source}\n")
            f.write(f"Details file: news_video_{file_number}.txt\n")
            f.write("-" * 50 + "\n")
    
    print(f"\n🎉 All news videos generated successfully!")
    print(f"📁 All files saved in '{news_folder}' folder")

if __name__ == "__main__":
    generate_news_bulletin(MONGO_URL, DB_NAME, COLLECTION_NAME)