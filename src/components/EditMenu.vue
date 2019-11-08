<template>
	<div class="c-edit-menu">
	  <button 
      class="action" 
      @click.stop="strikethrough"  
      v-html="strikethrough_icon"></button>
      
	  <button 
      class="action" 
      @click.stop="highlight" 
      v-html="highlight_icon"></button>
	  
    <button 
      class="action" 
      @click.stop="bold" 
      v-html="bold_icon"></button>
  </div>
</template>

<script>

import {
  highlight,
  strikethrough,
  bold,
} from '../svg'

import { HIGHLIGHT_COLORS } from '../constants'

export default {

  name: 'EditMenu',

  props: {
    options: {
      type: Object,
      default: {},
      required: true
    },
    
    show: {
      type: Boolean,
      default: false
    },
  },  

  computed: {
    bold_icon () { 
      return bold() 
    },
  
    strikethrough_icon () { 
      return strikethrough() 
    },
    
    highlight_icon () { 
      let color = HIGHLIGHT_COLORS[this.options.highlight_color_index].display_color
      return highlight(color) 
    },
  },

  methods: {
    bold () { this.$emit("bold") },

    highlight () { this.$emit("highlight") },

    strikethrough () { this.$emit("strikethrough") },
  },

  mounted() {
    
    const escape_handler = (e) => { 
      e.key == 'Escape' ? this.$emit('hide') : null 
    }
    
    const click_outside_handler = (e) => {
      let has_clicked_inside = e.target === this.$el || this.$el.contains(e.target)
      return has_clicked_inside ? null : this.$emit('hide')
    }
    
    document.addEventListener('keydown', escape_handler)
    document.addEventListener('click', click_outside_handler)
    
    this.$once('hook:destroy', () => {
      document.removeEventListener('keydown', escape_handler)
      document.removeEventListener('click', click_outside_handler)
    })
  }
}
</script>