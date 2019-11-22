import {placeCaretAtEnd} from './utils.js'

class Highlighter {
  constructor(ctx) {
    this.ctx = ctx
  }

  normalize() {
    this.ctx.childNodes.forEach(node => {
      // stand-alone text nodes
      if (node.nodeType == Node.TEXT_NODE) {
        this.ctx.replaceChild(wrap_with_line(new Text(node.textContent)), node)
        return
      }
      
      // break lines, div with </br>
      if (node.nodeType == Node.ELEMENT_NODE && node.textContent.length == 0) {
        if (! is_line(node)) {
          this.ctx.replaceChild(wrap_with_line(node.firstChild), node)
        }
        return
      }
      
      if (node.nodeType == Node.ELEMENT_NODE &&  !is_line(node)) {
        this.ctx.replaceChild(wrap_with_line(new Text(node.textContent)), node)
        return
      }

      if (node.nodeType == Node.ELEMENT_NODE && is_line(node)) {
        normalize_line(node)
      }
    })

    // First time.. fix the caret jump bug
    if (this.ctx.textContent.length == 1) {
      placeCaretAtEnd(this.ctx)
      return 
    }
  }

  mark(class_name) {
      let selection = window.getSelection(), range
      try {
        range = selection.getRangeAt(0)
      } catch(e) {
        console.warn('Please select a text')
        return
      }

      let fragment = range.cloneContents()
      let start_line = find_parent_line(range, range.startContainer)
      let end_line = find_parent_line(range, range.endContainer)
      let is_multiline_selection = start_line != end_line
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
        window.getSelection().removeAllRanges()
        return
      }
      
      if (is_multiline_selection) {
        let first_node = fragment.childNodes[0]
        let last_node = fragment.childNodes[fragment.childNodes.length - 1]

        let start_is_partially_selected = first_node.textContent.length < start_line.textContent.length
        let end_is_partially_selected = last_node.textContent.length < end_line.textContent.length

        let should_demark = false
        
        if (
          is_highlighted_node(range.startContainer.parentElement) && 
          is_highlighted_node(range.endContainer.parentElement)
          ) {
          should_demark = range.startContainer.parentElement.dataset.class == range.endContainer.parentElement.dataset.class
        }

        if (should_demark) class_name = 'highlighted--empty'

        fragment.childNodes.forEach((node, index) => {
          let is_first_node = index == 0
          let is_last_node = index == fragment.childNodes.length - 1
          
          // if the line is break line ..
          if (node.textContent.length == 0) {
            return
          }

          // if partial selection
          if (is_first_node && start_is_partially_selected) {
            let line_text = start_line.textContent
            let partial_text = node.textContent
            let index_of_partial_text = line_text.indexOf(partial_text)
            let line_partial_text = line_text.slice(0, index_of_partial_text)
            
            let highlighted_element = this.generate_highlighted_element(partial_text, class_name)
            node.innerText = line_partial_text
            node.appendChild(highlighted_element)
            start_line.remove()
          } else if (is_last_node && end_is_partially_selected) {
            let line_text = end_line.textContent
            let partial_text = node.textContent
            let index_of_partial_text = line_text.indexOf(partial_text)
            let line_partial_text = line_text.slice(index_of_partial_text + partial_text.length)
            let highlighted_element = this.generate_highlighted_element(partial_text, class_name)
            node.innerText = line_partial_text
            node.insertAdjacentElement('afterbegin', highlighted_element)
            end_line.remove()
          } else {
            let text = node.textContent
            node.innerText = ''
            node.appendChild(this.generate_highlighted_element(text, class_name))
          }
        })
      } else {
        let generated_node = this.generate_highlighted_element(range.extractContents().textContent, class_name)
        range.insertNode(generated_node)
        this.normalize()
        window.getSelection().removeAllRanges()
        return
      }

      range.extractContents()
      range.insertNode(fragment)
      window.getSelection().removeAllRanges()
      this.normalize()
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
}

function is_highlighted_node(node) {
  if (node.nodeType == 1) {
    return node.classList.contains('is-highlighted')
  }
  return false
}

function is_text_node(node) {
  return node.nodeType == Node.TEXT_NODE
}

function wrap_with_line (node) {
  let div = document.createElement("div")
  div.classList.add('is-line')
  div.appendChild(node)
  return div  
}

function is_line(node) {
  if (node.nodeType == Node.ELEMENT_NODE) {
    return node.classList.contains('is-line')
  }

  return false
}

function allowed_node(node) {
  return is_text_node(node) ||
        node.nodeName == 'B' ||
        node.nodeName == 'BR' ||
        is_highlighted_node(node)
}

// Thanks: https://plainjs.com/javascript/manipulation/unwrap-a-dom-element-35/
function unwrap(el) {
  var parent = el.parentNode;
  while (el.firstChild) parent.insertBefore(el.firstChild, el);
  parent.removeChild(el);
}

function normalize_highlight_element(node){
  if (node.innerText.length == 0) {
    node.remove()
    return
  }

  if (node.dataset.class == 'highlighted--empty') {
    unwrap(node)
  }

  if (node.childNodes.length > 1 || (node.childNodes.length == 1 && node.childNodes[0].nodeType !== Node.TEXT_NODE)) {
    debugger
    node.innerText = node.innerText
  }
}

function normalize_line(node) {
  // If empty line
  if (node.textContent.length == 0 && node.childElementCount == 0) {
    node.remove()
  }

  node.childNodes.forEach(subnode => {
    if (! allowed_node(subnode)) {
      node.replaceChild(new Text(subnode.textContent), subnode)
    }
    
    if (is_highlighted_node(subnode)) {
      normalize_highlight_element(subnode)
    }

    // Merge elements if they are the same.
    let has_next_sibling = !!subnode.nextSibling
    if (has_next_sibling && is_highlighted_node(subnode) && is_highlighted_node(subnode.nextSibling)) {
      if (subnode.dataset.class == subnode.nextSibling.dataset.class) {
        subnode.innerText = subnode.innerText + subnode.nextSibling.innerText
        subnode.nextSibling.remove()
      }
    }
  })
}

function find_parent_line(range, node) {
  for (; node ; node = node.parentElement) {
    if (is_line(node)) 
      return node
  }
}

export default Highlighter