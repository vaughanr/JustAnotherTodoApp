describe("persistence", function(){

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
    })

    it('should update the value of an item', function(){

        var item = {
            name:'task1',
            isDone : true
        };

        var expectedCall = [{
            name:'task1',
            isDone : true
        },{
            name:'task2',
            isDone:false
        }];

        persistence.update(item);

        expect(persistence.putAll).toHaveBeenCalledWith(expectedCall);
    });

    it("should insert an item in storage if it doesn't exist", function(){
        var item = {
            name:'task3',
            isDone : true
        };

        var expectedCall = [{
            name:'task1',
            isDone : false
        },{
            name:'task2',
            isDone:false
        },{
            name:'task3',
            isDone:true
        }];

        persistence.insert(item);

        expect(persistence.putAll).toHaveBeenCalledWith(expectedCall);
    });

    it("should not insert duplicate itesms in storage", function(){
        var item = {
            name:'task2',
            isDone : false
        };

        persistence.insert(item);

        expect(persistence.putAll).not.toHaveBeenCalled();
    });

    it("should delete an item if it exists", function(){

        var expectedCall = [{
            name:'task2',
            isDone:false
        }];

        persistence.delete('task1');

        expect(persistence.putAll).toHaveBeenCalledWith(expectedCall);
    });

    it("should not update the localstorage if deleting an item that doesn't exists", function(){

        persistence.delete('unknown name');

        expect(persistence.putAll).not.toHaveBeenCalled();
    });
});