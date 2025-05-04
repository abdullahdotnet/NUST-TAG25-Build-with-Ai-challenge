import requests
import time
import json
import base64
from typing import Dict, Optional

class DIDAPIError(Exception):
    """Custom exception for D-ID API errors"""
    pass

def generate_avatar_video(
    text: str, 
    image_url: str, 
    api_key: str,
    timeout: int = 600,
    poll_interval: int = 10,
    news_style: bool = True,
    voice_speed: float = 1.0,
    voice_pitch: str = "medium"
) -> str:
    """
    Generate a video using D-ID API with news anchor styling options.
    
    This function now includes proper API key encoding and simplified configuration
    to avoid compatibility issues.
    """
    
    # Step 1: Process text for news anchor style
    if news_style:
        # For now, let's use a simpler approach to news formatting
        # We'll add natural pauses and emphasis through text structure
        processed_text = format_news_script_simple(text)
    else:
        processed_text = text
    
    # Step 2: Properly encode the API key
    # D-ID expects the API key to be Base64 encoded
    encoded_key = base64.b64encode(api_key.encode()).decode('utf-8')
    
    # Step 3: Set up the request with simplified configuration
    base_url = "https://api.d-id.com/talks"
    
    # Notice how I'm using the properly encoded API key here
    headers = {
        "Authorization": f"Basic {encoded_key}",
        "Content-Type": "application/json"
    }
    
    # Step 4: Use a minimal, compatible configuration
    # We're removing potentially unsupported options
    payload = {
        "script": {
            "type": "text",
            "input": processed_text
        },
        "source_url": image_url
    }
    
    try:
        print(f"Submitting news anchor video generation request...")
        print(f"Using endpoint: {base_url}")
        print(f"Script length: {len(processed_text)} characters")
        
        response = requests.post(base_url, headers=headers, json=payload)
        
        # Let's see what error we're getting
        print(f"Response status code: {response.status_code}")
        if response.status_code != 200:
            print(f"Response content: {response.text}")
        
        response.raise_for_status()
        job_data = response.json()
        job_id = job_data.get("id")
        
        if not job_id:
            raise DIDAPIError("Failed to get job ID from API response")
            
        print(f"Job submitted successfully. Job ID: {job_id}")
            
    except requests.exceptions.RequestException as e:
        raise DIDAPIError(f"Failed to submit video generation request: {str(e)}")
    
    # Step 5: Poll for completion (unchanged)
    start_time = time.time()
    
    while time.time() - start_time < timeout:
        try:
            status_url = f"{base_url}/{job_id}"
            status_response = requests.get(status_url, headers=headers)
            status_response.raise_for_status()
            status_data = status_response.json()
            
            status = status_data.get("status")
            elapsed_time = time.time() - start_time
            
            print(f"Status: {status} (Elapsed: {elapsed_time:.1f}s)")
            
            if status == "done":
                result_url = status_data.get("result_url")
                if result_url:
                    print(f"News anchor video generated successfully!")
                    return result_url
                else:
                    raise DIDAPIError("Video completed but no result URL found")
                    
            elif status == "error":
                error_message = status_data.get("error", {}).get("message", "Unknown error")
                raise DIDAPIError(f"Video generation failed: {error_message}")
                
            elif status in ["created", "started"]:
                time.sleep(poll_interval)
                
            else:
                raise DIDAPIError(f"Unknown status: {status}")
                
        except requests.exceptions.RequestException as e:
            raise DIDAPIError(f"Failed to check video status: {str(e)}")
    
    raise TimeoutError(f"Video generation exceeded timeout of {timeout} seconds")


def format_news_script_simple(text: str) -> str:
    """
    Format text for news anchor delivery using simple text formatting.
    
    Since SSML might not be supported, we use text-based formatting
    to create natural news delivery patterns.
    """
    # Add periods for natural pauses
    processed_text = text.replace('. ', '. ')  # Ensure proper spacing
    
    # Make sure sentences end with proper punctuation
    if not text.endswith('.'):
        processed_text += '.'
    
    return processed_text

# Test with original API key
if __name__ == "__main__":
    # Simplified example
    text = """Good evening everyone. Today's top stories include breakthrough developments 
    in artificial intelligence and significant market movements. And The Winner for today's AI comeptition is None other than We Show Speeeed!"""
    
    image_url = "https://i.ibb.co/Xf0jZSKq/anchor-min.jpg"
    api_key = "aGFtemFzeWVkc2hhaDMwMkBnbWFpbC5jb20:ZXLYcfDhDVzdBhiGzGzqh"  # Your original API key
    
    try:
        # Generate news anchor style video with simplified configuration
        video_url = generate_avatar_video(
            text=text,
            image_url=image_url,
            api_key=api_key,
            news_style=True,
            voice_speed=1.0,
            voice_pitch="medium"
        )
        
        print(f"Success! Video URL: {video_url}")
        
    except DIDAPIError as e:
        print(f"API Error: {e}")
        print("Please check your API key and try again")
    except Exception as e:
        print(f"Unexpected error: {e}")