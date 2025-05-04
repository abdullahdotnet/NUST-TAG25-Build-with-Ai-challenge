import os
import time
import logging
from datetime import datetime
import sys
import pandas as pd
import google.generativeai as genai
from pymongo import MongoClient
from dotenv import load_dotenv
from selenium import webdriver
from selenium.webdriver.common.by import By
import hashlib

# Load environment variables
load_dotenv()

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler("cnbc_stock_news.log"),
        logging.StreamHandler(sys.stdout)
    ]
)
logger = logging.getLogger(__name__)

# Configuration from environment variables
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/")
GEMINI_API_KEY = os.getenv("GEMINI_API_KEY",'AIzaSyDAD-pjOjF2O_YTJeGA53R8IiQLW1IixKY')

def web_driver():
    """Initialize and configure Chrome webdriver"""
    options = webdriver.ChromeOptions()
    options.add_argument("--verbose")
    options.add_argument('--no-sandbox')
    options.add_argument('--headless')
    options.add_argument('--disable-gpu')
    options.add_argument("--window-size=1920, 1200")
    options.add_argument('--disable-dev-shm-usage')
    driver = webdriver.Chrome(options=options)
    return driver

# Initialize MongoDB connection
def connect_to_mongodb():
    """Connect to MongoDB and set up collections"""
    try:
        client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
        # Test connection
        client.server_info()
        db = client["cnbc_news_database"]
        # Use separate collections for raw and conversational news
        raw_collection = db["raw_stock_news"]
        conversational_collection = db["conversational_stock_news"]
        logger.info("Successfully connected to MongoDB")
        return client, db, raw_collection, conversational_collection
    except Exception as e:
        logger.error(f"Failed to connect to MongoDB: {str(e)}")
        sys.exit(1)

# Initialize Gemini API
def setup_gemini_api():
    """Configure Gemini API with the provided key"""
    if not GEMINI_API_KEY:
        logger.error("GEMINI_API_KEY environment variable not set")
        sys.exit(1)
    
    try:
        genai.configure(api_key=GEMINI_API_KEY)
        logger.info("Gemini API configured successfully")
        return True
    except Exception as e:
        logger.error(f"Failed to configure Gemini API: {str(e)}")
        return False

def find_working_gemini_model():
    """Find a working Gemini model"""
    models_to_try = ["gemini-1.5-flash", "gemini-1.5-pro", "gemini-1.0-pro"]
    
    for model_name in models_to_try:
        try:
            logger.info(f"Testing Gemini model: {model_name}")
            model = genai.GenerativeModel(
                model_name=model_name,
                generation_config={"temperature": 0.7, "max_output_tokens": 100}
            )
            
            response = model.generate_content("Hello, please respond with a single word: Working")
            
            if response and hasattr(response, 'text') and response.text:
                logger.info(f"Gemini model {model_name} working. Response: {response.text[:20]}...")
                return model_name
        
        except Exception as e:
            logger.warning(f"Error testing Gemini model {model_name}: {str(e)}")
    
    logger.error("Failed to find a working Gemini model")
    return None

def scrape_cnbc_stock_news():
    """Scrape CNBC Pro news articles - headline only version"""
    try:
        logger.info("Initializing web driver...")
        driver = web_driver()
        
        # Navigate to CNBC Pro news page
        logger.info("Navigating to CNBC Pro news page...")
        driver.get('https://www.cnbc.com/pro/news/')
        time.sleep(5)  # Allow time for the page to load
        
        # Extract news elements
        logger.info("Extracting news elements...")
        newsdf = pd.DataFrame()
        newses = driver.find_elements(By.CLASS_NAME, 'Card-textContent')
        
        headlines_list = []
        author_list = []
        date_list = []
        
        for news in newses:
            info = (news.text).split('\n')
            if len(info) == 3:
                headline = info[0]
                headlines_list.append(headline)
                author = info[1]
                author_list.append(author)
                if 'AGO' in info[2]:
                    date = datetime.now().strftime('%d-%m-%Y')
                    date_list.append(date)
                else:
                    date_list.append(str(info[2]))
            elif len(info) == 2:
                headline = info[0]
                headlines_list.append(headline)
                author_list.append(None)
                if 'AGO' in info[-1]:
                    date = datetime.now().strftime('%d-%m-%Y')
                    date_list.append(date)
                else:
                    date_list.append(str(info[-1]))
        
        newsdf['Headline'] = headlines_list
        newsdf['Author'] = author_list
        newsdf['Date'] = date_list
        
        # Close the driver
        driver.quit()
        
        # Add additional information to the dataframe
        newsdf['Category'] = 'Stock'
        newsdf['Source'] = 'CNBC Pro'
        newsdf['Scraped_At'] = datetime.now()
        
        # Generate unique IDs
        newsdf['article_id'] = newsdf.apply(
            lambda row: hashlib.md5(f"{row['Headline']}_{row['Date']}".encode()).hexdigest(),
            axis=1
        )
        
        logger.info(f"Successfully scraped {len(newsdf)} CNBC Pro stock news articles")
        return newsdf
    
    except Exception as e:
        logger.error(f"Error scraping CNBC Pro news: {str(e)}")
        if 'driver' in locals():
            driver.quit()
        return pd.DataFrame()

def convert_headline_to_conversational(article_info, model_name):
    """Convert headline and available metadata to conversational script"""
    if not model_name:
        return "Error: No working Gemini model available"
    
    try:
        # Extract the available information
        headline = article_info.get('Headline', '')
        author = article_info.get('Author', '')
        source = article_info.get('Source', 'CNBC Pro')
        category = article_info.get('Category', 'Stock')
        
        # Check if we have enough to work with
        if not headline:
            return "Error: Missing headline"
        
        # Prepare the prompt for the AI model
        prompt = f"""
        Create a brief conversational news script for a business news anchor based on this financial headline:
        
        Headline: {headline}
        
        Source: {source}
        
        Category: {category}
        
        Additional context:
        - This is a stock market/financial news item 
        - Author: {author if author else 'Not specified'}
        
        Important formatting instructions:
        1. NEVER use greetings like "good morning" or "hello" at the beginning
        2. Start directly with the financial news content using a professional, consistent tone
        3. Use broadcast-style language appropriate for business news
        4. Expand on the headline with likely context and implications, focusing on what viewers would need to know
        5. Keep it concise (about 100-150 words)
        6. End with a simple attribution to CNBC Pro
        7. Since you only have the headline, keep statements factual and avoid making specific claims not supported by the headline
        8. Focus on the general topic and context rather than details that aren't available
        """
        
        # Configure the model
        generation_config = {
            "temperature": 0.5,
            "max_output_tokens": 600,
        }
        
        # Initialize the model
        model = genai.GenerativeModel(
            model_name=model_name,
            generation_config=generation_config
        )
        
        # Generate the script with retry logic
        max_retries = 2
        retry_count = 0
        
        while retry_count <= max_retries:
            try:
                response = model.generate_content(prompt)
                break
            except Exception as e:
                retry_count += 1
                logger.warning(f"Error generating script (attempt {retry_count}/{max_retries}): {str(e)}")
                if retry_count <= max_retries:
                    time.sleep(2)
                else:
                    return f"Error generating conversational script: {str(e)}"
        
        # Process the response
        if response and hasattr(response, 'text'):
            conversational_script = response.text.strip()
            
            # Check if we got a meaningful response
            if len(conversational_script) < 50:
                return "Error: Generated script too short or empty"
            
            # Remove any greeting that might have slipped through
            greetings = ["good morning", "good evening", "good afternoon", "hello there", "welcome", "hello everyone", "hi there"]
            script_lower = conversational_script.lower()
            
            for greeting in greetings:
                if script_lower.startswith(greeting):
                    parts = conversational_script.split(" ", len(greeting.split()))
                    if len(parts) > len(greeting.split()):
                        conversational_script = " ".join(parts[len(greeting.split()):])
                        conversational_script = conversational_script[0].upper() + conversational_script[1:]
            
            return conversational_script
        else:
            return "Error: Invalid response from Gemini API"
    
    except Exception as e:
        logger.error(f"Error in convert_headline_to_conversational: {str(e)}")
        return f"Error: {str(e)}"

def store_articles(newsdf, raw_collection, conversational_collection, gemini_model):
    """Store headlines in raw collection and generate conversational versions"""
    success_count = 0
    error_count = 0
    
    for index, row in newsdf.iterrows():
        try:
            # Create article document
            article_id = row['article_id']
            
            # Check if the article already exists
            if raw_collection.find_one({"article_id": article_id}):
                logger.info(f"Article already exists: {row['Headline']}")
                continue
            
            # Create the raw article document
            raw_article = {
                "article_id": article_id,
                "headline": row['Headline'],
                "author": row['Author'],
                "date": row['Date'],
                "category": row['Category'],
                "source": row['Source'],
                "scraped_at": row['Scraped_At']
            }
            
            # Store raw article
            raw_collection.insert_one(raw_article)
            logger.info(f"Stored raw article: {row['Headline']}")
            
            # Generate conversational script from headline
            if gemini_model:
                conversational_script = convert_headline_to_conversational(row, gemini_model)
                
                # Check if conversion was successful
                if not conversational_script.startswith("Error") and not conversational_script.startswith("Insufficient"):
                    # Store conversational version
                    conversational_doc = {
                        "article_id": article_id,
                        "original_headline": row['Headline'],
                        "script": conversational_script,
                        "source": row['Source'],
                        "category": row['Category'],
                        "created_at": datetime.now()
                    }
                    
                    conversational_collection.insert_one(conversational_doc)
                    logger.info(f"Stored conversational script for: {row['Headline']}")
                    success_count += 1
                else:
                    logger.warning(f"Conversion failed for {row['Headline']}: {conversational_script}")
                    error_count += 1
            else:
                logger.warning(f"Skipping conversational generation for {row['Headline']} due to missing model")
        
        except Exception as e:
            logger.error(f"Error processing article {row['Headline']}: {str(e)}")
            error_count += 1
    
    return success_count, error_count

def main():
    """Main function to run the CNBC stock news scraping pipeline (headline only version)"""
    logger.info("===== Starting CNBC Stock News Scraping Pipeline (Headline Only) =====")
    
    # Connect to MongoDB
    client, db, raw_collection, conversational_collection = connect_to_mongodb()
    
    # Setup Gemini API
    if not setup_gemini_api():
        logger.error("Failed to set up Gemini API. Exiting.")
        sys.exit(1)
    
    # Find a working Gemini model
    gemini_model = find_working_gemini_model()
    if not gemini_model:
        logger.warning("No working Gemini model found. Will store raw headlines only.")
    
    # Scrape CNBC stock news headlines
    newsdf = scrape_cnbc_stock_news()
    
    if newsdf.empty:
        logger.error("No articles scraped. Exiting.")
        sys.exit(1)
    
    logger.info(f"Successfully scraped {len(newsdf)} headlines")
    
    # Process and store articles
    success_count, error_count = store_articles(
        newsdf, 
        raw_collection, 
        conversational_collection,
        gemini_model
    )
    
    # Log final statistics
    logger.info("===== CNBC Stock News Scraping Pipeline Completed =====")
    logger.info(f"Total headlines scraped: {len(newsdf)}")
    logger.info(f"Successfully processed conversational scripts: {success_count}")
    logger.info(f"Articles with errors: {error_count}")

if __name__ == "__main__":
    main()