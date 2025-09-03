import os
from dotenv import load_dotenv
import google.generativeai as genai

load_dotenv(dotenv_path='/home/think-41-gf-5g/catalog/.env')

API_KEY = os.getenv("GOOGLE_API_KEY")

print(f"Loaded API Key: {API_KEY}")

if not API_KEY:
    print("GOOGLE_API_KEY environment variable not set.")
else:
    genai.configure(api_key=API_KEY)
    try:
        model = genai.GenerativeModel('gemini-1.5-flash-latest')
        response = model.generate_content("Hello, Gemini!")
        print("Gemini API call successful!")
        print(f"Response: {response.text}")
    except Exception as e:
        print(f"Error making Gemini API call: {e}")
