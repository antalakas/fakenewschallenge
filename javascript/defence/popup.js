// Copyright (c) 2014 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

/**
 * Get the current URL.
 *
 * @param {function(string)} callback called when the URL of the current tab
 *   is found.
 */
function getCurrentTabUrl(callback) {
  // Query filter to be passed to chrome.tabs.query - see
  // https://developer.chrome.com/extensions/tabs#method-query
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    // chrome.tabs.query invokes the callback with a list of tabs that match the
    // query. When the popup is opened, there is certainly a window and at least
    // one tab, so we can safely assume that |tabs| is a non-empty array.
    // A window can only have one active tab at a time, so the array consists of
    // exactly one tab.
    var tab = tabs[0];

    // A tab is a plain object that provides information about the tab.
    // See https://developer.chrome.com/extensions/tabs#type-Tab
    var url = tab.url;
      
    var title = tab.title;

    // tab.url is only available if the "activeTab" permission is declared.
    // If you want to see the URL of other tabs (e.g. after removing active:true
    // from |queryInfo|), then the "tabs" permission is required to see their
    // "url" properties.
    console.assert(typeof url == 'string', 'tab.url should be a string');

    callback(url, title);
  });

  // Most methods of the Chrome extension APIs are asynchronous. This means that
  // you CANNOT do something like this:
  //
  // var url;
  // chrome.tabs.query(queryInfo, (tabs) => {
  //   url = tabs[0].url;
  // });
  // alert(url); // Shows "undefined", because chrome.tabs.query is async.
}

/**
 * Change the background color of the current page.
 *
 * @param {string} color The new background color.
 */
function changeBackgroundColor(color) {
  var script = 'document.body.style.backgroundColor="' + color + '";';
  // See https://developer.chrome.com/extensions/tabs#method-executeScript.
  // chrome.tabs.executeScript allows us to programmatically inject JavaScript
  // into a page. Since we omit the optional first argument "tabId", the script
  // is inserted into the active tab of the current window, which serves as the
  // default.
  chrome.tabs.executeScript({
    code: script
  });
}

/**
 * Gets the saved background color for url.
 *
 * @param {string} url URL whose background color is to be retrieved.
 * @param {function(string)} callback called with the saved background color for
 *     the given url on success, or a falsy value if no color is retrieved.
 */
function getSavedBackgroundColor(url, callback) {
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We check
  // for chrome.runtime.lastError to ensure correctness even when the API call
  // fails.
  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

/**
 * Sets the given background color for url.
 *
 * @param {string} url URL for which background color is to be saved.
 * @param {string} color The background color to be saved.
 */
function saveBackgroundColor(url, color) {
  var items = {};
  items[url] = color;
  // See https://developer.chrome.com/apps/storage#type-StorageArea. We omit the
  // optional callback since we don't need to perform any action once the
  // background color is saved.
  chrome.storage.sync.set(items);
}

function send_stance(headline, body_text, stance) {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/stance_article", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.
        var result = JSON.parse(xhr.responseText);
        console.log(result);

        alert(result.result);
      }
    }
    xhr.send(JSON.stringify({headline: headline, body_text: body_text, stance: stance}));
}

// This extension loads the saved background color for the current tab if one
// exists. The user can select a new background color from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage. The chrome.storage API is used for this purpose. This is different
// from the window.localStorage API, which is synchronous and stores data bound
// to a document's origin. Also, using chrome.storage.sync instead of
// chrome.storage.local allows the extension data to be synced across multiple
// user devices.
document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url, title) => {

    var detect_stance = document.getElementById('detect_stance');

    var agree = document.getElementById('agree');
    var disagree = document.getElementById('disagree');
    var discuss = document.getElementById('discuss');
    var unrelated = document.getElementById('unrelated');

//    var dropdown = document.getElementById('dropdown');
//    var theTitle = document.getElementById('theTitle');  
      
// -----------------------------------------------------------      
//    theTitle.value = url;
//    console.log(url);
//    console.log(title);
 
    article_url = document.getElementById('article_url');
    article_title = document.getElementById('article_title');
    article_text = document.getElementById('article_text');
    article_description = document.getElementById('article_description');
    article_keywords = document.getElementById('article_keywords');
    article_image = document.getElementById('article_image');
    article_date = document.getElementById('article_date');
    article_author = document.getElementById('article_author');
    article_publisher = document.getElementById('article_publisher');
    article_copyright = document.getElementById('article_copyright');

    stance_display = document.getElementById('stance_display');

    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5005/getArticleInfo", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.
        var article = JSON.parse(xhr.responseText);
        console.log(article);
          
        article_url.value = article.canonicalLink;
        article_title.value = article.title;
        article_text.value = article.text;
        article_description.value = article.description;
        article_keywords.value = article.keywords;
        article_image.value = article.image;
        article_date.value = article.date;
        article_author.value = article.author;
        article_publisher.value = article.publisher;
        article_copyright.value = article.copyright;
      }
    }
    xhr.send(JSON.stringify({url: url}));

   detect_stance.addEventListener('click', () => {
    var xhr = new XMLHttpRequest();
    xhr.open("POST", "http://localhost:5000/classify_article", true);
    xhr.setRequestHeader("Content-Type", "application/json;charset=UTF-8");
    xhr.onreadystatechange = function() {
      if (xhr.readyState == 4) {
        // JSON.parse does not evaluate the attacker's scripts.
        var result = JSON.parse(xhr.responseText);
        console.log(result);

        stance_display.textContent = result.stance;
      }
    }
    xhr.send(JSON.stringify({headline: article_title.value, body_text:article_text.value}));
   });

   agree.addEventListener('click', () => {
       send_stance(article_title.value, article_text.value, 'agree');
   });

   disagree.addEventListener('click', () => {
       send_stance(article_title.value, article_text.value, 'disagree');
   });

   discuss.addEventListener('click', () => {
       send_stance(article_title.value, article_text.value, 'discuss');
   });

   unrelated.addEventListener('click', () => {
       send_stance(article_title.value, article_text.value, 'unrelated');
   });

//    var xhr = new XMLHttpRequest();
//    xhr.open("GET", "https://water-line.eu/getPriceList", true);
//    xhr.onreadystatechange = function() {
//      if (xhr.readyState == 4) {
//        // JSON.parse does not evaluate the attacker's scripts.
//        var resp = JSON.parse(xhr.responseText);
//        console.log(resp);
//      }
//    }
//    xhr.send();
      
// -----------------------------------------------------------
      
//    // Load the saved background color for this page and modify the dropdown
//    // value, if needed.
//    getSavedBackgroundColor(url, (savedColor) => {
//      if (savedColor) {
//        changeBackgroundColor(savedColor);
//        dropdown.value = savedColor;
//      }
//    });
//
//    // Ensure the background color is changed and saved when the dropdown
//    // selection changes.
//    dropdown.addEventListener('change', () => {
//      changeBackgroundColor(dropdown.value);
//      saveBackgroundColor(url, dropdown.value);
//    });
  });
});
