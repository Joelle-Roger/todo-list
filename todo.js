const input = document.getElementById('enterInput')
const todoList = document.getElementById('todoList')


function updateCounter(){
    const items= document.querySelectorAll('.todo-item')
    const activeCount= Array.from(items).filter(item => !item.querySelector('.circle-btn').checked).length
    console.log(`${activeCount} items left`)
    const itemsLeft = document.getElementById('items-left')
    if(itemsLeft){
        itemsLeft.textContent = `${activeCount} items left`
    }
}

function addFilterBar(){
    if (document.querySelector('.filter-bar')) return;
    const filterBar = document.createElement('div')
    filterBar.className='filter-bar'

    const filterAll = document.createElement('button')
    filterAll.className='filter-btn'
    filterAll.id='filter-all'
    filterAll.textContent='All'

    const filterActive = document.createElement('button')
    filterActive.className='filter-btn'
    filterActive.id='filter-active'
    filterActive.textContent='Active'

    const filterCompleted = document.createElement('button')
    filterCompleted.className='filter-btn'
    filterCompleted.id='filter-completed'
    filterCompleted.textContent='Completed'

    const itemsLeft= document.createElement('div')
    itemsLeft.id='items-left'
    itemsLeft.textContent='1 items left'

    const deleteCompleted= document.createElement('button')
    deleteCompleted.id='delete-completed'
    deleteCompleted.textContent='Clear Completed'

    const text = document.createElement('p')
    text.id='drag-drop-text'
    text.textContent='Drag and drop to reorder list'

    filterBar.appendChild(itemsLeft)
    filterBar.appendChild(filterAll)
    filterBar.appendChild(filterActive)
    filterBar.appendChild(filterCompleted)
    filterBar.appendChild(deleteCompleted)
    
    todoList.appendChild(filterBar) 
    document.body.appendChild(text)  
}

function moveFilterBarToEnd() {
    const filterBar = document.querySelector('.filter-bar')
    const text = document.getElementById('drag-drop-text')
    if (filterBar) {
        todoList.appendChild(filterBar)
    }
    if(text){
        document.body.appendChild(text)
    }
}

function clearCompleted(){
    const completedItems=document.querySelectorAll('.todo-item.completed')
    completedItems.forEach(item => {
        item.remove()
        console.log(`${item.innerText} cleared`)
    })
    updateCounter()
    
}
function clearButton(){
    const clearBtn= document.getElementById('delete-completed')
    if(clearBtn){
        clearBtn.addEventListener('click',(e)=>{
            e.preventDefault()
            clearCompleted()
        })
    }
}

function addTodoItem(todoObject){
    const {text,completed} = todoObject
    
    const li = document.createElement('li')
    li.classList.add('todo-item');
    li.classList.add('active');
    li.draggable=true;

    const todoTextNode= document.createElement('span')
    todoTextNode.className='todo-text'
    todoTextNode.textContent=text

    const divBtnText = document.createElement('div')
    divBtnText.className='div-btn-text'
    
    const circleBtn= document.createElement('input')
    circleBtn.type='checkbox'
    circleBtn.classList.add('circle-btn')
    circleBtn.checked=completed
    circleBtn.innerHTML= '<img src="icon-check.png" alt="check">'

    const customCircleBtn = document.createElement('label')
    customCircleBtn.className = 'circle-label'

    const divDelete = document.createElement('div')
    divDelete.className='div-delete'

    const deleteBtn = document.createElement('button')
    deleteBtn.className='delete-btn'
    deleteBtn.textContent='x'
    divBtnText.appendChild(circleBtn)
    divBtnText.appendChild(customCircleBtn)
    divBtnText.appendChild(todoTextNode)
    divDelete.appendChild(deleteBtn)

    li.appendChild(divBtnText)
    li.appendChild(divDelete)
    
    todoList.appendChild(li)
    input.value=""
    console.log(todoTextNode.innerText)
    customCircleBtn.addEventListener('click', () => {
        circleBtn.checked = !circleBtn.checked; 
        console.log(`${li.innerText} is ${circleBtn.checked ? 'checked' : 'unchecked'}`);
            if (circleBtn.checked) {
            customCircleBtn.classList.add('checked');
            li.classList.remove('active')
            li.classList.add('completed')
            } else {
            customCircleBtn.classList.remove('checked');
            li.classList.remove('completed')
            li.classList.add('active')
        }
        updateCounter()
    });
    deleteBtn.addEventListener('click',(e)=>{
        e.preventDefault()
        li.remove()
        console.log(`${li.innerText} deleted`)
        updateCounter()
    })
    
    li.addEventListener('dragstart',handleDragStart)
    li.addEventListener('dragover',handleDragOver)
    li.addEventListener('drop',handleDrop)
    

    moveFilterBarToEnd()
    clearButton()
    updateCounter()
}

input.addEventListener('keypress', function(e){
    if(e.key==='Enter'){
        const text= input.value.trim()
        if(text !==''){
           addTodoItem({
            text:text
           })

           if(!document.querySelector('.filter-bar')){
            addFilterBar()
           }
        }
    }
})
document.body.addEventListener('click',(e)=>{
    if(e.target.classList.contains('filter-btn')){
        const filter= e.target.id.split('-')[1]

        document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'))
        e.target.classList.add('active')

        const items = todoList.children;
        Array.from(items).forEach(item =>{
            if (item.classList.contains('filter-bar')) return; 
            const checkbox = item.querySelector('.circle-btn')
            if (checkbox) {
                if (filter === 'all') {
                    item.style.display = '';
                } else if (filter === 'active') {
                    item.style.display = !checkbox.checked ? '' : 'none';
                } else if (filter === 'completed') {
                    item.style.display = checkbox.checked ? '' : 'none';
                }
            } else {
                item.style.display = 'none'; 
            }
        })
        updateCounter()
    }
})
let draggedItem = null;
function handleDragStart(e){
    draggedItem = this;
    console.log('handle start')
    console.log(`${draggedItem.innerText} is being dragged`)
}

function handleDragOver(e){
    e.preventDefault()
    console.log('handle over')
}

function handleDrop(){
    this.classList.remove('drag-over')
    if(this !== draggedItem){
        todoList.insertBefore(draggedItem,this)
    }
    console.log(`${draggedItem.innerText} is dropped`)
    
    console.log(todoList)
}

const themeBtn = document.getElementById('theme')
themeBtn.addEventListener('click',()=>{
    document.body.classList.toggle('light-theme')
})

