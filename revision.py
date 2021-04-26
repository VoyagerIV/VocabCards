# revision API module
import psycopg2

try:
    conn = psycopg2.connect("dbname=app_db")

    # show standard deck revision cards
    def standard_revision(username, deck_name):
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

    # conn.close()

except Exception as e:
    print("Unable to connect to the database")
