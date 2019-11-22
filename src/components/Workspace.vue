<template>
	<div class="l-workspace">
		<div class="l-toolbar animated fadeInDown">
			<toolbar 
				:options="options"
				:is_downloading='state.is_downloading'

				@serif="toggle_serif"
				@justify="toggle_justify"

				@highlight="highlight"
				@strikethrough="strikethrough"
				@bold="bold"
				@export="export_image"
				@select_highlight_color="select_highlight_color"
				@toggle_size="toggle_size"	
				
				@padding_x_callback="padding_x_callback"
				@padding_y_callback="padding_y_callback">
			</toolbar>
		</div>

		<div class="l-editor animated fadeInUp" ref="editor">			
            <transition name="edit-menu-fade">
				<div v-if="state.edit_menu_is_open"
					class="l-edit-menu" 
					:style="{
	                      top: `${edit_menu_top}px`,
	                      left: `${edit_menu_left}px`
	                  	}">
						<edit-menu
							:options="options"
							@hide="state.edit_menu_is_open = false"
							@strikethrough="strikethrough" 
							@highlight="highlight" 
							@bold="bold">
						</edit-menu>
				</div>
			</transition>

			<div id="l-exportable" class="l-exportable" @mouseup="mouseup_callback">
				<div class="l-border">
					<div 
						:style="{
							'background-color': background_color,
							'padding-left': `${options.padding_x}rem`,
							'padding-right': `${options.padding_x}rem`,
							'padding-top': `${options.padding_y}rem`,
							'padding-bottom': `${options.padding_y}rem`
						}"
						class="c-exportable"
						id="c-exportable">
						<note ref="note" 
							:options="options"
							@mouseup_callback="mouseup_callback"
							@show_edit_menu="state.edit_menu_is_open = true"
							@hide_edit_menu="state.edit_menu_is_open = false"
						></note>
					</div>
				</div>
			</div>

			<div class="l-export-button animated fadeInUp">
				<button class="c-export-button" @click="export_image"> 
					<span v-if="state.is_downloading" class="c-toolbar__item--icon">
						<div>
							<div class="loader"></div>
						</div>
					</span>

					<svg v-else xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 -2 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
				</button>
			</div>
		</div>

		<div class="l-footer">
			<p class="c-links select-none">
				<a href="https://github.com/msjaber/marked.cc">Github</a>
			</p>
			
			<p class="c-created-by select-none">Created by <a href="https://msjaber.com"> Mohammad S. Jaber</a></p>
		</div>
	</div>
</template>
<script>

// 
// Gold is everywhere... but not everyone can see it.
// 

import domtoimage from 'dom-to-image'
import EditMenu from './EditMenu'
import Toolbar from './Toolbar'
import Note from './Note'

import {
	get_month_name,
	generate_strikethrough_element,
	generate_bold_element,
	generate_highlighted_element,
} from '../utils'

import {
  highlight,
  strikethrough,
  bold,
} from '../svg'

import {
	HIGHLIGHT_COLORS, 
	FONTS,
	ALIGNS,
	SIZES,
	DEFAULT_OPTIONS,

} from '../constants'

export default {
	components: {
		EditMenu,
		Toolbar,
		Note
	},

	data() {
		return {
			options: {
				size: DEFAULT_OPTIONS.size,
				text_align: DEFAULT_OPTIONS.text_align,
				font: DEFAULT_OPTIONS.font,
				padding_x: 5,
				padding_y: 5,
				highlight_color_index: 0,
			},
			
			state: {
				is_downloading: false,
				edit_menu_is_open: false,
			},

			background_color: '#FFFDF7',
			selected_text_rect: null,
		}
	},

	computed: {
		colors() {
			return HIGHLIGHT_COLORS
		},

		edit_menu_top() {
			if (this.selected_text_rect == null)
				return 0
			
			return this.selected_text_rect.top - this.$refs.editor.offsetTop + 50
		},

		edit_menu_left() {
			if (this.selected_text_rect == null)
				return 0
			
			return this.selected_text_rect.left - this.$refs.editor.offsetLeft
		},
	},

	watch: {
		title: (new_title, old_title) => {
			if (new_title.length > 20)
				return old_title

			return new_title
		}
	},

	methods: {		
		mouseup_callback() {
			let selection = null
			
			if (window.getSelection) {
				selection = window.getSelection()
			} else if (document.selection) {
				selection = document.selection.createRange()
			}
			
			// The timtout is used in case the mouseup event occured on selected text.
			// Where the mouseup event will be fired before the selected text gets unselected.
			// Which causes the condition any_selected_text to be true.
			setTimeout(() => {
	    		let any_selected_text = selection.toString().length > 0
	    		if (any_selected_text) {
	    			this.selected_text_rect = window.getSelection().getRangeAt(0).getBoundingClientRect()
	    			this.state.edit_menu_is_open = true
	    		} else {
	    			this.state.edit_menu_is_open = false
	    		}
    		}, 0)
		},

		toggle_size() {
			let next_index = (SIZES.indexOf(this.options.size) + 1) % SIZES.length
			this.options.size = SIZES[next_index]
			document.getElementById('c-exportable').style.width = `${this.options.size}px`
		},

		toggle_serif() {
			let next_index = (FONTS.indexOf(this.options.font) + 1) % FONTS.length
			this.$set(this.options, 'font', FONTS[next_index])
		},

		toggle_justify() {
			let next_index = (ALIGNS.indexOf(this.options.text_align) + 1) % ALIGNS.length
			this.$set(this.options, 'text_align', ALIGNS[next_index])
		},

		highlight() {
			this.$refs.note.highlight()
		},

		strikethrough() {
			this.$refs.note.strikethrough()
		},
		
		bold() {
			this.$refs.note.bold()
		},

		padding_x_callback(e) {
			this.options.padding_x = e.target.value
		},
		
		padding_y_callback(e) {
			this.options.padding_y = e.target.value
		},

		select_highlight_color(index) {
			this.options.highlight_color_index = index
		},

		export_image() {
			gtag('event', 'export', {
			  'event_category': 'User',
			  'event_label': (new Date().getTime()).toString().substr(5)
			})

			const link = document.createElement('a')
			this.state.is_downloading = true
			new Promise((resolve, reject) => {
				// An illusion that we're making huge effort to export the image. :P
				setTimeout(() => {
					this.get_image()
					.then(url => {
						link.download = `Marked-${(new Date().getTime()).toString().substr(5)}.png`
						link.href = url
						document.body.appendChild(link)
						link.click()
						link.remove()
						resolve()
					}).catch(error => {
						alert('Something went wrong')
						this.state.is_downloading = false
						console.log(error);
					})
				}, 1000)
			}).then(() => {
				this.state.is_downloading = false
			})
		},

		async get_image() {
			let node = document.getElementById('c-exportable')
			node.style.maxWidth = 'initial' // overwrite the max-width: 900px;
			const scale = 2
			const width =  node.offsetWidth * scale
			const height =  node.offsetHeight * scale
			const config = {
				width: width,
				height: height,
				style: {
					'padding': '0',
					'margin': 'auto auto',
					'display': 'flex',
					'justifyContent': 'center',
					'alignItems': 'center',
					'transform': `scale(${scale})`,
					'transform-origin': 'center'
				}
			}

			return await domtoimage.toBlob(node, config).then(blob => window.URL.createObjectURL(blob))
		},
	}
}

</script>

<style src="@/style/app.css"></style>