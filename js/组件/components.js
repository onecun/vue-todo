Vue.component('todo-item-completed', {
    template: '#todo-item-completed',
    data: function() {
        return {
            
        }
    },
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