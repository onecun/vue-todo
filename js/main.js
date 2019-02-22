const log = console.log.bind(console)

Vue.component('todo-list', {
    template: '#tpl-show-todo',
    data: function() {
        return {
            todoList: [
                {id: 0, content: '1111'},
                {id: 1, content: '2222'},
            ],
        }
    },
})

Vue.component('todo-add', {
    template: '#tpl-add-todo',
    data: function() {
        return {
            todoList: [],
            newTodoContent: '',

        }
    },
    methods: {
        addTodo: function() {
            // 得到新 todo 的 id
            let newId = this.todoList.length
            // 组装一个 new todo
            let todo = {id: newId, content: this.newTodoContent}
            // 把 new todo 添加进 todoList
            if (todo.content !== '') {
                this.todoList.push(todo)
            } else {
                return
            }
        }
    },
})

var app = new Vue({
    el: '#todo-app',  
})