import json
import os

from webapp.api.Response import Response

def add_book_item (book_item):

    response = Response(True)
    path = 'webapp/static/book_contents/book.json'

    try:
        book_data = {}

        if os.path.exists(path):
            with open(path) as json_file:  
                book_data = json.load(json_file)

        book_data['book_items'].append(book_item)

        with open(path, 'w') as f:
            json.dump(book_data, f)       
        
    except Exception as e:
        response.status = False
        response.message = str(e)

    return response.compose()


