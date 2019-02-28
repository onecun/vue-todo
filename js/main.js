const log = console.log.bind(console)
const todoStorage = {
    key1: 'vue-todo',
    key2: 'vue-todo-recycle',
    loadTodos: function () {
        let todos = JSON.parse(localStorage.getItem(this.key1) || '[]')
        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i];
            todo.id = i
        }
        return todos
    },
    loadRecycleBin: function () {
        let todos = JSON.parse(localStorage.getItem(this.key2) || '[]')
        let len = todoStorage.loadTodos().length
        for (let i = 0; i < todos.length; i++) {
            const todo = todos[i];
            todo.id = len
            len++
        }
        todoStorage.uid = len
        log('uid', todoStorage.uid)
        return todos
    },
    saveTodos: function (todos) {
        localStorage.setItem(this.key1, JSON.stringify(todos))
    },
    saveRecycle: function (todos) {
        localStorage.setItem(this.key2, JSON.stringify(todos))
    },
}
Vue.component('todo-list', {
    template: '#tpl-show-todo',

    data: function () {
        return {
            todoList: todoStorage.loadTodos(),
            // 回收站
            recycleBin: todoStorage.loadRecycleBin(),
            // uid 在 todoStorage.loadRecycleBin() 滞后， uid 才被定义
            uid: todoStorage.uid || 0,
            // 
            newTodoContent: '',
            checkEmpty: false,
            // 
            // 弹出层状态
            confirmAlert: false,
            
            // 即将删除的 todo
            deletedTodo: null,
            // 用于保存 筛选删除的状态 (all, singel, completed)
            deletedState: null,
            // 用于保存 筛选显示 todo 的状态 (all, ongoing, completed)
            intention: 'all',
        }
    },

    methods: {
        changeIntention: function(newIntention) {
            this.intention = newIntention
        },
        
        // 所有 todo 标记为完成
        markAllAsCompleted: function () {
            this.todoList.map(function (todo) {
                if (!todo.completed) {
                    todo.completed = true
                }
            })
        },
        // 所有 todo 标记为 未完成
        markAllAsUnCompleted: function () {
            this.todoList.map(function (todo) {
                if (todo.completed) {
                    todo.completed = false
                }
            })
        },

        

        // 主删除
        mainDelete: function () {
            let d = {
                all: this.deleteAll,
                single: this.deleteSingelTodo,
                completed: this.deleteCompleted,
            }
            d[this.deletedState]()
        },
        // 重置状态
        reset: function () {
            this.deletedTodo = null
            this.confirmAlert = false
            this.deletedState = null
        },
        // 点击删除全部 button 时
        deletedAllClick: function () {
            this.confirmAlert = true
            this.deletedState = 'all'
        },
        // 点击删除全部已完成 button 时
        deletedCompletedClick: function () {
            this.confirmAlert = true
            this.deletedState = 'completed'
        },
        // 单个 todo 删除
        deleteSingelTodo: function () {
            let index = this.todoList.indexOf(this.deletedTodo)
            this.todoList.splice(index, 1)
            // 把 deletedTodo 移到回收站 (即把 removed 属性改为 true)
            this.deletedTodo.removed = true
            this.recycleBin.push(this.deletedTodo)
            // 重置
            this.reset()
        },
        // 删除单个 todo 时,确认
        deleteSingleAlert: function (todo) {
            this.confirmAlert = true
            this.deletedState = 'single'
            // 把要删除的 todo 保存为一个临时 tmpTodo
            this.deletedTodo = todo
        },
        // 删除全部
        deleteAll: function () {
            let todos = this.todoList.map(function (todo) {
                todo.removed = true
                return todo
            })
            this.recycleBin.push(...todos)
            this.todoList = []
            // 重置
            this.reset()
        },
        // 删除全部已完成
        deleteCompleted: function () {
            // 获取完成的全部 todo
            let CompletedTodos = this.todoList.filter(function (todo) {
                return todo.completed
            })
            let todos = CompletedTodos.map(function (todo) {
                todo.removed = true
                return todo
            })
            this.recycleBin.push(...todos)
            // 在 todoList 里删除
            let unCompletedTodos = this.todoList.filter(function (todo) {
                return !todo.completed
            })
            this.todoList = unCompletedTodos
            // 重置
            this.reset()
        },
        // 还原 todo
        restoreTodo: function (todo) {
            // 把 todo 重新添加到 todoList
            // todo.removed = false
            this.todoList.push(todo)
            // 把 todo 从 recycleBin 里删除 
            let index = this.recycleBin.indexOf(todo)
            this.recycleBin.splice(index, 1)
        },
        addTodo: function () {
            // 组装一个 new todo
            let todo = {
                id: this.uid++,
                content: this.newTodoContent,
                completed: false,
                removed: false,
            }
            // 把 new todo 添加进 todoList
            if (todo.content !== '') {
                this.todoList.push(todo)
                // 重置
                this.newTodoContent = ''
                this.checkEmpty = false
            } else {
                this.checkEmpty = true
            }
        },
    },

    // 计算属性 (计算属性是一个值)
    computed: {
        // 新增 todo 时，检查是否为空
        emptyChecked: function () {
            return this.checkEmpty
        },

        // 剩余 todo 长度
        remainTodoLength: function () {
            return this.todoList.length
        },
        // 剩余未完成 todo
        leftTodo: function () {
            let unCompletedTodo = this.todoList.filter(function (todo) {
                return !todo.completed
            })
            return unCompletedTodo
        },
        // 剩余未完成 todo 长度
        leftTodoCount: function () {
            return this.leftTodo.length
        },
        // 已完成的 todo
        completedTodo: function () {
            return this.todoList.filter(function (todo) {
                return todo.completed
            })

        },

        // 筛选 todo
        filteredTodoList: function () {
            if (this.intention === 'ongoing') {
                return this.leftTodo
            } else if (this.intention === 'completed') {
                return this.completedTodo
            } else if (this.intention === 'removed') {
                return this.recycleBin
            } else {
                // 其它未定义的意图我们为其返回全部 todos，
                // 这里面已经包含了 all 意图了
                return this.todoList
            }

        },

    },

    
    // 监听数据改动
    // 改动时，保存数据到 localStorage
    watch: {
        todoList: function (todoList) {
            todoStorage.saveTodos(todoList)
        },
        recycleBin: function (recycleBin) {
            todoStorage.saveRecycle(recycleBin)
        },
    },
})



Vue.component('todo-item', {
    template: '#todo-item',
    props: ['todo'],
    data: function() {
        return {
            // 用于暂存编辑前的 todo 状态
            editedTodo: null,
        }
    },
    methods: {
        // 标记单个 todo为 完成
        markAsCompleted: function () {
            // log('todo', todo, this.todo)
            this.todo.completed = true
        },
        // 标记单个 todo为 未完成
        markAsUnCompleted: function () {
            this.todo.completed = false
        },
         // 删除单个 todo 时,确认
        deleteSingleAlert: function () {
            this.$emit('delete-single-alert', this.todo)
        },
        // 还原 todo
        restoreTodo: function () {
            // 把 todo 重新添加到 todoList
            this.todo.removed = false
            this.$emit('restore-todo', this.todo)
        },
        // 编辑 todo
        editTodo: function () {
            // log('edittodo', todo.content)
            let todo = this.todo
            this.editedTodo = {
                id: todo.id,
                content: todo.content,
                completed: todo.completed,
                removed: todo.removed,
            }
        },
        // 编辑完成后检查
        editDone: function () {
            // 判断编辑后的 todo 是否为空
            if (this.todo.content === '') {
                this.deleteSingleAlert(this.todo)
            }
            this.editedTodo = null
        },
        // 取消编辑,还原 todo
        cancelEdit: function () {
            this.todo.content = this.editedTodo.content
            this.editedTodo = null
        },
    },
    // 定义 focus 指令
    directives: {
        focus: {
            inserted: function (el, binding) {
                el.focus()
            }
        },
    },
})


Vue.component('todo-menu-filter-show', {
    template: '#todo-menu-filter-show',
    props: ['intention'],
    methods: {
        changeIntention: function(newIntention) {
            this.$emit('change-intention', newIntention)
        },
    },
})

var app = new Vue({
    el: '#todo-app',
})