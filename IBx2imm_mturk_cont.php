<!DOCTYPE html>
<html>
	<head>
		<title>Mechanical Turk HIT</title>	
		<!-- Load External js scripts -->
	    <script type="text/javascript" src="http://mbostock.github.com/d3/d3.js?1.29.1"></script>
		<script type='text/javascript' src='http://ajax.googleapis.com/ajax/libs/jquery/1.4.0/jquery.js'></script>
		
		<!-- CSS styling goes in a separate document -->
		<link href="IBx2_mturk.css" rel="stylesheet" type="text/css">
	
	</head>
<body>
	
	


		
<!-- Any HTML formatting goes here -->
<p id="trialType" class='updatable'>blank</p>
<p id="totalTime" class='updatable'>Tes1t</p>
<p id="bounces" class='updatable'><font color='yellow'>Test</font></p>
<p id="distpath" class='updatable'><font color='yellow'>T</p>
<p id="test" class='updatable'>Test</p>
	
<p id="test" class='updatable'>Test</p>
<p id="dummy" class='updatable'></p>


<div id='Resp' align="center">
<form name="signup" id="signup" method="post" autocomplete="off" action='/~emily/IBx2_mturk/IBx2imm_mturk_cont.php' align="center">	
	<p id='typeResp'>Number of times crossed?</p>
	
	<input type='hidden' name='stage' value='2'/>
	<input type='hidden' name='date' id="date"/>
		
	<!-- These responses are collected from the landing screen and don't change over the hit  -->
	<input type='hidden' name='workerID' id="workerID" value=''/>
	<input type='hidden' name='assignmentID' id="assignmentID" value=''/>
	<input type='hidden' name='hitID' id="hitID" value=''/>
	<input type='hidden' name='jsTest' id="jsTest" value=''/>
	
	<!-- These variables are collected for each trial (demarcated with time0, time1 etc..) -->
	<input type='hidden' name='tottime1' id="tottime"/>
	<input type='hidden' name='tottime' id="tottime"/>
	<input type='hidden' name='time1' id="time"/>
	<input type='hidden' name='trialType1' id="trialType" value='blank'/>
	<input type='hidden' name='totbounce1' id="totbounce"/>
	<input type='hidden' name='totbounce' id="totbounce"/>
	<input type='hidden' name='fullPath1' id="fullPath"/>
	
	
	
	<!-- This is the subject's response collected foreach trial (demarcated with respInut0, time1 etc..) -->
	<input type="text" name="respInput1" id="respInput" tabindex="2" maxlength='3'/>	
	
</form>
</div>

<p id="svgHere"></p>

<!-- Main js script goes in a separate document -->
<script type='text/javascript' src='IBx2imm_mturk_cont.js'></script>



<script type="text/javascript">
// For some reason firefox doesn't read display from the CSS so I ghave to change it here. 
d3.selectAll(".updatable")
	.style("display","none");
</script>

</body>
</html>
