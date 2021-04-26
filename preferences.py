# cards API module
import psycopg2

try:
    conn = psycopg2.connect("dbname=app_db")

    # updates user preferences
    def update_preferences(username, preferences):
        cur = conn.cursor()

        # construct query string
        query_str = f"update Preferences where username = {username} "
        for preference in preferences:
            query_str += f"AND {preference} = {preferences[preference]} "

        cur.execute(query_str)
        # save changes
        conn.commit()

        return

    # conn.close()

except Exception as e:
    print("Unable to connect to the database")
