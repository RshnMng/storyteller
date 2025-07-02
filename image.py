import os
from openai import OpenAI

def main():
    # Make sure your environment variable OPENAI_API_KEY is set
    client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
    
    response = client.images.generate(
        prompt="kids having a snowball fight in central park, make it look bright vivrant. This is an illustration for a childrens book so make it happy and glossy and give that great childrens story feel.",
        n=1,
        size="1024x1024"
    )
    
    image_url = response.data[0].url
    print("Generated image URL:", image_url)

if __name__ == "__main__":
    main()
