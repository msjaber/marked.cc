class Highlighter {
  constructor(ctx) {
    this.ctx = ctx
  }

  mark(class_name) {
      let selection = window.getSelection(), range
      try {
        range = selection.getRangeAt(0)
      } catch(e) {
        console.warn('Please select a text')
        return
      }

      let is_same_element = range.endContainer.parentElement == range.startContainer.parentElement
      let is_highlighted_element = selection.anchorNode.parentElement.classList.contains('is-highlighted')

      if (is_same_element && is_highlighted_element) {
        let fragment = range.cloneContents()
        let selected_text = fragment.textContent
        let parent_element = selection.anchorNode.parentElement
        let parent_text = parent_element.textContent
        let splited_parts = parent_text.split(selected_text)
        let should_demark = parent_element.dataset.class == class_name
        
        if (should_demark) class_name = 'highlighted--empty'
        
        parent_element.remove()
        
        if (splited_parts[1].length > 0) {
          range.insertNode(this.generate_highlighted_element(splited_parts[1], parent_element.dataset.class))
        }

        let node = this.generate_highlighted_element(selected_text, class_name)
        range.insertNode(node)

        if (splited_parts[0].length > 0) {
          range.insertNode(this.generate_highlighted_element(splited_parts[0], parent_element.dataset.class))
        }

        // window.getSelection().removeAllRanges()
        this.clean_highlighted_elements()
        return
      }
      
      let generated_node = this.generate_highlighted_element(range.extractContents().textContent, class_name)
      range.insertNode(generated_node)

      // Select the new generated_node
      let new_range = document.createRange()
      range.selectNodeContents(generated_node.childNodes[0]) // @todo: make sure childNodes[0] always exists
      selection.removeAllRanges()
      selection.addRange(range)
  }

  clean_highlighted_elements() {
    for (let node = this.ctx.firstChild; node; node = node.nextSibling) {
      // Clean mark elements from any childs
      if (this.is_highlighted_node(node)) {
        node.innerText = node.innerText
      }
    }
  }
  
  generate_highlighted_element(text, class_name) {
    let span = document.createElement("span")
    span.dataset.highlighted = true
    span.dataset.class = class_name
    span.classList.add('is-highlighted')
    span.classList.add(class_name)
    
    span.appendChild(new Text(text))
    return span
  }

  is_highlighted_node(node) {
    if (node.nodeType == 1) {
      return node.classList.contains('is-highlighted')
    }
    return false
  }
}

export default Highlighter