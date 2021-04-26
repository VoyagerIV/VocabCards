from flask import Flask, request, render_template, make_response
import requests
import json

from time import sleep

from data import decks, cards

import decks
import cards
import users
import revision
import preferences

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

# auth page


@APP.route('/auth', methods=['GET'])
def auth_page_route():
    return render_template("auth.html")


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


## auth page ##
@APP.route('/signin', methods=['GET'])
def signin_route():
    username = request.args.get('username')
    password = request.args.get('password')

    # check credentials
    data = users.check_credentials(username, password)

    r = json.dumps(data)
    return r


@APP.route('/register', methods=['GET'])
def register_route():
    username = request.args.get('username')
    password = request.args.get('password')

    # check credentials
    data = users.add_user(username, password)

    r = json.dumps(data)
    return r


## homepage ##
@APP.route('/displayDecks', methods=['GET'])
def display_decks_route():
    username = request.args.get('username')

    # return list of all decks
    data = decks.display_decks(username)

    r = json.dumps(data)
    return r


@APP.route('/createDeck', methods=['GET'])
def create_deck_route():
    deck_name = request.args.get('name')
    deck_type = request.args.get('type')
    username = request.args.get('username')

    decks.create_deck(username, deck_name, deck_type)

    data = {
        'name': deck_name,
        'type': deck_type,
        'total_cards': 0
    }

    r = json.dumps(data)
    return r


@APP.route('/generateDeck', methods=['GET'])
def generate_deck_route():
    username = request.args.get('username')
    deck_name = request.args.get('name')
    fields = request.args.get('fields')

    define = 'y'
    translate = 'n'

    if (fields == "both"):
        translate = 'y'
    elif (fields == "translate"):
        define = 'n'
        translate = 'y'

    decks.create_deck(username, deck_name, "standard")

    for word in ['aware', 'area', 'occur', 'specific', 'create', 'decade', 'legal']:
        back = ""
        if (define == 'y'):
            phrase = word
            url = words_url + phrase

            response = requests.request("GET", url, headers=words_headers)
            response = response.json()

            data = {
                "definition": response["results"][0]["definition"]
            }

            back += f"{data['definition']}<br>"

            if (translate == 'y'):
                phrase = word
                lang = lang.lower()

                memory_querystring['langpair'] = 'en|' + lang
                memory_querystring['q'] = phrase

                response = requests.request(
                    "GET", memory_url, headers=memory_headers, params=memory_querystring)
                response = response.json()

                data = {
                    "translation": response["responseData"]["translatedText"]
                }

                back += f"{data['translation']}<br>"

            # add card to deck
            cards.create_card(username, deck_name, word, back)

    return json.dumps({"status": "ok"})


@APP.route('/deleteDeck', methods=['GET'])
def delete_deck_route():
    deck = request.args.get('deck')
    username = request.args.get('username')

    data = decks.delete_deck(username, deck)

    r = json.dumps(data)
    return r


@APP.route('/editDeck', methods=['GET'])
def edit_deck_route():
    deck = request.args.get('deck')
    username = request.args.get('username')
    new_name = request.args.get('new_name')
    new_type = request.args.get('new_type')

    data = decks.edit_deck(username, deck, new_name, new_type)

    r = json.dumps(data)
    return r


## cards page ##


@APP.route('/displayCards', methods=['GET'])
def display_cards_route():
    # return list of all cards in deck
    deck = request.args.get('deck')
    username = request.args.get('username')

    data = cards.display_cards(username, deck)

    r = json.dumps(data)
    return r


@APP.route('/createCard', methods=['GET'])
def create_card_route():
    front = request.args.get('front')
    back = request.args.get('back')
    username = request.args.get('username')
    deck = request.args.get('deck')

    cards.create_card(username, deck, front, back)

    data = {
        'front': front,
        'back': back
    }

    r = json.dumps(data)
    return r


@APP.route('/deleteCard', methods=['GET'])
def delete_card_route():
    front = request.args.get('front')
    deck = request.args.get('deck')

    data = cards.delete_card(front, deck)

    r = json.dumps(data)
    return r


@APP.route('/editCard', methods=['GET'])
def edit_card_route():
    new_front = request.args.get('new_front')
    new_back = request.args.get('new_back')
    card = request.args.get('card')
    deck = request.args.get('deck')

    data = cards.edit_card(card, deck, new_front, new_back)

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
    username = request.args.get('username')

    data = revision.standard_revision(username, deck)

    r = json.dumps(data)
    return r


## revision page ##
@APP.route('/updatePreferences', methods=['GET'])
def update_preferences_route():

    username = request.args.get('username')

    define = request.args.get('define')
    type = request.args.get('type')
    synonym = request.args.get('synonym')
    example = request.args.get('example')
    phonetics = request.args.get('phonetics')
    pronunciation = request.args.get('pronunciation')

    preferences = {'define': define, "type": type, "synonym": synonym,
                   "example": example, "phonetics": phonetics, "pronunciation": pronunciation}

    preferences.update_preferences(username, preferences)

    return json.dumps({"status": "ok"})


if (__name__ == "__main__"):
    APP.run(debug=True)
