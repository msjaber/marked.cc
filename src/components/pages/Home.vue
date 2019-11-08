<template>
  <div>
  	<header>
  		<span></span>
  		<span></span>
  	</header>
    <Workspace/>
    <!-- <Expandable/> -->
  </div>
</template>

<script>
import Workspace from '../Workspace'

export default {
  name: 'Home',
  components: {
    Workspace
  }
}
</script>


<style scoped>
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

</style>
