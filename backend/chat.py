import random, ast
from dotenv import load_dotenv
import os
import markdown

from langchain_openai import ChatOpenAI
from langchain_google_genai import ChatGoogleGenerativeAI
from langchain_groq import ChatGroq
from langchain_core.runnables import ConfigurableField
from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import JsonOutputParser, PydanticOutputParser
from langchain_community.tools import YouTubeSearchTool

from langchain_core.tools import Tool
from pydantic import BaseModel, Field
from rich import print as pprint

# Load environment variables from .env file
load_dotenv()

# Get API keys from environment variables
openai_api_key = os.getenv('OPENAI_API_KEY')
google_api_key = os.getenv('GOOGLE_API_KEY')
groq_api_key = os.getenv('GROQ_API_KEY')

# set up the llm models
chat_model = ChatOpenAI(model_name="gpt-4o-mini", 
                        temperature=0.3,
                        api_key=openai_api_key)

llm = chat_model.configurable_alternatives(
    ConfigurableField(
        id="llm",
        name="LLM",
        description="multiple models",
    ),
    default_key="openai",
    gemini=ChatGoogleGenerativeAI(model="gemini-pro", temperature=0.3, api_key=google_api_key),
    llama=ChatGroq(model="llama-3.3-70b-versatile", temperature=0.3, groq_api_key=groq_api_key)
)

# output format
class CouchInstruction(BaseModel):
    problem: str = Field(description="A detailed explanation of the issue you're facing with your shooting technique, such as incorrect arm movement, poor alignment, or insufficient power in your shot.")
    instruction: str = Field(description="Step-by-step guidance to correct the identified problem, including specific movements, focus areas, or techniques to implement for improvement.")
    practice: str = Field(description="A detailed training drill designed to address the problem. Each point should be on a new line(with \\n) and provide clear instructions on execution, key points to focus on, and how to assess progress.")


parser = PydanticOutputParser(pydantic_object=CouchInstruction)
format_instructions = parser.get_format_instructions()

prompt = ChatPromptTemplate.from_messages(
    [
        ("ai", "You are an experienced basketball coach skilled in providing effective instructions and drills to help players improve their skills. {scenario} Please use {language} to give suggestion base on the information." "{format_instructions}"),
        ("human", "{query}")
    ]
)
new_prompt = prompt.partial(format_instructions=format_instructions)

advise_chain = new_prompt | llm | JsonOutputParser()

def markdown_to_html(text):
    return markdown.markdown(text.replace(" ", "\n"))

def getAdvice(scenario, user_query, language = "Traditional Chinese繁體中文", llm="gemini"):
    # print(advise_chain.with_config(configurable={"llm": "llama"}).invoke({"query": user_query, "language": language}))
    while True:
        try:
            result = advise_chain.with_config(configurable={"llm": llm}).invoke({"scenario": scenario, "query": user_query, "language":language})
            return {
                "problem": markdown_to_html(result["problem"]),
                "instruction": markdown_to_html(result["instruction"]),
                "practice": markdown_to_html(result["practice"])
            }
        except Exception as e:
            print(f"Error occurred: {e}. Retrying...")
            continue


def getTutorialLink(max_results = 10):
    tool = YouTubeSearchTool()
    results = tool.run(f"basketball shot tutorial,{max_results}")
    urls = ast.literal_eval(results)
    # pick a random video from the url
    return random.choice(urls)
    

# link = getTutorialLink()
# print(link)