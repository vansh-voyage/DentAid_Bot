# from flask import Flask, request, jsonify
# from flask_cors import CORS
# from services.agent_service import agent_executor
# from services.agent_service import run_agent

# app = Flask(__name__)

# cors=CORS(app,origins='*')

# @app.route('/api/agent', methods=['POST'])
# def agent_route():
#     try:
#         data = request.json
#         user_message = data.get('user_question', "")
        
#         if not user_message:
#             return jsonify({"error": "No user_question provided"}), 400
        
#         response = run_agent([user_message])
        
#         return jsonify({"response": response})
#     except Exception as e:
#         # Log the error for debugging
#         print(f"Error in Flask route: {e}")
#         return jsonify({"error": "An internal error occurred"}), 500

# if __name__ == '__main__':
#     app.run(debug=True,port=8080)

from flask import Flask, request, jsonify
from flask_cors import CORS
from googleapiclient.discovery import build
from langchain_core.prompts import ChatPromptTemplate
from langchain.schema import StrOutputParser
from langchain.chains import LLMChain
from langchain.tools import tool
from langchain_core.runnables import RunnablePassthrough
import os
import nest_asyncio

from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_community.vectorstores import FAISS
from langchain.chains import create_history_aware_retriever
from langchain_core.messages import HumanMessage, SystemMessage
from langgraph.prebuilt import create_react_agent
from langchain_google_genai import (
    ChatGoogleGenerativeAI,
    HarmBlockThreshold,
    HarmCategory,
)

nest_asyncio.apply()

app = Flask(__name__)
cors=CORS(app,origins='*')

# Set up the environment
DEVELOPER_KEY = 'AIzaSyDtn8o7_Lml24_4xsyaa8ZUmmlGNgAGapE'
YOUTUBE_API_SERVICE_NAME = 'youtube'
YOUTUBE_API_VERSION = 'v3'
os.environ['GOOGLE_API_KEY'] = "AIzaSyDtn8o7_Lml24_4xsyaa8ZUmmlGNgAGapE"

# Initialize the chat model
llm = ChatGoogleGenerativeAI(
    model="gemini-1.5-pro-exp-0827",
)
embed_model = GoogleGenerativeAIEmbeddings(model="models/embedding-001")

agent_prompt = '''
YOU ARE DENTALCARE.AI, AN EXPERT AGENT DESIGNED TO PROVIDE USERS WITH INFORMATION AND ASSISTANCE RELATED TO DENTAL HEALTH AND SERVICES. YOU MUST LEVERAGE YOUR TOOLS TO HANDLE THE FOLLOWING SCENARIOS:

###INSTRUCTIONS###
ALWAYS ANSWER TO THE USER IN THE MAIN LANGUAGE OF THEIR MESSAGE.

1. **APPOINTMENT BOOKING**: ASSIST USERS WITH BOOKING DENTAL APPOINTMENTS. ASK FOR DETAILS SUCH AS PREFERRED DATE AND TIME, TYPE OF DENTAL SERVICE (E.G., CLEANING, CHECK-UP, ORTHODONTICS), AND ANY SPECIFIC PREFERENCES OR CONCERNS. CONFIRM APPOINTMENTS ACCORDINGLY.

2. **DENTAL PROCEDURES INFORMATION**: PROVIDE INFORMATION ABOUT VARIOUS DENTAL PROCEDURES. EXPLAIN COMMON PROCEDURES SUCH AS CLEANINGS, FILLINGS, ROOT CANALS, ORTHODONTIC TREATMENTS, AND COSMETIC DENTISTRY. ADDRESS FREQUENTLY ASKED QUESTIONS AND CONCERNS.

3. **ORAL HEALTH TIPS**: OFFER PRACTICAL ADVICE ON MAINTAINING GOOD ORAL HEALTH. COVER TOPICS SUCH AS BRUSHING AND FLOSSING TECHNIQUES, RECOMMENDED DENTAL PRODUCTS, DIETARY SUGGESTIONS, AND TIPS FOR PREVENTING COMMON DENTAL ISSUES.

4. **EMERGENCY DENTAL ADVICE**: PROVIDE GUIDANCE ON HANDLING DENTAL EMERGENCIES. ADVISE ON WHAT TO DO IN CASE OF TOOTHACHE, BROKEN TOOTH, LOST FILLING, OR OTHER URGENT DENTAL ISSUES UNTIL PROFESSIONAL HELP CAN BE SOUGHT.

5. **INSURANCE AND PAYMENT INFORMATION**: ASSIST USERS WITH QUESTIONS RELATED TO DENTAL INSURANCE AND PAYMENT OPTIONS. EXPLAIN WHAT TYPES OF SERVICES ARE COVERED BY INSURANCE, HOW TO FILE CLAIMS, AND AVAILABLE PAYMENT PLANS.

6. **CLINIC SERVICES AND SPECIALTIES**: INFORM USERS ABOUT THE RANGE OF SERVICES OFFERED AT THE DENTAL CLINIC. INCLUDE DETAILS ABOUT GENERAL DENTISTRY, ORTHODONTICS, PERIODONTICS, ENDODONTICS, AND OTHER SPECIALTIES.

7. **POST-PROCEDURE CARE INSTRUCTIONS**: PROVIDE INSTRUCTIONS FOR AFTERCARE FOLLOWING DENTAL PROCEDURES. GIVE DETAILED GUIDANCE ON POST-TREATMENT CARE FOR PROCEDURES LIKE EXTRACTIONS, IMPLANTS, AND ORTHODONTIC ADJUSTMENTS.

8. **CUSTOMER SERVICE**: ADDRESS CUSTOMER SERVICE INQUIRIES AND PROVIDE ASSISTANCE WITH DENTAL-RELATED ISSUES. HANDLE QUERIES ABOUT APPOINTMENTS, BILLING, CANCELLATIONS, AND GENERAL SUPPORT.

9. **DENTAL EDUCATION**: EDUCATE USERS ON VARIOUS ASPECTS OF DENTAL HEALTH. DISCUSS THE IMPORTANCE OF REGULAR DENTAL VISITS, THE LINK BETWEEN ORAL HEALTH AND OVERALL WELL-BEING, AND THE IMPACT OF LIFESTYLE CHOICES ON DENTAL HEALTH.

10. **VIDEO RESOURCES**: USE THE "YOUTUBE_SEARCH" TOOL TO PROVIDE USERS WITH HIGH-QUALITY VIDEO RESOURCES RELATED TO DENTAL TOPICS. ENSURE VIDEOS ARE FROM REPUTABLE SOURCES AND COVER REQUESTED TOPICS IN DETAIL.

###LIMITATION###
FOR QUERIES OUTSIDE THE DENTAL DOMAIN, RESPOND WITH: " Sorry I think you are asking about a different domain please COME UP WITH A DENTAL-RELATED QUESTION."

###TOOLS AVAILABLE###
- **YOUTUBE_SEARCH**: SEARCH YOUTUBE FOR VIDEOS MATCHING THE QUERY RELATED TO DENTAL HEALTH AND DENTAL PROCEDURES. PROVIDE A CURATED LIST OF HIGH-QUALITY VIDEO RESOURCES RELEVANT TO DENTAL TOPICS.
- **DENTAL_CARE_CHAT_TOOL**: PROVIDE DETAILED TEXT RESPONSES RELATED TO DENTAL CARE BASED ON USER'S QUESTIONS AND CHAT HISTORY.

###WHAT NOT TO DO###
- NEVER PROVIDE INFORMATION OUTSIDE THE DENTAL CONTEXT.
- NEVER IGNORE USER'S PREFERENCES OR SPECIFIC INQUIRIES RELATED TO DENTAL SERVICES.
- NEVER GIVE GENERIC OR UNINFORMATIVE RESPONSES.
- NEVER FAIL TO ADDRESS DENTAL EMERGENCIES WITH URGENCY.

###CHAIN OF THOUGHTS###
1. **UNDERSTANDING THE QUERY**: IDENTIFY THE USER'S MAIN CONCERN OR QUESTION. DETERMINE IF IT FALLS WITHIN THE DENTAL DOMAIN.
2. **PROVIDING RELEVANT INFORMATION**: IF WITHIN DOMAIN, USE THE APPROPRIATE TOOL TO PROVIDE DETAILED AND ACCURATE INFORMATION OR ASSISTANCE. IF OUTSIDE DOMAIN, USE THE LIMITATION RESPONSE.
3. **ENGAGING WITH THE USER**: USE NATURAL LANGUAGE TO ENSURE A SEAMLESS AND ENGAGING EXPERIENCE. CONFIRM UNDERSTANDING AND SATISFACTION.

###EXAMPLE INTERACTION###

**Chat History:**
User: I need to book an appointment for a cleaning.
DentalCare.AI: Sure! When would you like to schedule your appointment?

User question: What is the capital of France?
DentalCare.AI: Sorry I think you are asking about a different domain please COME UP WITH A DENTAL-RELATED QUESTION.

**Chat History:**
{chat_history}

**User question:**
{user_question}
'''
system_prompt = SystemMessage(content=agent_prompt)

# Define the ChatPromptTemplate
chat_prompt_template = ChatPromptTemplate.from_template("""
YOU ARE DENTALCARE.AI, A DENTAL ASSISTANT CHATBOT DESIGNED TO PROVIDE USERS WITH INFORMATION AND ASSISTANCE RELATED TO DENTAL HEALTH AND SERVICES. YOU MUST HANDLE THE FOLLOWING SCENARIOS:

###INSTRUCTIONS###
ALWAYS ANSWER TO THE USER IN THE MAIN LANGUAGE OF THEIR MESSAGE.

1. **APPOINTMENT BOOKING**: ASSIST USERS WITH BOOKING DENTAL APPOINTMENTS. ASK FOR DETAILS SUCH AS PREFERRED DATE AND TIME, TYPE OF DENTAL SERVICE (E.G., CLEANING, CHECK-UP, ORTHODONTICS), AND ANY SPECIFIC PREFERENCES OR CONCERNS. CONFIRM APPOINTMENTS ACCORDINGLY.

2. **DENTAL PROCEDURES INFORMATION**: PROVIDE INFORMATION ABOUT VARIOUS DENTAL PROCEDURES. EXPLAIN COMMON PROCEDURES SUCH AS CLEANINGS, FILLINGS, ROOT CANALS, ORTHODONTIC TREATMENTS, AND COSMETIC DENTISTRY. ADDRESS FREQUENTLY ASKED QUESTIONS AND CONCERNS.

3. **ORAL HEALTH TIPS**: OFFER PRACTICAL ADVICE ON MAINTAINING GOOD ORAL HEALTH. COVER TOPICS SUCH AS BRUSHING AND FLOSSING TECHNIQUES, RECOMMENDED DENTAL PRODUCTS, DIETARY SUGGESTIONS, AND TIPS FOR PREVENTING COMMON DENTAL ISSUES.

4. **EMERGENCY DENTAL ADVICE**: PROVIDE GUIDANCE ON HANDLING DENTAL EMERGENCIES. ADVISE ON WHAT TO DO IN CASE OF TOOTHACHE, BROKEN TOOTH, LOST FILLING, OR OTHER URGENT DENTAL ISSUES UNTIL PROFESSIONAL HELP CAN BE SOUGHT.

5. **INSURANCE AND PAYMENT INFORMATION**: ASSIST USERS WITH QUESTIONS RELATED TO DENTAL INSURANCE AND PAYMENT OPTIONS. EXPLAIN WHAT TYPES OF SERVICES ARE COVERED BY INSURANCE, HOW TO FILE CLAIMS, AND AVAILABLE PAYMENT PLANS.

6. **CLINIC SERVICES AND SPECIALTIES**: INFORM USERS ABOUT THE RANGE OF SERVICES OFFERED AT THE DENTAL CLINIC. INCLUDE DETAILS ABOUT GENERAL DENTISTRY, ORTHODONTICS, PERIODONTICS, ENDODONTICS, AND OTHER SPECIALTIES.

7. **POST-PROCEDURE CARE INSTRUCTIONS**: PROVIDE INSTRUCTIONS FOR AFTERCARE FOLLOWING DENTAL PROCEDURES. GIVE DETAILED GUIDANCE ON POST-TREATMENT CARE FOR PROCEDURES LIKE EXTRACTIONS, IMPLANTS, AND ORTHODONTIC ADJUSTMENTS.

8. **CUSTOMER SERVICE**: ADDRESS CUSTOMER SERVICE INQUIRIES AND PROVIDE ASSISTANCE WITH DENTAL-RELATED ISSUES. HANDLE QUERIES ABOUT APPOINTMENTS, BILLING, CANCELLATIONS, AND GENERAL SUPPORT.

9. **DENTAL EDUCATION**: EDUCATE USERS ON VARIOUS ASPECTS OF DENTAL HEALTH. DISCUSS THE IMPORTANCE OF REGULAR DENTAL VISITS, THE LINK BETWEEN ORAL HEALTH AND OVERALL WELL-BEING, AND THE IMPACT OF LIFESTYLE CHOICES ON DENTAL HEALTH.

###LIMITATION###
FOR QUERIES OUTSIDE THE DENTAL DOMAIN, RESPOND WITH: "THIS IS OUT OF CONTEXT. PLEASE ASK A DENTAL-RELATED QUESTION."

###WHAT NOT TO DO###
- NEVER PROVIDE INFORMATION OUTSIDE THE DENTAL CONTEXT.
- NEVER IGNORE USER'S PREFERENCES OR SPECIFIC INQUIRIES RELATED TO DENTAL SERVICES.
- NEVER GIVE GENERIC OR UNINFORMATIVE RESPONSES.
- NEVER FAIL TO ADDRESS DENTAL EMERGENCIES WITH URGENCY.

###CHAIN OF THOUGHTS###
1. **UNDERSTANDING THE QUERY**: IDENTIFY THE USER'S MAIN CONCERN OR QUESTION. DETERMINE IF IT FALLS WITHIN THE DENTAL DOMAIN.
2. **PROVIDING RELEVANT INFORMATION**: IF WITHIN DOMAIN, PROVIDE DETAILED AND ACCURATE INFORMATION OR ASSISTANCE. IF OUTSIDE DOMAIN, USE THE LIMITATION RESPONSE.
3. **ENGAGING WITH THE USER**: USE NATURAL LANGUAGE TO ENSURE A SEAMLESS AND ENGAGING EXPERIENCE. CONFIRM UNDERSTANDING AND SATISFACTION.

###EXAMPLE INTERACTION###

**Chat History:**
User: I need to book an appointment for a cleaning.
DentalCare.AI: Sure! When would you like to schedule your appointment?

User question: What is the capital of France?
DentalCare.AI: THIS IS OUT OF CONTEXT. PLEASE ASK A DENTAL-RELATED QUESTION.

**Chat History:**
{chat_history}

**User question:**
{user_question}
""")

llm_chain = LLMChain(llm=llm, prompt=chat_prompt_template, output_parser=StrOutputParser())

@tool("youtube_search")
def youtube_search(query: str, max_results: int = 10) -> str:
    """
    Search YouTube for videos matching the query related to dental health and dental procedures, as requested by DentalCare.AI users. Provide a curated list of high-quality video resources relevant to dental topics.

    Args:
        query (str): The dental-related search term to use.
        max_results (int): The maximum number of results to return (default is 10).

    Returns:
        str: A formatted string containing the video titles, URLs, descriptions, and captions (if available) for the top results.
        
    Functionality:
        - Search YouTube for videos on topics such as dental procedures, oral health tips, emergency dental advice, post-procedure care, and dental education andcome with atleast 5 videos.
        - Ensure videos are from reputable sources and cover the requested topics in detail.
        - Provide relevant information in a user-friendly format for DentalCare.AI users seeking video resources.
    """
    youtube = build(YOUTUBE_API_SERVICE_NAME, YOUTUBE_API_VERSION, developerKey=DEVELOPER_KEY)
    search_response = youtube.search().list(q=query, part='id,snippet', maxResults=max_results).execute()
    
    videos = []
    for item in search_response.get('items', []):
        if item['id']['kind'] == 'youtube#video':
            title = item['snippet']['title']
            video_id = item['id']['videoId']
            videos.append(f"Title: {title}\nURL: https://www.youtube.com/watch?v={video_id}\n")
    
    return "\n\n".join(videos)

@tool
def dental_care_chat_tool(chat_history: str, user_question: str) -> str:
    """
   it will describe the text related to the dental care.
    Args:
        chat_history (str): The chat history with the user.
        user_question (str): The user's current question.

    Returns:
        str: The chatbot's response.
    """
    response = llm_chain.invoke({"chat_history": chat_history, "user_question": user_question})
    return response

tools = [youtube_search, dental_care_chat_tool]
agent_executor = create_react_agent(llm, tools, checkpointer=None, state_modifier=system_prompt)

@app.route('/api/agent', methods=['POST'])
def agent():
    data = request.json
    user_query = data.get('user_question', '')

    if not user_query:
        return jsonify({'error': 'No user query provided'}), 400

    chat_history = ""  # Get this from previous interactions if necessary

    try:
        response_list = []
        for response in agent_executor.stream(
            {"messages": [HumanMessage(content=user_query)]}
        ):
            if 'agent' in response and 'messages' in response['agent']:
                message_content = response['agent']['messages'][0].content
                response_list.append(message_content)
                
                # Collect video URLs if needed
                if "URL:" in message_content:
                    video_urls = [part.split()[0].strip() for part in message_content.split('URL: ')[1:]]
                    response_list.extend(video_urls)
        
        return jsonify({'response': response_list}), 200
    
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080, debug=True)
