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

    calculateTotal = function (type) {
            var sum = 0;

            data.allItems[type].forEach(function (cur) {
                sum += cur.value;
            });
            data.totals[type] = sum;
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
        },
        budget: 0,
        percentage: -1
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
        },

        calculateBudget: function () {

            // calculate total income and budget
            calculateTotal('exp');
            calculateTotal('inc');

            // calculate the budget: income - expenses

            data.budget = data.totals.inc - data.totals.exp;

            // calculate the percentage of income that we spent
            if (data.totals.inc > 0) {
                data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
            } else {
                data.percentage = -1;
            }

        },

        getBudget: function () {
            return {
                budget: data.budget,
                totalInc: data.totals.inc,
                totalExp: data.totals.exp,
                percentage: data.percentage
            }
        },

        deleteItem: function(type, id){
            var ids, index;

              ids = data.allItems[type].map(function(current){
                return current.id;
            });
            
            index = ids.indexOf(id);

            if(index !== -1){
                data.allItems[type].splice(index, 1);
            }
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
        budegetLabel: '.budget__value',
        incomeLabel: '.budget__income--value',
        expenseLabel: '.budget__expenses--value',
        percentageLabel: '.budget__expenses--percentage',
        container: '.container'

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
                html = '<div class="item clearfix" id="inc-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div> </div>'
            } else if (type === 'exp') {
                element = DOMStrings.expensesContainer;
                html = ' <div class="item clearfix" id="exp-%id%"> <div class="item__description">%description%</div> <div class="right clearfix"> <div class="item__value">%value%</div> <div class="item__percentage">21%</div> <div class="item__delete"> <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button> </div> </div></div>'
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
        },
        displayBudget: function (obj) {
            document.querySelector(DOMStrings.budegetLabel).textContent = obj.budget;
            document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
            document.querySelector(DOMStrings.expenseLabel).textContent = obj.totalExp;
            if (obj.percentage > 0) {
                document.querySelector(DOMStrings.percentageLabel).textContent = obj.percentage + '%';
            } else {
                document.querySelector(DOMStrings.percentageLabel).textContent = '--';
            }

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

        // Delete exp or inc item
        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem);
    }
    var updateBudget = function () {

        // 1. Calculate the budget
        budgetCntrl.calculateBudget();

        // 2. return the budget

        var budget = budgetCntrl.getBudget();

        // 3. Display the budget on the UI
        UICntrl.displayBudget(budget);
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
var ctrlDeleteItem = function(event){
    var itemID, splitID, type, ID;
    itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
    console.log(itemID);
    if(itemID){
        splitID = itemID.split('-');
        type = splitID[0];
        ID = splitID[1];
    }
    // delete the item from the data structure
    budgetCntrl.deleteItem(type, ID);
    // delete the item from the UI

    // update and show the new budget
}
    return {
        init: function () {
            console.log('Application has started.');
            UICntrl.displayBudget({
                budget: 0,
                totalInc: 0,
                totalExp: 0,
                percentage: -1
            });
            setupEventListeners();
        }
    }

})(budgetController, UIcontroller);

controller.init();