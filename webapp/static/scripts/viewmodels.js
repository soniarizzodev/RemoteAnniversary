'strict';
var host = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '');

//Main Application ViewModel
function App() {
    let _self = this;
    this.Book = ko.observable(new BookViewModel());
    this.IsEditMode = ko.observable(false);
    this.CurrentEntry = ko.observable();
}

App.prototype.getBook = function () {
    let _self = this;

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

App.prototype.addEntry = function () {
    let _self = this;

    _self.CurrentEntry(new BookEntryViewModel());
    _self.IsEditMode(true);
};

function BookViewModel(model) {
    let _self = this;

    this.BookEntries = ko.observableArray([]);

    if (model)
        _self.SetFromModel(model);
}

BookViewModel.prototype.SetFromModel = function (model) {
    let _self = this;

    if (model.book_entries) {
        model.book_entries.forEach(book_entry_model => {
            _self.BookEntries.push(new BookEntryViewModel(book_entry_model));
        });
    }
};

BookViewModel.prototype.ToModel = function () {
    let _self = this;

    let model = {
        book_entries: []
    };

    _self.BookEntries().forEach(book_entry => {
        model.book_entries.push(book_entry.ToModel());
    });

    return model;
};

function BookEntryViewModel(model) {
    let _self = this;

    this.Id = ko.observable('');
    this.Author = ko.observable('');
    this.Message = ko.observable('');
    this.Media = ko.observableArray([]);

    if (model)
        _self.SetFromModel(model);
}

BookEntryViewModel.prototype.SetFromModel = function (model) {
    let _self = this;

    if (model.id)
        _self.Id(model.id);

    if (model.author)
        _self.Author(model.author);

    if (model.message)
        _self.Message(model.message);
};

BookEntryViewModel.prototype.ToModel = function () {
    let _self = this;

    let model = {
        id: _self.Id(),
        author: _self.Author(),
        message: _self.Message()
    };

    return model;
};

BookEntryViewModel.prototype.updateBookEntry = function () {
    let _self = this;

    let data = {
        book_entry: _self.ToModel()
    };

    fetch(host + '/updatebookentry',
        {
            method: 'POST',
            body: JSON.stringify(data)
        })
        .then(function (response) {
            if (response.ok)
                return response.json();

        }).then(function (response) {
            if (response.status === false)
                console.log(response.message);
        });
};