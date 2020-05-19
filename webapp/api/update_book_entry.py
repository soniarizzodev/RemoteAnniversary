import json
import os
import random
import string

from webapp.api.Response import Response

def update_book_entry(book_entry):

    response = Response(True, 'Entry added successfully')

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

        is_new = False if 'id' in book_entry and book_entry['id'] else True

        if is_new:
            book_entry['id'] = len(book_data['book_entries']) + 1;
            book_entry['edit_key'] = ''.join(random.choices(string.ascii_uppercase + string.digits, k=6))
            

        book_data['book_entries'].append(book_entry)
       
        with open(path, 'w') as f:
            json.dump(book_data, f) 
            
        if is_new:           
            response.add('edit_key', book_entry['edit_key'])

        response.add('is_new', is_new)
        
    except Exception as e:
        response.status = False
        response.message = str(e)

    return response.compose()


