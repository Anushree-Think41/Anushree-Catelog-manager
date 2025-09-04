import os
from dotenv import load_dotenv
import google.generativeai as genai
import asyncio

# Load environment variables from .env file
load_dotenv()

async def test_gemini_api_key():
    api_key = os.getenv("GEMINI_API_KEY")

    if not api_key:
        print("Error: GEMINI_API_KEY not found in environment variables.")
        return

    genai.configure(api_key=api_key)

    try:
        print("Attempting to make a simple Gemini API call...")
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = await model.generate_content_async("Hello, Gemini!")
        
        if response.text:
            print("Gemini API call successful!")
            print(f"Response: {response.text}")
        else:
            print("Gemini API call successful, but no text response received.")
            print(f"Full response object: {response}")

    except Exception as e:
        print(f"Gemini API call failed: {e}")
        if "429 RESOURCE_EXHAUSTED" in str(e):
            print("This indicates a quota issue. Your API key is likely valid, but you've hit your usage limits.")
        elif "403 Permission denied" in str(e):
            print("This indicates a permission issue. Double-check your API key and project settings.")
        elif "400 Invalid API key" in str(e):
            print("This indicates an invalid API key. Please verify your GEMINI_API_KEY in the .env file.")

if __name__ == "__main__":
    asyncio.run(test_gemini_api_key())
