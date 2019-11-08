<template>
	<main>
		<a href="https://github.com/msjaber/marked.cc" class="github-corner" aria-label="View source on GitHub"><svg width="80" height="80" viewBox="0 0 250 250" style="fill: #ffcb5b;color: rgb(255, 255, 255);z-index: 20;position: absolute;top: 8px;border: 0px;right: 0px;" aria-hidden="true"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path></svg></a>

		<header>
			<span></span>
			<span></span>
		</header>

		<div class="content">
			<div class="left animated fadeInLeft">
				<div class="l-note">
					<div class="c-note" id="c-note">
						<svg style="display: none;" class="lines" xmlns='http://www.w3.org/2000/svg' width='90' height='32'>
							<rect width='90' height='1' fill='#f1f1f1'/>
						</svg>

						<div class="c-header">
							<input
								class="c-header__title"
								id="title"
								autocomplete="off"
								maxlength="20"
								value=""
								></input>	
						</div>
						
						<div class="c-page">
							<span class="c-page__date select-none">{{date}}</span>
							<div 
								style="max-height: 400px; overflow: scroll;" 
								tabindex="0" 
								class="c-page__text" 
								contenteditable="true"
								ref="text">
							</div>
						</div>
					</div>
				</div>
			</div>

			<div class="right animated fadeInRight">
				<h1 class="title" style="font-weight: 700; font-family: 'Rubik';">
					Marked
				</h1>
				<p>
					<b>Create</b> and <b>share</b> beautiful images of your crafted notes and prose.
				</p>
				<ul class="features">
					<li class="features__highlight">
					  	<span class="features__icon" v-html="highlight_icon"></span>

					  	<span class="features__title">
					  		Highlight
					  	</span>
					</li>	
					<li class="features__strikthrough">
						<span class="features__icon" v-html="strikethrough_icon"></span>
					  	<span class="features__title">
					  		Strikethrough
					  	</span>
					</li>
					<li class="features__bold">
					  	<span class="features__icon" v-html="bold_icon"></span>
						<span class="features__title">
							Bold
						</span>
					</li>
					<li class="features__rtl">
					  	<span class="features__icon">
							<span style="font-size: 1.4rem;">ض</span>
						</span>
						<span class="features__title">
							Right to left
						</span>
					</li>
				</ul>
				<div class="buttons">
					<router-link to="/use" class="button start-using">Launch</router-link>
				</div>
			</div>
		</div>

		<div class="l-created-by" style="padding-top: 0;">
			<p class="c-created-by">Created by <a href="#"> Mohammad S. Jaber</a></p>
		</div>
	</main>
</template>

<script>

import {
	get_month_name,
	generate_strikethrough_element,
	generate_bold_element,
	generate_highlighted_element,
	svgToBase64Image,
} from '../../utils'

import {
  highlight,
  strikethrough,
  bold,
} from '../../svg'

export default {
  name: 'Landing',

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

  	highlight_icon() {
  		return highlight('orange')
  	},
  	strikethrough_icon() {
  		return strikethrough() 
  	},
  	bold_icon () { 
  	  return bold() 
  	},
  },
  data () {
    return {

    }
  },

  mounted() {
  	this.texts = [
  	// `<b>Let's excerpt</b> <br/>

  	// "<span class="highlighted--green">A coherent text is a designed object</span>: an ordered tree of sections within sections, crisscrossed by arcs that track topics, points, actors, and themes, and held together by connectors that tie one proposition to the next. 

  	// Like other designed objects, <span class="highlighted--yellow">it comes about not by accident but by drafting a blueprint,</span> <span class="highlighted--pink">attending to details,</span> <span class="highlighted--blue">and maintaining a sense of harmony and balance.</span>"`
  		`"<span data-highlighted="true" data-class="highlighted--yellow" class="is-highlighted highlighted--yellow">Now listen.</span> <span data-highlighted="true" data-class="highlighted--green" class="is-highlighted highlighted--green"></span><span data-highlighted="true" data-class="highlighted--green" class="is-highlighted highlighted--green">I vary the sentence length, and I create music.</span><span data-highlighted="true" data-class="highlighted--yellow" class="is-highlighted highlighted--yellow"></span> <span data-highlighted="true" data-class="highlighted--blue" class="is-highlighted highlighted--blue">Music.</span> <span data-highlighted="true" data-class="highlighted--yellow" class="is-highlighted highlighted--yellow">The writing sings.</span> <span data-highlighted="true" data-class="highlighted--yellow" class="is-highlighted highlighted--blue">It has a pleasant rhythm, a lilt, a harmony.</span> <span data-highlighted="true" data-class="highlighted--pink" class="is-highlighted highlighted--pink">I use short sentences.</span> <span data-highlighted="true" data-class="highlighted--yellow" class="is-highlighted highlighted--yellow">And I use sentences of medium length.</span> <b>And sometimes, when I am certain the reader is rested, I will engage him with a sentence of considerable length, a sentence that burns with energy and builds with all the impetus of a crescendo, the roll of the drums, the crash of the cymbals–sounds that say listen to this, it is important.</b>" </br> </br> - Gary Provost`
  	]

  	this.$refs.text.innerHTML = this.texts[0]

  }
}

</script>

<style lang="css">

* {
	padding: 0;
	margin: 0;
}
body {
	background-color: #FFFDF7;
	font-family: Helvetica;
}
header > span {
	width: 100%;
	position: fixed;
	top: 0px;
	height: 8px;
	background-color: #FFB100;
}
header > span:first-child {
	z-index: 11;
	opacity: 0.5;
}

header > span:last-child {
	height: 14px;
	z-index: 10;
	opacity: 0.3;
}

.content {
	display: flex;
	margin: 0 auto;
	max-width: 1300px;
	height: calc(100vh - 40px);
	display: flex;
	justify-content: center;
	align-items: center;

}
.content > div {
	width: 100%;
	height: 100%;
	display: flex;
	justify-content: center;
	align-items: center;
}
.content .right {
	flex-direction: column;
	padding: 2rem 1rem;
	/*max-width: 500px;*/
}
.content {
	font-family: 'Varela Round', 'Helvetica', sans-serif;
}

.content .right p {
	width: 100%;
	font-size: 1.5rem;
	line-height: 2rem;
	color: #333;

	/*padding-bottom: 2rem;*/
}
/*.content .left > div {*/
    /*padding-right: 6rem;*/
/*}*/

.l-note {
	/*min-width: 400px;*/
	width: 80%;
	min-width: 300px;
	max-width: 400px;
}

.buttons {
	display: flex;
	width: 100%;
	margin-top: 6rem;
}

.button {
    padding: 0.6rem 1.8rem;
    background: #ffb819;
    outline: none;
    border: none;
    /*box-shadow: 0 -1px 10px rgba(0,0,0,.05), 0 1px 4px rgba(0,0,0,.1), 0 10px 30px #eaeaea;*/
    box-shadow: 0px 1px 3px rgba(0,0,0,0.15);
    font-family: 'Rubik', sans-serif;
    border-radius: 4px;
    font-size: 1.2rem;
    line-height: 1.5rem;
    color: white;
    cursor: pointer;
    text-decoration: none;
    text-align: center;
}
.button:focus {
	outline: 2px dotted black;
}
footer {
	display: flex;
	justify-content: center;
	align-items: center;
	min-height: 40px;
}
.title {
	width: 100%;
	text-align: left;
	padding-bottom: 2rem;
	font-size: 3rem;
	font-weight: 400;
}
.created-by {
	padding: 0.2rem 0.8rem;
	background: #ff8c8c5c;
	color: #333;
}

.features {
	display: flex;
	justify-content: space-between;
	flex-wrap: wrap;
	width: 100%;
	list-style: none;
	padding: 2rem 0 3rem 0;
}
.features li {
	margin-top: 1rem;
	display: flex;
	flex-direction: column;
	align-items: center;
	font-weight: bold;
	flex-wrap: wrap;

}

.features li:not(:last-child) {
	margin-right: 1rem;
}

.features__icon {
	width: 80px;
	height: 80px;
	display: flex;
	justify-content: center;
	align-items: center;
	background: hsl(45, 100%, 91%);
	border-radius: 23%;
}

.features__title {
	width: 100%;
	text-align: center;
	margin-top: 1rem;
	color: #333;
}

.highlighted--yellow {
	background: hsla(45, 100%, 73%, 0.7);
}

.highlighted--blue {
	background: hsla(200, 100%, 50%, 0.36);
}

.highlighted--green {
	background: hsla(120, 81%, 47%, 0.45);
}

.highlighted--pink {
	background: hsla(324, 80%, 69%, 0.5);
}

.highlighted--empty {
	background: white;
}

.bold {
	font-weight: 900;
}

@media(max-width: 1200px) {
	.content {
    	flex-direction: column-reverse;
		height: 100%;
	}
	.content .left {
		padding-top: 1rem;
		padding-bottom: 8rem;
	}
	.content .left > div {
		padding-top: 1rem;
		padding-right: 0;
		margin: 0 auto;
	}
	.content .right {
		padding-top: 3rem;
		width: 85%;
		max-width: 600px;
		text-align: center;
		border-bottom: 1px solid rgba(0,0,0,0.1)
	}

	.buttons {
		justify-content: center;
	}
	
	.title {
		font-size: 2.8rem;
		text-align: center;
	}

	.content .right p {
		font-size: 1.2rem;
	}

	.features {
		/*justify-content: flex-start;*/
	}

	.features li{
		width: 33%;
	}

	.features__icon {
		width: 70px;
		height: 70px;
	}
	.features li:not(:last-child){
		margin-right: 0;
	}
	.features__title {
		font-size: 0.8rem;
	}
}

@media(max-width: 600px) {
	.title {
		font-size: 1.8rem;
		text-align: center;
	}
}

.github-corner:hover .octo-arm{animation:octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%,100%{transform:rotate(0)}20%,60%{transform:rotate(-25deg)}40%,80%{transform:rotate(10deg)}}@media (max-width:500px){.github-corner:hover .octo-arm{animation:none}.github-corner .octo-arm{animation:octocat-wave 560ms ease-in-out}}

</style>