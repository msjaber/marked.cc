<template>
	<div class="c-note" id="c-note">
		<svg style="display: none;" class="lines" xmlns='http://www.w3.org/2000/svg' width='90' height='32'>
			<rect width='90' height='1' fill='#f1f1f1'/>
		</svg>

		<div class="c-header">
			<input
				class="c-header__title"
				id="title"
				autocomplete="off"
				maxlength="25"
				placeholder="It begins with a word"

				ref="title"
				v-model="title"
				@blur="hide_title_placeholder()"
				@keydown.enter.prevent="focus_on_text"
			></input>
		</div>
		
		<div class="c-page"
			:style="{
				'text-align': options.text_align || DEFAULT_OPTIONS.text_align,
				'direction': options.text_align == 'right' ? 'rtl' :'ltr',
				'font-family': options.font || DEFAULT_OPTIONS.font
			}"
   		>
			
			<span class="c-page__date select-none">
				{{ date }}
			</span>

			<div 
				tabindex="0"
				class="c-page__text" 
				contenteditable="true"
				ref="text"
				@paste="paste_callback"
				@input="normalize"
				@mouseup.stop="mouseup_callback"
				@keydown="$emit('hide_edit_menu')"
			>
			</div>
		</div>
	</div>
</template>

<script>


import {
	get_month_name,
	generate_strikethrough_element,
	generate_bold_element,
	generate_highlighted_element
} from '../utils'

import {
	HIGHLIGHT_COLORS, 
	FONTS,
	ALIGNS,
	DEFAULT_OPTIONS
} from '../constants'

import Highlighter from '../highlighter'

export default {
  name: 'Note',

	data () {
		return {
			title: '',
            text: '',
			selected_text_rect: null
		}
	},

	props: {
		options: {
	    	type: Object,
	    	required: true,
	    	default: {}
	  	}
	},

  computed: {
    date() {
    	let date = new Date()
    	let [month, day, year, time] = [
    		get_month_name(date.getMonth()), 
    		date.getDate(), 
    		date.getFullYear(), 
    		new Date().toLocaleTimeString()
    	]

    	time = time.slice(0, time.length - 6) + ' ' + time.slice(8) // Remove the seconds

    	return `${month} ${day}, ${year} at ${time}`
    },
    
    DEFAULT_OPTIONS() { return DEFAULT_OPTIONS },
  },

  mounted() {
  	this.highlighter = new Highlighter(this.$refs.text)
  	document.getElementById('title').focus()
  },

  methods: {
  	onFocus() { console.log('focus') },
    
    focus_on_text() { this.$refs.text.focus() },

    normalize() { this.highlighter.normalize() },

    mouseup_callback(e) { this.$emit('mouseup_callback') },

    hide_title_placeholder() { this.$refs.title.placeholder = "" },

	bold() { document.execCommand('bold') },

    strikethrough() { this.highlighter.mark('strikethrough') },

	highlight(class_name) { 
      class_name = class_name || HIGHLIGHT_COLORS[this.options.highlight_color_index].class
      this.highlighter.mark(class_name) 
    },

    paste_callback(e){
      e.preventDefault();
      var text = '';
      if (e.clipboardData || e.originalEvent.clipboardData) {
        text = (e.originalEvent || e).clipboardData.getData('text/plain');
      } else if (window.clipboardData) {
        text = window.clipboardData.getData('Text');
      }
      if (document.queryCommandSupported('insertText')) {
        document.execCommand('insertText', false, text);
      } else {
        document.execCommand('paste', false, text);
      }
    }
  }
}
</script>
