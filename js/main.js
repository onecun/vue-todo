const log = console.log.bind(console)
const todoStorage = {
    key1: 'vue-todo',
    key2: 'vue-todo-recycle',
    loadTodos: function () {
        let todos = JSON.parse(localStorage.getItem(this.key1) || '[]')
        todos.forEach(function (todo, index) {
            todo.id = index
        })
        return todos
    },
    loadRecycleBin: function () {
        let todos = JSON.parse(localStorage.getItem(this.key2) || '[]')
        todos.forEach(function (todo, index) {
            todo.id = index
        })
        todoStorage.uid = todos.length + this.loadTodos().length
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
            uid: todoStorage.uid || 0,
            todoList: todoStorage.loadTodos(),
            // 回收站
            recycleBin: todoStorage.loadRecycleBin(),
            // 
            newTodoContent: '',
            checkEmpty: false,
            // 
            // 弹出层状态
            confirmAlert: false,
            // 用于暂存编辑前的 todo 状态
            editedTodo: null,
            // 即将删除的 todo
            deletedTodo: null,
            // 用于保存 筛选删除的状态 (all, singel, completed)
            deletedState: null,
            // 用于保存 筛选显示 todo 的状态 (all, ongoing, completed)
            intention: 'all',
        }
    },

    methods: {
        
        
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

        // 编辑 todo
        editTodo: function (todo) {
            // log('edittodo', todo.content)
            this.editedTodo = {
                id: todo.id,
                content: todo.content,
                completed: todo.completed,
            }
        },
        // 编辑完成后检查
        editDone: function (todo) {
            // 判断编辑后的 todo 是否为空
            if (todo.content === '') {
                this.deleteAlert(todo)
            }
            this.editedTodo = null
        },
        // 取消编辑,还原 todo
        cancelEdit: function (todo) {
            todo.content = this.editedTodo.content
            this.editedTodo = null
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
            log('alert')
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
            log('todo', todo)
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
                return
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

    // 定义 focus 指令
    directives: {
        focus: {
            inserted: function (el, binding) {
                el.focus()
            }
        },
    },
    // 监听数据改动
    // 改动时，保存数据到 localStorage
    watch: {
        todoList: function (todos) {
            todoStorage.saveTodos(todos)
        },
        recycleBin: function (todos) {
            todoStorage.saveRecycle(todos)
        },
    },
})



Vue.component('todo-item-button-completed', {
    template: '#todo-item-button-completed',
    props: ['todo'],
    methods: {
        // 标记单个 todo为 完成
        markAsCompleted: function (todo) {
            // log('todo', todo)
            todo.completed = true
        },
        // 标记单个 todo为 未完成
        markAsUnCompleted: function (todo) {
            todo.completed = false
        },
    },
})

Vue.component('todo-item-button-deleted', {
    template: '#todo-item-button-deleted',
    props: ['todo'],
    methods: {
         // 删除单个 todo 时,确认
        deleteSingleAlert: function (todo) {
            // let data = {
            //     confirmAlert: true,
            //     deletedState: 'single',
            //     // 把要删除的 todo 保存为一个临时 tmpTodo
            //     deletedTodo: todo,
            // }
            log('alert1')
            this.$emit('delete-single-alert', todo)
        },
        // 还原 todo
        restoreTodo: function (todo) {
            // 把 todo 重新添加到 todoList
            todo.removed = false
            this.$emit('restore-todo', todo)
            // this.todoList.push(todo)
            // // 把 todo 从 recycleBin 里删除 
            // let index = this.recycleBin.indexOf(todo)
            // this.recycleBin.splice(index, 1)
        },
    },
})

var app = new Vue({
    el: '#todo-app',
})