var templateEl = document.getElementById('itemTemplate').children[0];
var mainContentEl = document.getElementById('mainContent');

var todoView = new TodoViewModel(templateEl,mainContentEl,new Persistence());

todoView.init();
