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

        is_new = False

        existing_entry = next((entry for entry in book_data['book_entries'] if entry['id'] == book_entry['id']), None)

        if existing_entry is not None:
            # Stop execution and return exception if the edit key doesn't match
            if book_entry['edit_key'] != existing_entry['edit_key']:
                raise Exception('Edit Key doesn\'t match')

            existing_entry['author'] = book_entry['author']
            existing_entry['message'] = book_entry['message']

        else:
            is_new = True
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


