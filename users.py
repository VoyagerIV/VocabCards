# users API module
import psycopg2

try:
    conn = psycopg2.connect("dbname=app_db")

    # check user's credentials for sign in
    def check_credentials(username, password):
        cur = conn.cursor()
        res = {
            'status': 'FOUND'
        }

        query_str = f"""select * from users
        where username = '{username}'
        and user_pass = '{password}';
        """

        cur.execute(query_str)

        if (cur.fetchall() == []):
            res['status'] = 'NOT FOUND'

        return res

    # create new user

    def add_user(username, password):
        cur = conn.cursor()
        res = {
            'status': 'OK'
        }

        # check if username is unique
        query_str = f"""select * from Users
        where username = '{username}';
        """

        cur.execute(query_str)
        if (cur.fetchall() != []):
            res['status'] = 'ERROR'

        else:
            # insert new user into database
            query_str2 = f"""insert into Users
            values ('{username}', '{password}', 'JA');
            """
            cur.execute(query_str2)
            conn.commit()

        return res

    # conn.close()

except Exception as e:
    print("Unable to connect to the database")
