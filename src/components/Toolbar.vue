<template>
	<div class="c-toolbar" ref="toolbar">
		<ul class="c-toolbar-items select-none">
			<li class="c-toolbar__item">
				<button @click="$emit('serif')">
					<span class="c-toolbar__item--icon select-none">
						<svg 
							xmlns="http://www.w3.org/2000/svg" 
							width="24" 
							height="24" 
							viewBox="0 0 23 23" fill="none"
							style="font-family: serif; font-size:1.6rem; fill:currentColor;" 
							stroke-width="1" 
							stroke="currentColor"
							:style="{'font-family': options.font == 'serif' ? 'Helvetica' : 'serif'}">
							<text stroke-width="1" x="4" y="20">S</text>
						</svg>
					</span>
				</button>
			</li>
			<li class="c-toolbar__item spacer--right">
				<button @click="$emit('justify')">
					<span class="c-toolbar__item--icon">

					<svg v-if="options.text_align == 'left'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-align-left"><line x1="17" y1="10" x2="3" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="17" y1="18" x2="3" y2="18"></line></svg>

					<svg v-else="options.text_align == 'right'" xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-align-right"><line x1="21" y1="10" x2="7" y2="10"></line><line x1="21" y1="6" x2="3" y2="6"></line><line x1="21" y1="14" x2="3" y2="14"></line><line x1="21" y1="18" x2="7" y2="18"></line></svg>

					</span>
				</button>
			</li>

			<li class="c-toolbar__item">
				<button @click="$emit('strikethrough')">
					<span class="c-toolbar__item--icon" v-html="strikethrough_icon">
					</span>
				</button>
			</li>

			<li class="c-toolbar__item spacer--right">
				<button @click="$emit('bold')">
					<span class="c-toolbar__item--icon" v-html="bold_icon">
					</span>
				</button>
			</li>

			<li class="c-toolbar__item">
				<button @click="$emit('highlight', colors[options.highlight_color_index].highlight_color)">
					<span class="c-toolbar__item--icon" v-html="highlight_icon"></span>
				</button>
			</li>

			<li class="c-toolbar__item c-toolbar__item--highlight-color">
				<button @click.stop="toggle_palette">
					<span class="c-toolbar__item--icon higlight-color-icon">
						<span :style="{'background-color': colors[options.highlight_color_index].display_color}"></span>
					</span>
				</button>

				<transition name="fade">
					<ul ref="palette" class="c-colors-palette" v-show="palette_is_open">
						<li v-for="(color, index) in colors" 
							:key="index" 
							:style="{'background-color': color.display_color}"
							@click="select_highlight_color(index)"></li>
					</ul>
				</transition>
			</li>
			
			<li class="c-toolbar__item spacer--left spacer--right only-desktop">
				<button @click="$emit('toggle_size')">
					<span class="c-toolbar__item--icon">	
						<svg width="42px" height="42px" viewBox="-4 -1 48 42" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
						    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
						        <g id="Desktop-HD-Copy-2" transform="translate(-535.000000, -93.000000)">
						            <g id="icons8-add-white-space-(2)" transform="translate(535.000000, 93.000000)">
						                <path d="M1,0 L1,42 M37,21 L5,21 M41,42 L41,0 M31,28 L38,21 L31,14 M11,14 L4,21 L11,28" id="Shape" stroke="currentColor" stroke-width="4" stroke-linecap="round"></path>
						                <rect v-if="options.size >= 400" id="Rectangle" fill="currentColor" fill-rule="nonzero" x="6.5" y="36" width="6" height="6" rx="3"></rect>
						                <rect v-if="options.size >= 600" id="Rectangle" fill="currentColor" fill-rule="nonzero" x="18" y="36" width="6" height="6" rx="3"></rect>
						                <rect v-if="options.size >= 900" id="Rectangle" fill="currentColor" fill-rule="nonzero" x="29.5" y="36" width="6" height="6" rx="3"></rect>
						            </g>
						        </g>
						    </g>
						</svg>
					</span>
				</button>
			</li>

			<!-- <li class="c-toolbar__item c-toolbar__item--window-size only-mobile">
				<button class="flex-center" @click.stop="toggle_window_size" style="min-width: 112px; text-align: left;font-size: small; width: 100px; color: hsl(200, 25%, 40%);">
					Window Size
					<svg style="padding-left: 3px;" width="8px" height="6px" viewBox="0 0 6 3" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
					    <g id="Page-1" stroke="none" stroke-width="1" fill="none" fill-rule="evenodd">
					        <g id="A4-Copy" transform="translate(-288.000000, -447.000000)" fill="hsl(200, 25%, 40%)">
					            <polygon id="ion-android-arrow-dropdown---Ionicons" points="288 447 294 447 291 450"></polygon>
					        </g>
					    </g>
					</svg>
				</button>

				<transition name="fade">
					<ul ref="window_size" class="c-window-size" v-show="window_size_is_open">
						<li class="c-toolbar__item c-toolbar__item--slider  spacer--right">
							<div>
								<label style="text-align: left;font-size: small; color: #888;">Horizantal Padding</label>
								<input class="c-range-slider"  value="5" type="range" min="5" max="15" step="1" @input="$emit('padding_x_callback', $event)">
							</div>
						</li>
						<li class="c-toolbar__item c-toolbar__item--slider">
							<div>
								<label style="text-align: left;font-size: small; color: #888;">Vertical Padding</label>
								<input class="c-range-slider" value="5" type="range" min="5" max="15" step="1" @input="$emit('padding_y_callback', $event)">
							</div>
						</li>
					</ul>
				</transition>
			</li> -->

			<li class="c-toolbar__item c-toolbar__item--slider only-desktop">
				<div>
					<input class="c-range-slider"  value="5" type="range" min="5" max="15" step="1" @input="$emit('padding_x_callback', $event)">
				</div>
			</li>
			<li class="c-toolbar__item c-toolbar__item--slider spacer--right only-desktop">
				<div>
					<input class="c-range-slider" value="5" type="range" min="5" max="15" step="1" @input="$emit('padding_y_callback', $event)">
				</div>
			</li>
		</ul>

		<!-- <ul class="c-toolbar-items">
			<li class="c-toolbar__item">
				<button @click="$emit('export')">
					<span v-if="is_downloading" class="c-toolbar__item--icon">
						<div>
							<div class="loader"></div>
						</div>
					</span>

					<span v-else class="c-toolbar__item--icon">
						<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-download"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path><polyline points="7 10 12 15 17 10"></polyline><line x1="12" y1="15" x2="12" y2="3"></line></svg>
					</span>
				</button>
			</li>
		</ul> -->
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

  name: 'Toolbar',

  props: ['options', 'is_downloading'],

  computed: {
    bold_icon () { return bold() },
    
    colors() { return HIGHLIGHT_COLORS },

    strikethrough_icon () { return strikethrough() },

    highlight_icon () { return highlight(this.colors[this.options.highlight_color_index].display_color) }
  },	

  methods: {
    select_highlight_color(index) {
    	this.palette_is_open = false
    	this.$emit('select_highlight_color', index)
    },
    toggle_palette() {
		this.palette_is_open = !this.palette_is_open
    	// this.window_size_is_open = false
    },
    // toggle_window_size() {
    	// this.window_size_is_open = !this.window_size_is_open
		// this.palette_is_open = false
    // }
  },

  data () {
    return {
		palette_is_open: false,
		// window_size_is_open: false
    }
  },
  
  mounted() {
    const clicked_outside_colors_palette = (e) => {
      let has_clicked_inside = e.target === this.$el || this.$refs.palette.contains(e.target)
      return has_clicked_inside ? null : this.palette_is_open = false
    }
    // const clicked_outside_window_size= (e) => {
    //   let has_clicked_inside = e.target === this.$el || this.$refs.window_size.contains(e.target)
    //   return has_clicked_inside ? null : this.window_size_is_open = false
    // }
     
    document.addEventListener('click', clicked_outside_colors_palette)
    // document.addEventListener('click', clicked_outside_window_size)
    
    this.$once('hook:destroy', () => {
      document.removeEventListener('click', clicked_outside_colors_palette)
      // document.removeEventListener('click', clicked_outside_window_size)
    })
  }
}
</script>