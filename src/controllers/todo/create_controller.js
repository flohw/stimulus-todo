import { Controller } from 'stimulus';

export default class extends Controller {
    static targets = ['task', 'list', 'taskElement'];

    connect() {
        const tasks = JSON.parse(localStorage.tasks||'[]');
        tasks.forEach(t => this.appendToList(t));
    }

    add(event) {
        event.preventDefault();
        if (!this.taskTarget.value) {
            return;
        }

        this.addTaskToStorage();
        this.appendToList({name: this.taskTarget.value, done: false});
        this.taskTarget.value = '';
    }

    toggleCheck(event) {
        const index = this.list.map(i => i.querySelector('input')).indexOf(event.target)
        if (index === -1) {
            return;
        }

        this.list[index].classList.toggle('checked');
        const tasks = JSON.parse(localStorage.tasks);
        tasks[index].done = true;
        localStorage.tasks = JSON.stringify(tasks);
    }

    addTaskToStorage() {
        localStorage.tasks = JSON.stringify([
            ...JSON.parse(localStorage.tasks||'[]'),
            {
                name: this.taskTarget.value,
                done: false,
            },
        ]);
    }

    appendToList(task) {
        const input = document.createElement('input');
        input.type = 'checkbox';
        input.className = 'form-check-input';
        input.checked = task.done;
        input.id = `todo-${this.list.length + 1}`;
        input.setAttribute('data-action', 'change->todo--create#toggleCheck');
        const label = document.createElement('label');
        label.innerText = task.name;
        label.htmlFor = input.id;
        label.className = 'form-check-label';
        const wrapper = document.createElement('div')
        wrapper.className = 'form-check';
        wrapper.append(input, label);
        const item = document.createElement('div');
        item.className = 'list-group-item d-flex justify-content-between align-items-start';
        item.setAttribute('data-todo--create-target', 'taskElement');
        item.setAttribute('data-todo--create-checked-class', 'checked');
        if (task.done) {
            item.classList.toggle('checked');
        }
        item.append(wrapper);

        this.listTarget.appendChild(item);
    }

    get list() {
        return this.taskElementTargets;
    }

    clear() {
        localStorage.clear();
        this.listTarget.innerHTML = '';
    }
}
