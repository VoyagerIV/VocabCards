# decks API module
import psycopg2

try:
    conn = psycopg2.connect("dbname=app_db")

    # display all of user's existing decks on homepage
    def display_decks(username):
        cur = conn.cursor()
        res = {
            'decks': []
        }

        # get all deck's names and types
        query_str = f"""select deck_name, deck_type
        from Decks
        where username = '{username}'; 
        """
        cur.execute(query_str)

        # get number of cards for each deck
        for tup in cur.fetchall():
            deck_name, deck_type = tup

            query_str = f"""select count(*)
            from Cards
            where deck_name = '{deck_name}'
            and username = '{username}';
            """

            cur.execute(query_str)
            total_cards = cur.fetchall()[0][0]

            # append deck info
            deck = {
                'name': deck_name,
                'type': deck_type,
                'total_cards': total_cards
            }
            res['decks'].append(deck)

        return res

    # create new deck
    def create_deck(username, deck_name, deck_type):
        cur = conn.cursor()
        query_str = f"""insert into Decks
        values ('{deck_name}', '{username}', '{deck_type}');
        """
        cur.execute(query_str)
        conn.commit()
        return

    # delete deck

    def delete_deck(username, deck_name):
        cur = conn.cursor()

        # delete all deck's cards
        query_str = f"""delete from Cards
        where deck_name = '{deck_name}';
        """
        cur.execute(query_str)

        # delete the deck
        query_str = f"""delete from Decks
        where username = '{username}'
        and deck_name = '{deck_name}';
        """
        cur.execute(query_str)
        conn.commit()
        return

    # edit deck
    def edit_deck(username, deck_name, new_name, new_type):
        cur = conn.cursor()

        # update deck_name for cards in deck
        query_str = f"""
        alter table Cards disable trigger all;

        update Cards
        set deck_name = '{new_name}'
        where deck_name = '{deck_name}';

        update Decks
        set deck_name = '{new_name}', deck_type = '{new_type}'
        where username = '{username}'
        and deck_name = '{deck_name}';

        alter table Cards enable trigger all;
        """

        cur.execute(query_str)
        conn.commit()
        return

    # conn.close()

except Exception as e:
    print("Unable to connect to the database")
