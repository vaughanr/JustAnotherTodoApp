var TodoViewModel = function(templateEl, mainContentEl, persistence){
    this.templateEl = templateEl;
    this.mainContentEl = mainContentEl;
    this.listEl = mainContentEl.getElementsByClassName('todoList')[0];
    this.persistence = persistence;
};

TodoViewModel.prototype.init = function(){
    var that = this;

    var items = this.persistence.getAll();
    this.addManyItems(items);

    var addButton = this.mainContentEl.getElementsByClassName('addItem')[0];
    var todoInput = this.mainContentEl.getElementsByClassName('todoInput')[0];

    this.addEventHandler(addButton,'click',function(){
        var name = todoInput.value;
        if(name){
            that.addNewItem(name);
            todoInput.value = '';
        }
    });

    this.addEventHandler(todoInput,'keyup',function(event){
        if(event.keyCode == 13){
            //Enter keyup event.
            var name = todoInput.value;
            if(name){
                that.addNewItem(name);
                todoInput.value = '';
            }
        }else if(event.keyCode == 27){
            //Esc keyup event.
            todoInput.value = '';
        }
    })
};

TodoViewModel.prototype.addEventHandler = function(el, eventType, handler){
    if (el.addEventListener) {
        el.addEventListener(eventType, handler, false);
    } else if (el.attachEvent) {
        el.attachEvent('on' + eventType, handler);
    } else {
        el['on' + eventType] = handler;
    }
};

TodoViewModel.prototype.createElementFromTemplate = function(item){
    var that = this;

    var clonedTemplate = this.templateEl.cloneNode(true);
    clonedTemplate.setAttribute('data-name', item.name);
    clonedTemplate.getElementsByClassName('itemName')[0].textContent = item.name;

    var checkbox = clonedTemplate.getElementsByTagName('input')[0];
    checkbox.checked = item.isDone;

    var label =  clonedTemplate.getElementsByTagName('label')[0];

    if(checkbox.checked){
        label.className = 'done';
        checkbox.setAttribute("checked", "checked");
    }else{
        checkbox.setAttribute("checked", "");
        checkbox.removeAttribute("checked");
    }

    this.addEventHandler(checkbox,'click',function(){
        if(checkbox.checked ){
            label.className = 'done';
            checkbox.setAttribute("checked", "checked");
        }else{
            label.className = ' ';
            checkbox.setAttribute("checked", "");
            checkbox.removeAttribute("checked");
        }
        item.isDone = checkbox.checked;
        that.persistence.update(item)
    });

    var deleteButton = clonedTemplate.getElementsByClassName('delete')[0];
    this.addEventHandler(deleteButton,'click',function(){
        that.removeByName(item.name);
    });

    return clonedTemplate;
};

TodoViewModel.prototype.addNewItem = function(name){
    var newItem = {
        name:name,
        isDone:false
    };
    if(this.persistence.insert(newItem)){
        this.listEl.appendChild(this.createElementFromTemplate(newItem));
    }
};

TodoViewModel.prototype.addManyItems = function(items){
    for(var i = 0; i< items.length; i++){
        this.listEl.appendChild(this.createElementFromTemplate(items[i]));
    }
};

TodoViewModel.prototype.removeByName = function(name){
    if(name){
        var nodeToRemove = this.listEl.querySelector('[data-name="'+ name +'"]');
        nodeToRemove.parentNode.removeChild(nodeToRemove);
        this.persistence.delete(name);
    }
};





