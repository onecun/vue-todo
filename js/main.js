const log = console.log.bind(console)

Vue.component('todo-list', {
    template: '#tpl-show-todo',
    data: function() {
        return {
            todoList: [
                {id: 0, content: '1111', completed: false,},
                {id: 1, content: '2222', completed: false,},
                {id: 2, content: '3333', completed: false,},
                {id: 3, content: '4444', completed: false,},
            ],
            confirmAlert: false,
            tmpTodo: '',
        }
    },
    methods: {
        markAsCompleted: function(todo) {
            // log('todo', todo)
            todo.completed = true
        },
        markAsUnCompleted: function(todo) {
            todo.completed = false
        },
        deleteTodo: function() {
            let index = this.todoList.indexOf(this.tmpTodo)
            this.todoList.splice(index, 1)
            // 重置
            this.tmpTodo = ''
            this.confirmAlert = false
        },
        deleteAlert(todo) {
            this.confirmAlert = true
            // 把要删除的 todo 保存为一个临时 tmpTodo
            this.tmpTodo = todo
        }
    },
})

Vue.component('todo-add', {
    template: '#tpl-add-todo',
    data: function() {
        return {
            todoList: [],
            newTodoContent: '',
            checkEmpty: false,
        }
    },
    methods: {
        addTodo: function() {
            // 得到新 todo 的 id
            let newId = this.todoList.length
            // 组装一个 new todo
            let todo = {id: newId, content: this.newTodoContent, completed: false,}
            // 把 new todo 添加进 todoList
            if (todo.content !== '') {
                this.todoList.push(todo)
                // 重置
                this.newTodoContent = ''
                this.checkEmpty = false
            } else {
                this.checkEmpty = true
                return
            }
        },
        
    },
    computed: {
        emptyChecked: function() {
            return this.checkEmpty
        }
    },
})

var app = new Vue({
    el: '#todo-app',  
})