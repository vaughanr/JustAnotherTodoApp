var createEl = function(element){
    var el = document.createElement(element.tag);
    for(var propName in element){
        if(propName != 'tag'){
            el[propName] = element[propName];
        }
    }
    return el;
};

describe("todoView", function(){

    var todoView;

    /*<li>
         <div>
             <input type="checkbox"/>
             <label class="itemName"></label>
             <button class="delete"></button>
         </div>
     </li>*/
    var createDomTemplate = function(){
        var li = createEl({tag:'li'});
        var div = createEl({tag:'div'});

        var checkbox = createEl({
            tag:'input',
            type:'checkbox'
        });
        var label = createEl({
            tag:'label',
            className:'itemName'
        });
        var button = createEl({
            tag:'button',
            className:'delete'
        });

        div.appendChild(checkbox);
        div.appendChild(label);
        div.appendChild(button);
        li.appendChild(div);
        return li;
    };

    /* <section id="mainContent">
         <input class="todoInput" type="text" placeholder="What do you need to do?" autofocus/>
         <button class="addItem">Add</button>
         <ul class="todoList"/>
     </section>*/
    var createMainContent = function(){
        var section = createEl({tag:'section',id:'mainContent'});

        var input  = createEl({tag:'input',className:'todoInput', type:'text', placeholder:'What do you need to do?', autofocus:true});
        var button  = createEl({tag:'button',className:'addItem'});
        button.value = 'Add';
        var ul = createEl({tag:'ul',className:'todoList'});

        section.appendChild(input);
        section.appendChild(button);
        section.appendChild(ul);
        return section;
    };

    var persistence;
    var store;

    beforeEach(function(){
        persistence = new Persistence();
        store = [{
            name:'task1',
            isDone : false
        },{
            name:'task2',
            isDone:false
        }];

        spyOn(persistence,'putAll').andCallFake(function(items){
            store = items;
        });
        spyOn(persistence,'getAll').andCallFake(function(){
            return store;
        });


        var template = createDomTemplate();
        var  mainContent =  createMainContent();
        todoView = new TodoViewModel(template, mainContent, persistence);
    });

    it("should create an li element from an item", function(){
        var item = {
            name:'testName',
            isDone:false
        };

        var created = todoView.createElementFromTemplate(item);

        expect(created.tagName).toBe('LI');
    });

    it("should add a persistence update on the checkbox click when creating an li element from an item", function(){
        var item = {
            name:'testName',
            isDone:false
        };
        spyOn(persistence,'update');

        var createdEl = todoView.createElementFromTemplate(item);
        var checkbox = createdEl.getElementsByTagName('input')[0];
        checkbox.click();

        expect(persistence.update).toHaveBeenCalled();
    });

    it("should add a persistence delete on the delete button click when creating an li element from an item", function(){
        var item = {
            name:'testName',
            isDone:false
        };
        spyOn(persistence,'delete');

        var createdEl = todoView.createElementFromTemplate(item);
        todoView.listEl.appendChild(createdEl);
        var deleteButton = createdEl.getElementsByClassName('delete')[0];
        deleteButton.click();

        expect(persistence.delete).toHaveBeenCalled();
    });

    describe("adding items", function(){

        it("should add many item to the container el", function(){
            var allItems = [{
                    name:'testName',
                    isDone:false
                },
                {
                    name:'name2',
                    isDone:false
                },
                {
                    name:'name3',
                    isDone:true
                }];
            expect(todoView.listEl.children.length).toBe(0);

            todoView.addManyItems(allItems);

            expect(todoView.listEl.children.length).toBe(3);
        });

        it("should add items multiple times", function(){
            var itemSet1 = [{
                    name:'testName',
                    isDone:false
                },
                {
                    name:'name2',
                    isDone:false
                }];

            var itemSet2 = [{
                    name:'name 3',
                    isDone:false
                },
                {
                    name:'name 4',
                    isDone:false
                }];
            expect(todoView.listEl.children.length).toBe(0);

            todoView.addManyItems(itemSet1);
            expect(todoView.listEl.children.length).toBe(2);

            todoView.addManyItems(itemSet2);
            expect(todoView.listEl.children.length).toBe(4);
        });

        it("should insert into persistence when adding item from input",function(){
            spyOn(persistence,'insert');

            todoView.addNewItem('another thing to do');

            expect(persistence.insert).toHaveBeenCalled();
        });
    });

    describe("removing items", function(){
            it("should ignore empty inputs", function(){
                todoView.removeByName('');
            });

            it("should remove an item from the container by name", function(){
                var allItems = [{
                        name:'testName',
                        isDone:false
                    },
                    {
                        name:'name2',
                        isDone:false
                    },
                    {
                        name:'name3',
                        isDone:true
                    }];
                todoView.addManyItems(allItems);
                expect(todoView.listEl.children.length).toBe(3);
                expect(todoView.listEl.querySelector('[data-name="name2"]')).not.toBeNull();

                spyOn(persistence,'delete');

                todoView.removeByName('name2');

                expect(todoView.listEl.children.length).toBe(2);
                expect(todoView.listEl.querySelector('[data-name="name2"]')).toBeNull();
                expect(persistence.delete).toHaveBeenCalled();
            });
    });

    it('should add a client event handler onto an element',function(){
        var button = createEl({
            tag:'button'
        });

        var triggered = false;

        todoView.addEventHandler(button,'click',function(){
            triggered = true;
        });

        button.click();

        expect(triggered).toBe(true);
    });
});
