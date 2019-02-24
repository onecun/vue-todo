const log = console.log.bind(console)


Vue.component('todo-list', {
    template: '#tpl-show-todo',

    data: function () {
        return {
            todoList: [{
                    id: 0,
                    content: '1111',
                    completed: false,
                },
                {
                    id: 1,
                    content: '2222',
                    completed: false,
                },
                {
                    id: 2,
                    content: '3333',
                    completed: false,
                },
                {
                    id: 3,
                    content: '4444',
                    completed: false,
                },
            ],
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

        // 标记单个 todo为 完成
        markAsCompleted: function (todo) {
            // log('todo', todo)
            todo.completed = true
        },

        // 标记单个 todo为 未完成
        markAsUnCompleted: function (todo) {
            todo.completed = false
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
            if (this.deletedState === 'all') {
                this.deleteAll()
            } else if (this.deletedState === 'completed') {
                this.deleteCompleted()
            } else if (this.deletedState === 'single') {
                this.deleteSingelTodo()
            }
            // log('deletedState', deletedState)
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
            this.todoList = []
            // 重置
            this.reset()
        },
        // 删除全部已完成
        deleteCompleted: function () {
            // 获取未完成的全部 todo
            let unCompletedTodos = this.todoList.filter(function (todo) {
                return !todo.completed
            })
            // 把已完成的 todo 覆盖掉
            this.todoList = unCompletedTodos
            // 重置
            this.reset()
        }
    },

    // 计算属性
    computed: {
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
            } else {
                // 其它未定义的意图我们为其返回全部 todos，
                // 这里面已经包含了 all 意图了
                return this.todoList
            }

        }
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



Vue.component('todo-add', {
    template: '#tpl-add-todo',
    data: function () {
        return {
            todoList: [],
            newTodoContent: '',
            checkEmpty: false,
        }
    },
    methods: {
        addTodo: function () {
            // 得到新 todo 的 id
            let newId = this.todoList.length
            // 组装一个 new todo
            let todo = {
                id: newId,
                content: this.newTodoContent,
                completed: false,
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
    computed: {
        emptyChecked: function () {
            return this.checkEmpty
        }
    },
})

var app = new Vue({
    el: '#todo-app',
})