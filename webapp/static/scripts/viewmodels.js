'strict';
var host = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

//Main Application ViewModel
function App() {
    _self = this;
    this.Book = new ko.observable();

}

App.prototype.getBook = function () {
    fetch(host + '/book')
        .then(function (response) {
            if (response.ok)
                return response.json();

        }).then(function (response) {
            if (response.status === false)
                console.log(response.message);
            else if (response.data && response.data.book) {
                const book = response.data.book;
                _self.Book(new BookViewModel(book));
            }
        });
};

function BookViewModel(model) {
    _self = this;
    this.BookItems = ko.observableArray([]);

    if (model)
        _self.SetFromModel(model);
}

BookViewModel.prototype.SetFromModel = function (model) {
    if (model.book_items) {
        model.book_items.forEach(book_item => {
            _self.BookItems.push(book_item);
        });
    }
};