"""
Routes and views for the flask application.
"""

from datetime import datetime
from flask import render_template, request
from webapp import app

from webapp.api.get_book import get_book
from webapp.api.update_book_entry import update_book_entry
from webapp.api.delete_book_entry import delete_book_entry

from webapp.const import ERROR_MISSING_PARAMS

@app.route('/')
@app.route('/home')
def home():
    """Renders the home page."""
    return render_template(
        'index.html',
        title='Home Page',
        year=datetime.now().year,
    )

@app.route('/contact')
def contact():
    """Renders the contact page."""
    return render_template(
        'contact.html',
        title='Contact',
        year=datetime.now().year,
        message='Your contact page.'
    )

@app.route('/about')
def about():
    """Renders the about page."""
    return render_template(
        'about.html',
        title='About',
        year=datetime.now().year,
        message='Your application description page.'
    )

################################################
## WEB SERVICES

@app.route('/book')
def book():    
    """Returns the book content."""
    return get_book()


@app.route('/updatebookentry', methods=['GET', 'POST'])
def updatebookentry():    
    """Adds or updates a book entry"""
    data = request.get_json(force=True)

    if (data is not None) and ('book_entry' in data):
        return update_book_entry(data['book_entry'])
    else:
        response = Response(False, ERROR_MISSING_PARAMS)
        return response.compose()


@app.route('/deletebookentry', methods=['GET', 'POST'])
def deletebookentry():    
    """Deletes a book entry"""
    data = request.get_json(force=True)

    if (data is not None) and ('book_entry_id' in data) and ('edit_key' in data):
        return delete_book_entry(data['book_entry_id'], data['edit_key'])
    else:
        response = Response(False, ERROR_MISSING_PARAMS)
        return response.compose()