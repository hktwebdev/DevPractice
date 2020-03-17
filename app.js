// Budget Controller 
budgetController = (function () {
    // Expense
    var Expense = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // Income
    var Income = function (id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    }

    // Data
    var data = {
        allItems: {
            exp: [],
            inc: []
        },
        totals: {
            exp: 0,
            inc: 0
        }
    }

    return {
        addItem: function (type, des, val) {
            var ID, newItem;

            // creating new ID
            if (data.allItems[type].length > 0) {
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
            } else {
                ID = 0;
            }
            // create new item based on 'exp' or 'inc' type
            if (type === 'exp') {
                newItem = new Expense(ID, des, val);
            } else if (type === 'inc') {
                newItem = new Income(ID, des, val);
            }

            // push  item to data structure 
            data.allItems[type].push(newItem);

            //return new element
            return newItem;
        }

    }

})();

// UI Controller
var UIcontroller = (function () {

    var DOMStrings = {
        inputType: '.add__type',
        inputDescription: '.add__description',
        inputValue: '.add__value',
        clickAddBtn: '.add__btn',
        expensesContainer: '.expenses__list',
        incomeContainer: '.income__list',
    }

    return {
        getInput: function () {
            return {
                type: document.querySelector(DOMStrings.inputType).value,
                description: document.querySelector(DOMStrings.inputDescription).value,
                value: parseFloat(document.querySelector(DOMStrings.inputValue).value)
            };
        },

        getDOMStrings: function () {
            return DOMStrings;

        },

        addListItem: function (obj, type) {
            var html, newHtml, element;
            // create HTML string with place holder text
            if (type === 'inc') {
                element = DOMStrings.incomeContainer;
                html = '<div class="item clearfix" id="income-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = ' <div class="item clearfix" id="expense-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div>'
            }

            // replace the place holder text with some actual data
            newHtml = html.replace('%id%', obj.id);
            newHtml = newHtml.replace('%description%', obj.description);
            newHtml = newHtml.replace('%value%', obj.value);

            // insert the HTML into the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
        },

        clearFields: function () {
            var fields, fieldArr;

            fields = document.querySelectorAll(DOMStrings.inputDescription + ', ' + DOMStrings.inputValue);
            fieldArr = Array.prototype.slice.call(fields);

            fieldArr.forEach(function (current, index, array) {
                current.value = '';
                console.log(index, array);
            });
            fieldArr[0].focus();
        }
    }
})();


// Controller
var controller = (function (budgetCntrl, UICntrl) {

    var setupEventListeners = function () {
        var DOM = UICntrl.getDOMStrings();

        // On click of add item button
        document.querySelector(DOM.clickAddBtn).addEventListener('click', ctrlAddItem);

        // On press enter button
        document.addEventListener('keypress', function (event) {

            if (event.keyCode === 13 || event.which === 13) {
                ctrlAddItem();
            }
        });
    }
    var updateBudget = function(){

        // 1. Calculate the budget
        
        // 2. return the budget

        // 3. Display the budget on the UI
    }

    var ctrlAddItem = function () {
        var input, newItem;
        // 1. Get the field input data
        input = UICntrl.getInput();

        if (input.description !== '' && !isNaN(input.value) && input.value > 0) {

            // 2. Add the item to budget controller
            newItem = budgetCntrl.addItem(input.type, input.description, input.value);

            // 3. Add the item to the UI
            UICntrl.addListItem(newItem, input.type);

            // 4. clear input fields after adding
            UICntrl.clearFields();
            
            // 5. Calculate and update the budget
            updateBudget();
            
        }


    }

    return {
        init: function () {
            console.log('Application has started.');
            setupEventListeners();
        }
    }

})(budgetController, UIcontroller);

controller.init();