import json
import os

from webapp.api.Response import Response

def add_book_entry(book_entry):

    response = Response(True)
    folder_path = 'webapp/static/book_contents'
    path = f'{folder_path}/book.json'

    try:
        book_data = {}

        if not os.path.exists(folder_path):
            os.mkdir(folder_path)

        if os.path.exists(path):
            with open(path) as json_file:  
                book_data = json.load(json_file)

        else:
            book_data['book_entries'] = []

        book_data['book_entries'].append(book_entry)

        with open(path, 'w') as f:
            json.dump(book_data, f)       
        
    except Exception as e:
        response.status = False
        response.message = str(e)

    return response.compose()


