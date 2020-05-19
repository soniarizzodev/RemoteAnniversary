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

    _self.CurrentEntry(new BookEntryViewModel({ is_new : true }));
    _self.IsEditMode(true);
};

App.prototype.showDeleteModal = function () {
    $('#deleteModal').modal('show');
};

App.prototype.showEditModal = function () {
    $('#editModal').modal('show');
};

App.prototype.showKeyModal = function () {
    $('#keyModal').modal('show');
};

App.prototype.hideAllModals = function () {
    $('.modal').modal('hide');
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
    this.EditKey = ko.observable('');
    this.IsNew = ko.observable(false);

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

    if (model.is_new)
        _self.IsNew(model.is_new);
};

BookEntryViewModel.prototype.ToModel = function () {
    let _self = this;

    let model = {
        id: _self.Id(),
        author: _self.Author(),
        message: _self.Message(),
        edit_key: _self.EditKey()
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
            app.hideAllModals();

            if (response.status === false)
                console.log(response.message);
            else
                if (response.data.is_new) {
                    _self.EditKey(response.data.edit_key);
                    app.showKeyModal();
                }                    
        });
};

BookEntryViewModel.prototype.deleteBookEntry = function () {
    let _self = this;

    let data = {
        book_entry_id: _self.Id(),
        edit_key: _self.EditKey()
    };

    fetch(host + '/deletebookentry',
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
            else {
                app.Book().BookEntries.remove(_self);
                app.hideAllModals();
            }
        });
};

BookEntryViewModel.prototype.startDeleteProcess = function () {
    let _self = this;

    app.CurrentEntry(_self);

    app.showDeleteModal();
};

BookEntryViewModel.prototype.startEditProcess = function () {
    let _self = this;

    app.CurrentEntry(_self);

    app.IsEditMode(true);
};

BookEntryViewModel.prototype.checkUpdateBookEntry = function () {
    let _self = this;

    if (_self.IsNew())
        _self.updateBookEntry();
    else
        app.showEditModal();
};

BookEntryViewModel.prototype.confirmUpdateBookEntry = function () {
    let _self = this;

    _self.updateBookEntry();     
};