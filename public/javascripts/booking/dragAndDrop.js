const draggables = document.querySelectorAll('.draggable');
const dropzones = document.querySelectorAll('.dropzone');
const dropzonesSeleted = document.querySelector('.dropzonesSeleted')

draggables.forEach((draggable) => {
	draggable.addEventListener('dragstart', () => {
		draggable.classList.add('dragging')
		dropzonesSeleted.classList.add('tellWhereToDrop')
	})
	draggable.addEventListener('dragend', () => {
		draggable.classList.remove('dragging')
		dropzonesSeleted.classList.add('tellWhereToDrop')
	})	
})

dropzones.forEach((dropzone) => {
	dropzone.addEventListener('dragover', e => {
		e.preventDefault()
		const draggable = document.querySelector('.dragging')
		const afterElement = getDragAfterElement(dropzone, e.clientY)
		if(afterElement == null) {
			dropzone.appendChild(draggable)	
		} else {
			dropzone.insertBefore(draggable, afterElement)
		}
	})
})

function getDragAfterElement(dropzone, y) {
	const draggableElements = [...dropzone.querySelectorAll('.draggable:not(.dragging)')]
	return 	draggableElements.reduce((closet, child) => {
				const box = child.getBoundingClientRect()
				const offset = y - box.top - box.height / 2
				// console.log(offset)
				if(offset < 0 && offset > closet.offset){
					return {offset: offset, element: child}
				} else {
					return closet
				}
			},  {offset: Number.NEGATIVE_INFINITY}).element
}