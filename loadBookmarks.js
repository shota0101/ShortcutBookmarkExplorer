// var keies = 'asdfghjklqwertyuiopzxcvbnm1234567890ASDFGHJKLQWERTYUIOPZXCVBNM';
var keies = 'asdfgqwerxcv1234hjkluiopnm890btyu567';

var node = null;
var parentNodeStack = [];

function isFolder(node) {
  if(node.children)
    return true;
  return false;
}

function isPage(node) {
  if(node.children)
    return false;
  return true;
}

function getDomain(url) {
  return url.split('/')[2];
}

// タブを走査し、ページのアイコンのURLをドメイン毎に保存
function saveDomainFavIconUrl() {
  chrome.tabs.query({}, function(tabs){
    tabs.forEach(function( tab ) {
      var domain = getDomain(tab.url);
      if(domain !== null && domain !== undefined && domain !== '')
	localStorage.setItem(getDomain(tab.url), tab.favIconUrl);
    });
  });
}

function openPage(url, isNewTab){
  var data = {
    url : url
  };
  
  if(isNewTab) { // 新しいタブで開く 
    chrome.tabs.create(data);
  } else { // 現在のタブで開く
    chrome.tabs.update(
      undefined, // デフォルトで現在のタブを選択
      data
    );
  }
}

function createHTML(node){
  var windowIds = [];
  var keyAssigns = [];
  var elements = '';
  var tabsCount = node.length;
  var titleLimit = '';
  var tabElements = '';
  var tabBlockElements = '';
  var targetTabId = '';
  var targetWindowId = '';

  titleLimit = 58;
  tabElementsWidth = '790px';
  tabBlockWidth = '760px';
  // if(tabsCount > 50){
  //   titleLimit = 8;
  //   tabElementsWidth = '190px';
  //   tabBlockWidth = '160px';
  // }else if(tabsCount <= 50 && tabsCount > 34){
  //   titleLimit = 16;
  //   tabElementsWidth = '260px';
  //   tabBlockWidth = '230px';
  // }else if(tabsCount <= 34 && tabsCount > 17){
  //   titleLimit = 28;
  //   tabElementsWidth = '390px';
  //   tabBlockWidth = '360px';
  // }else if(tabsCount <= 17 && tabsCount > 0){
  //   titleLimit = 58;
  //   tabElementsWidth = '790px';
  //   tabBlockWidth = '760px';
  // }

  for(var i = 0; i < node.length; i++){
    if(i >= keies.length){
      break;
    }
    elements += '<div class="tab_element">';
    elements += '<div class="key">' + keies[i] + '</div>';
    elements += '<div class="tab_block">';

    // アイコンの表示
    if( isFolder(node[i]) ) // フォルダ
      elements += '<img src="/images/folder64.png" width="16" class="favicon" />';
    else{
      // ページ
      var domain = getDomain(node[i].url);
      var faviconURL = localStorage.getItem(domain);
      if(faviconURL !== null)
	elements += '<img src="' + faviconURL + '" width="16" class="favicon" />';
    }

    // タイトルがなければURLを表示
    if(node[i].title === '') {
      if(node[i].url !== undefined)
	elements += '<span class="tab_title">' + node[i].url.substr(0, titleLimit) + '</span>';
    } else {
      elements += '<span class="tab_title">' + node[i].title.substr(0, titleLimit) + '</span>';
    }
    
    elements += '</div>';
    elements += '<div class="clear"></div>';
    elements += '</div>';
  }

  document.getElementById('bookmark_list').innerHTML = elements;

  tabElements = document.getElementsByClassName('tab_element');
  tabBlockElements = document.getElementsByClassName('tab_block');

  for(var i = 0; i < node.length; i++){
    if(i >= keies.length){
      break;
    }
    tabElements[i].style.width = tabElementsWidth;
    tabBlockElements[i].style.width = tabBlockWidth;
  }

}


window.onload = function() {
  chrome.bookmarks.getTree(function(roots){

    // 初期化
    node = roots[0].children[0].children;
    createHTML(node);

    window.addEventListener('keydown', function(e){ // キー入力時の処理
      
      if(e.key === "Backspace"){ // Backspaceで親ディレクトリに戻る
	backToParentNode();
	return;
      }

      var isNewTab = e.ctrlKey ? false : true; // 新しいタブで開くかどうか
      // ⌘ → e.metaKey
      // ⌥ → e.altKey

      // 入力キーの取得
      var code = String.fromCharCode(e.keyCode); // 何故か大文字
      if(e.shiftKey === false) // Shiftキーが追われてなければ小文字に変換
	code = code.toLowerCase();

      // 何番目のノードを開くか
      var index = keies.indexOf(code);
      if(index === -1)
	return; // error
      var curNode = node[index];
      
      if( isPage(curNode) ) { // ページを開く場合
	openPage(curNode.url, isNewTab);
      } else { // フォルダを開く場合
	parentNodeStack.push(node); // 親フォルダを保存（遡るために）
	node = curNode.children; // 次のキー入力イベントで利用
	createHTML(node);
      }
    });
  });
  saveDomainFavIconUrl();
}


function backToParentNode(){
  if(parentNodeStack.length === 0){
    return;
  }
  var parentNode = parentNodeStack[parentNodeStack.length - 1];
  node = parentNodeStack.pop();
  createHTML(node);
}

