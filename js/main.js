var idb = window.idb;
this._dbPromise = openDatabase();

function openDatabase() {
  if (!navigator.serviceWorker) {
    return Promise.resolve();
  }

  return idb.open('headlines', 2, function(upgradeDb) {
    var store = upgradeDb.createObjectStore('articles', {
      keyPath: 'title'
    });
    store.createIndex('by-publishedDate', 'publishedAt');
  });
}

window.onload = async function () {
  getSources();
  populateCountries();
  new IndexController();
  var topHeadlines = await fetchTopHeadlines();

  _dbPromise.then(function(db) {
    if (!db) return;
    
    var tx = db.transaction('articles', 'readwrite');
    var store = tx.objectStore('articles');
    
    topHeadlines.forEach(function(topHeadline) {
      store.put(topHeadline);
    });

    store.index('by-publishedDate').openCursor(null, 'prev').then(function(cursor) {
      return cursor.advance(20);
    }).then( function deleteRedundant(cursor) {
      if(!cursor) return;
      cursor.delete();
      return cursor.continue().then( deleteRedundant );
    });
  });
}


function IndexController() {
  this._registerServiceWorker();
  this._displayCachedMessages();
  //console.log("displaying")
  var indexController = this;
}


IndexController.prototype._registerServiceWorker = function() {
  if (!navigator.serviceWorker) return;

  var indexController = this;

  navigator.serviceWorker.register('./serviceWorker.js').then(function(reg) {
    if (!navigator.serviceWorker.controller) {
      return;
    }

    if (reg.waiting) {
      indexController._updateReady(reg.waiting);
      return;
    }

    if (reg.installing) {
      indexController._trackInstalling(reg.installing);
      return;
    }

    reg.addEventListener('updatefound', function() {
      indexController._trackInstalling(reg.installing);
    });
  });

  var refreshing;
  navigator.serviceWorker.addEventListener('controllerchange', function() {
    if (refreshing) return;
    window.location.reload();
    refreshing = true;
  });
};

IndexController.prototype._trackInstalling = function(worker) {
  var indexController = this;
  worker.addEventListener('statechange', function() {
    if (worker.state == 'installed') {
      indexController._updateReady(worker);
    }
  });
};

IndexController.prototype._displayCachedMessages = function(event) {
  var indexController = this;

  return window._dbPromise.then(function(db) {
    if (!db) return;

    var index = db.transaction('articles').objectStore('articles').index('by-publishedDate');

    return index.getAll().then(function(headlines) {
      displayHeadlines(headlines.reverse());
    });
  });
};

IndexController.prototype._updateReady = function(worker) {
  new Toast({
    message: 'New version available!',
    type: 'success',
    customButtons: [
      {
        text: 'Refresh the page',
        onClick: function() {
          worker.postMessage({action: 'notWaiting'});
        }
      },
    ]
  });
};