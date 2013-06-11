var indexOfItem = function(itemArray, name){
    var index = -1;
    for(var i in itemArray){
        if(itemArray[i].name === name){
            index = i;
            break;
        }
    }
    return index;
};

var Persistence = function(){};

Persistence.prototype.putAll =  function(items){
    localStorage.items = JSON.stringify(items);
};

Persistence.prototype.getAll = function(){
    return JSON.parse(localStorage.items || '[]');
};

Persistence.prototype.update =  function(item){
    var storedItems = this.getAll();
    var index = indexOfItem(storedItems,item.name );
    if(index != -1){
        storedItems[index] = item;
        this.putAll(storedItems);
    }
};

Persistence.prototype.insert =  function(item){
    var storedItems = this.getAll();
    var index = indexOfItem(storedItems,item.name );
    if(index == -1 ){
        storedItems.push(item);
        this.putAll(storedItems)
        return true;
    }
    return false;
};

Persistence.prototype.delete = function(name){
    var storedItems = this.getAll();
    var index = indexOfItem(storedItems,name );
    if(index != -1){
        storedItems.splice(index,1);
        this.putAll(storedItems)
    }
}


