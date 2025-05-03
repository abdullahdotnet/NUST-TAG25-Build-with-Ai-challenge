import requests
import os
import time
from datetime import datetime
import logging
from pymongo import MongoClient
from dotenv import load_dotenv
import google.generativeai as genai
import sys

# Load environment variables
load_dotenv()

# Configure logging with more detail
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("news_pipeline.log"), 
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# API Configuration - prefer environment variables but fall back to hardcoded values
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
NEWS_API_KEY = os.getenv("NEWS_API_KEY", 'd59d6c32e56e49bab7f3547283d83ebe')
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", 'AIzaSyDAD-pjOjF2O_YTJeGA53R8IiQLW1IixKY')

# Initialize MongoDB with error handling
try:
    client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
    # Check connection
    client.server_info()
    db = client["news_database"]
    raw_collection = db["raw_news"]
    conversational_collection = db["conversational_news"]
    logger.info("Successfully connected to MongoDB")
except Exception as e:
    logger.error(f"Failed to connect to MongoDB: {str(e)}")
    sys.exit(1)

# Initialize Gemini API with error handling
try:
    genai.configure(api_key=GEMINI_API_KEY)
    logger.info("Gemini API configured successfully")
except Exception as e:
    logger.error(f"Failed to configure Gemini API: {str(e)}")
    sys.exit(1)

def fetch_news_from_api(category="general", language="en", page_size=5):
    """Fetch news from NewsAPI"""
    try:
        url = "https://newsapi.org/v2/top-headlines"
        params = {
            "category": category,
            "language": language,
            "pageSize": page_size,
            "apiKey": NEWS_API_KEY
        }
        
        logger.info(f"Fetching news from URL: {url} with category: {category}")
        response = requests.get(url, params=params)
        response.raise_for_status()
        
        result = response.json()
        if result.get("status") != "ok":
            logger.error(f"API returned non-OK status: {result.get('status')}, message: {result.get('message', 'No message')}")
            return None
            
        return result
    
    except requests.exceptions.RequestException as e:
        logger.error(f"Error fetching news from API: {str(e)}")
        return None

def test_gemini_api():
    """Test if Gemini API is working correctly"""
    try:
        # Try simple models first
        models = ["gemini-1.0-pro", "gemini-1.5-flash"]
        
        for model_name in models:
            try:
                logger.info(f"Testing Gemini API with model: {model_name}")
                
                model = genai.GenerativeModel(
                    model_name=model_name,
                    generation_config={"temperature": 0.7, "max_output_tokens": 100}
                )
                
                response = model.generate_content("Hello, please respond with a single word: Working")
                
                if response and response.text:
                    logger.info(f"Gemini API test successful with model {model_name}. Response: {response.text[:20]}...")
                    return model_name
                else:
                    logger.warning(f"Gemini API test failed with model {model_name} - empty response")
            
            except Exception as e:
                logger.warning(f"Gemini API test failed with model {model_name}: {str(e)}")
        
        logger.error("All Gemini API model tests failed")
        return None
        
    except Exception as e:
        logger.error(f"Error testing Gemini API: {str(e)}")
        return None

def convert_to_conversational(article, working_model=None):
    """Convert article to conversational script using Gemini API"""
    if not working_model:
        working_model = "gemini-1.0-pro"  # Default fallback
        
    try:
        # Extract the main content (with error checking)
        title = article.get("title", "Untitled Article")
        description = article.get("description", "No description available")
        content = article.get("content", "No content available")
        source = article.get("source", {}).get("name", "Unknown Source")
        
        # Check if we have enough content to work with
        if content == "No content available" and description == "No description available":
            return "Insufficient article content for conversion to script format."
        
        # Prepare the prompt with specific instructions about consistent tone
        prompt = f"""
        Convert the following news article into a conversational news script suitable for a professional news anchor:
        
        Title: {title}
        
        Description: {description}
        
        Content: {content}
        
        Source: {source}
        
        Important formatting instructions:
        1. NEVER use greetings like "good morning," "good evening," or "hello" at the beginning
        2. Start directly with the news content using a professional, consistent tone
        3. Use broadcast-style language and pacing
        4. Keep the tone formal but engaging
        5. Use appropriate transitions between points
        6. End with a simple attribution to the source, not with "thank you" or similar closings
        7. Keep it concise and to the point
        8. Maintain a consistent tone throughout
        """
        
        # Configure the model
        generation_config = {
            "temperature": 0.5,  # Lower temperature for more consistent output
            "max_output_tokens": 800,
        }
        
        # Initialize the Gemini model
        model = genai.GenerativeModel(
            model_name=working_model,
            generation_config=generation_config
        )
        
        # Generate the conversational script
        response = model.generate_content(prompt)
        
        # Extract the generated script
        if response and hasattr(response, 'text'):
            conversational_script = response.text.strip()
            
            # Validate we got a reasonable response
            if len(conversational_script) < 10:
                return "Error: Generated script too short or empty"
                
            # Post-process to remove any greetings that might have slipped through
            greetings = ["good morning", "good evening", "good afternoon", "hello there", "welcome", "hello everyone", "hi there"]
            script_lower = conversational_script.lower()
            
            # Check if script starts with any greeting
            for greeting in greetings:
                if script_lower.startswith(greeting):
                    # Remove the greeting and capitalize the next word
                    parts = conversational_script.split(" ", len(greeting.split()))
                    if len(parts) > len(greeting.split()):
                        conversational_script = " ".join(parts[len(greeting.split()):])
                        # Capitalize first letter
                        conversational_script = conversational_script[0].upper() + conversational_script[1:]
            
            return conversational_script
        else:
            return "Error: Gemini API returned invalid response"
    
    except Exception as e:
        logger.error(f"Error converting article to conversational format: {str(e)}")
        return f"Error generating conversational script: {str(e)}"

def store_articles(articles, working_model=None):
    """Store articles in MongoDB"""
    success_count = 0
    error_count = 0
    
    for article in articles:
        try:
            # Check if article already exists
            if not article.get("url"):
                logger.warning(f"Article missing URL, skipping: {article.get('title', 'Unknown title')}")
                error_count += 1
                continue
                
            if raw_collection.find_one({"url": article.get("url")}):
                logger.info(f"Article already exists: {article.get('title')}")
                continue
                
            # Add timestamp
            article["fetched_at"] = datetime.now()
            
            # Store raw article
            raw_collection.insert_one(article)
            logger.info(f"Stored raw article: {article.get('title')}")
            
            # Generate conversational script
            conversational_script = convert_to_conversational(article, working_model)
            
            # Check if conversion was successful
            if conversational_script.startswith("Error"):
                logger.error(f"Failed to generate script: {conversational_script}")
                error_count += 1
                continue
            
            # Store conversational script
            conversational_doc = {
                "original_url": article.get("url"),
                "original_title": article.get("title"),
                "script": conversational_script,
                "source": article.get("source", {}).get("name", "Unknown"),
                "category": article.get("category", "general"),
                "language": article.get("language", "en"),
                "created_at": datetime.now()
            }
            
            conversational_collection.insert_one(conversational_doc)
            logger.info(f"Stored conversational script for: {article.get('title')}")
            success_count += 1
            
        except Exception as e:
            logger.error(f"Error storing article {article.get('title', 'Unknown')}: {str(e)}")
            error_count += 1
    
    return success_count, error_count

def main():
    """Main function to run the news pipeline"""
    logger.info("------ Starting news pipeline ------")
    
    # Test Gemini API first
    working_model = test_gemini_api()
    if not working_model:
        logger.error("Gemini API test failed. Cannot proceed with script generation.")
        # Continue with scraping but skip conversational generation
    else:
        logger.info(f"Will use Gemini model: {working_model}")
    
    # Define categories to fetch
    categories = ["business", "technology", "sports"]
    total_success = 0
    total_errors = 0
    
    for category in categories:
        # Fetch news for each category
        logger.info(f"Fetching news for category: {category}")
        news_data = fetch_news_from_api(category=category)
        
        if news_data and news_data.get("status") == "ok":
            articles = news_data.get("articles", [])
            # Add category to each article
            for article in articles:
                article["category"] = category
                
            logger.info(f"Fetched {len(articles)} articles from NewsAPI for category {category}")
            
            # Store articles
            success, errors = store_articles(articles, working_model)
            total_success += success
            total_errors += errors
        else:
            logger.error(f"Failed to fetch news for category {category} or no articles returned")
        
        # Add a delay between API calls
        logger.info(f"Waiting 3 seconds before next API call...")
        time.sleep(3)
    
    logger.info(f"------ News pipeline completed ------")
    logger.info(f"Total articles processed successfully: {total_success}")
    logger.info(f"Total articles with errors: {total_errors}")

if __name__ == "__main__":
    main()