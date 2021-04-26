CREATE TABLE Users
(
    username varchar(50),
    user_pass varchar(50),
    translate_lang varchar(3),

    PRIMARY KEY (username)
);

CREATE TABLE DefineFields
(
    username varchar(50),
    field varchar(20),

    PRIMARY KEY (username, field),
    FOREIGN KEY (username) REFERENCES Users(username)
);


CREATE TABLE Decks
(
    deck_name varchar(50),
    username varchar(50),
    deck_type varchar(20),

    PRIMARY KEY (deck_name, username),
    FOREIGN KEY (username) REFERENCES Users(username)
);

CREATE TABLE Cards
(
    front_field varchar(1000),
    back_field varchar(1000),
    deck_name varchar(50),
    username varchar(50),

    -- for spaced repetition cards
    date_to_revise date,
    box_number integer,

    PRIMARY KEY
    (front_field, deck_name),
    FOREIGN KEY (deck_name, username) REFERENCES Decks(deck_name, username)
);

CREATE TABLE Preferences
(
    username varchar(50),
    lang varchar(3),
    define boolean,
    synonym boolean,
    type boolean,
    example boolean,
    phonetics boolean,
    pronunciation boolean,
    PRIMARY KEY (username),
    FOREIGN KEY (username) REFERENCES Users(username)
)

CREATE TABLE CommonWords
(
    word varchar(500),
    PRIMARY KEY (word)
)