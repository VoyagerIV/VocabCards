from flask import Flask, request, render_template, make_response
import requests
import json

from data import decks, cards

# creates an instance of the Flask class (ie a Flask object)
APP = Flask(__name__)


## APIs ##

# Lingua Robot
lingua_url = "https://lingua-robot.p.rapidapi.com/language/v1/entries/en/"

lingua_headers = {
    'x-rapidapi-key': "f6b08f544fmshdcdb6e7956faaf4p1d04b1jsn57fc9de00152",
    'x-rapidapi-host': "lingua-robot.p.rapidapi.com"
}

# Words
words_url = "https://wordsapiv1.p.rapidapi.com/words/"

words_headers = {
    'x-rapidapi-key': "f6b08f544fmshdcdb6e7956faaf4p1d04b1jsn57fc9de00152",
    'x-rapidapi-host': "wordsapiv1.p.rapidapi.com"
}

# MyMemory
memory_url = "https://translated-mymemory---translation-memory.p.rapidapi.com/api/get"

memory_querystring = {"langpair": "en|it", "q": "Hello World!",
                      "mt": "1", "onlyprivate": "0", "de": "a@b.c"}

memory_headers = {
    'x-rapidapi-key': "f6b08f544fmshdcdb6e7956faaf4p1d04b1jsn57fc9de00152",
    'x-rapidapi-host': "translated-mymemory---translation-memory.p.rapidapi.com"
}


## card data ##
cards_data = {
    'cards': []
}


## page routes ##

# homepage
@APP.route('/', methods=['GET'])
def home():
    return render_template("index.html")

# cards page


@APP.route('/cardsPage', methods=['GET'])
def cards_page_route():
    return render_template("cards.html")

# revision page


@APP.route('/revisionPage', methods=['GET'])
def revision_page_route():
    return render_template("revision.html")

# preferences


@APP.route('/preferences', methods=['GET'])
def preferences_page_route():
    return render_template("preferences.html")


## homepage ##
@APP.route('/displayDecks', methods=['GET'])
def display_decks_route():

    # return list of all decks
    data = decks

    r = json.dumps(data)
    return r


@APP.route('/createDeck', methods=['GET'])
def create_deck_route():
    deck_name = request.args.get('name')
    deck_type = request.args.get('type')

    data = {
        'id': '123',
        'name': deck_name,
        'type': deck_type,
        'total_cards': 0
    }

    decks['decks'].append(data)
    r = json.dumps(data)
    return r


## cards page ##

@APP.route('/displayCards', methods=['GET'])
def display_cards_route():
    # return list of all cards in deck
    deck = request.args.get('deck')
    existingDecks = ['Adjectives', 'Physics',
                     'Trivia', 'Countries', 'Algorithms']

    data = cards_data
    if (deck in existingDecks):
        data = cards

    r = json.dumps(data)
    return r


@APP.route('/createCard', methods=['GET'])
def create_card_route():
    front = request.args.get('front')
    back = request.args.get('back')

    data = {
        'id': '123',
        'front': front,
        'back': back
    }

    cards_data['cards'].append(data)
    r = json.dumps(data)
    return r


@APP.route('/autoDefine', methods=['GET'])
def auto_define_route():
    phrase = request.args.get('phrase')
    url = words_url + phrase

    response = requests.request("GET", url, headers=words_headers)
    response = response.json()

    data = {
        "definition": response["results"][0]["definition"]
    }

    r = json.dumps(data)
    return r


@APP.route('/autoTranslate', methods=['GET'])
def auto_translate_route():
    phrase = request.args.get('phrase')
    lang = request.args.get('lang').lower()

    memory_querystring['langpair'] = 'en|' + lang
    memory_querystring['q'] = phrase

    response = requests.request(
        "GET", memory_url, headers=memory_headers, params=memory_querystring)
    response = response.json()

    data = {
        "translation": response["responseData"]["translatedText"]
    }

    r = json.dumps(data)
    return r


@APP.route('/autoPronounce', methods=['GET'])
def auto_pronounce_route():
    phrase = request.args.get('phrase')
    url = lingua_url + phrase

    response = requests.request("GET", url, headers=lingua_headers)
    response = response.json()

    audio_url = ''
    # find audio pronunciation link
    pronun_list = response["entries"][0]["pronunciations"]
    for i in pronun_list:
        if "audio" in i:
            audio_url = i["audio"]["url"]

    data = {
        "pronunciation": audio_url
    }

    r = json.dumps(data)
    return r


@APP.route('/revisionCards', methods=['GET'])
def revision_cards_route():
    deck = request.args.get('deck')
    existingDecks = ['Adjectives', 'Physics',
                     'Trivia', 'Countries', 'Algorithms']

    data = cards_data
    if (deck in existingDecks):
        data = cards

    r = json.dumps(data)
    return r


if (__name__ == "__main__"):
    APP.run(debug=True)
