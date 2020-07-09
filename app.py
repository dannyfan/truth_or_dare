import random
import requests
import re

from bs4 import BeautifulSoup
from flask import Flask, render_template, request, jsonify

app = Flask(__name__)

@app.route("/", methods=["GET"])
def index():
    return render_template("index.html", name=index)

@app.route("/questions", methods=["POST"])
def questions():
    content = request.json
    limit = content["number"]
    if limit.isnumeric():
        limit = int(limit)
        return jsonify(render_template("questions.html", data=get_random_questions(limit)))
    return False

def is_a_question(text):
    return re.search(r"^\d+", text)

def get_random_questions(limit):
    random_questions = {}
    url = "https://parade.com/966507/parade/truth-or-dare-questions/"
    html = requests.get(url).text
    soup = BeautifulSoup(html, "html.parser")
    questions_section_html = soup.find("h2", string="Truth or Dare Questions")
    questions = questions_section_html.find_next_siblings("p")
    if limit > len(questions):
        limit = len(questions)

    while len(random_questions) < limit:
        random_int = random.randint(0, len(questions) - 1)
        question = questions[random_int]
        is_question = question.find("strong")
        if is_question and is_a_question(is_question.text):
            questions.pop(random_int)
            number = is_a_question(is_question.text)[0]
            random_questions[number] = question.text

    return random_questions