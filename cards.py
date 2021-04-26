# cards API module
import psycopg2

try:
    conn = psycopg2.connect("dbname=app_db")

    # display all of deck's existing cards
    def display_cards(username, deck_name):
        cur = conn.cursor()
        res = {
            'cards': []
        }

        # get all deck's cards
        query_str = f"""select front_field, back_field
        from Cards
        where username = '{username}'
        and deck_name = '{deck_name}';
        """
        cur.execute(query_str)

        for tup in cur.fetchall():
            front, back = tup

            card = {
                'front': front,
                'back': back
            }

            res['cards'].append(card)

        return res

    # create new card

    def create_card(username, deck_name, front_field, back_field):
        cur = conn.cursor()
        query_str = f"""insert into Cards
        values ('{front_field}', '{back_field}', '{deck_name}', '{username}');
        """
        cur.execute(query_str)
        conn.commit()
        return

    # delete deck

    def delete_card(front_field, deck_name):
        cur = conn.cursor()
        query_str = f"""delete from Cards
        where front_field = '{front_field}'
        and deck_name = '{deck_name}';
        """
        cur.execute(query_str)
        conn.commit()
        return

    # edit deck
    def edit_card(front_field, deck_name, new_front, new_back):
        print(f"{new_front} and {new_back}")
        cur = conn.cursor()
        query_str = f"""update Cards
        set front_field = '{new_front}', back_field = '{new_back}'
        where front_field = '{front_field}'
        and deck_name = '{deck_name}';
        """
        cur.execute(query_str)
        conn.commit()
        return

    # conn.close()

except Exception as e:
    print("Unable to connect to the database")
