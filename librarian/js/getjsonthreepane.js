var xmlhttp;
var topicDocs = new Array();
var mydoc;
var mydocurl;
var publishdoc;

function loadXMLDoc(url)
{
	"use strict";
	if (window.XMLHttpRequest) 	{
		xmlhttp=new XMLHttpRequest();
	}	else	{
		xmlhttp=new ActiveXObject("Microsoft.XMLHTTP");
	}
	
	xmlhttp.onreadystatechange	= function() {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200 || xmlhttp.status === 304) {
				;
			} else {
				alert("Invalid request,\n status: " + xmlhttp.status + ", \n status message: " + xmlhttp.statusText + ", \ndata path: " + url);
				return false;
			}
		}
	};
	xmlhttp.open("GET", url, false);
	xmlhttp.setRequestHeader("Content-Type", "text/json");
		// "application/x-www-form-urlencoded");
	xmlhttp.send(null);
	var response = xmlhttp.responseText;
	return response; // xhttp.responseText;
}

// get topic list for first pane
function getTopics(data) {
	var xmlDoc	= loadXMLDoc(data);			
	var t = JSON.parse(xmlDoc); //eval ("(" + xmlDoc + ")");
	var topicUrl 	= t.thisURL;
	var topicPath	= topicUrl.substr(0, topicUrl.lastIndexOf("\/") + 1);			
	
	tt = t["topics"];			
	var topicId;
	var topicSelect;
	var conceptsUrl;
	var topicName;
	var topicDocCnt;
	var conceptInfo;
	var classname;
	var result = '<a href="#" class="edit"><img src="images/editOn.png" /> Edit</a><button type="submit" name="publish" id="publishdoc" value="Publish">Publish</button><br /><br /><ul class="topic">';

	for (var i = 0, ii = tt.length; i < ii; i++)
	{ 
		topicId		= tt[i].id;
		topicSelect	= tt[i].selected; 
		topicName	= tt[i].name;
		conceptsUrl	= tt[i].conceptsURL;
		topicDocCnt = tt[i].numDocuments;
		classname	= getSelect(topicSelect);	
	
		result += "<li class='topiclist " + classname + "'>";				
		result += "<a href=\"javascript:getTopicDocumentList('" + conceptsUrl +"');\"> ";					
		result += topicName; 
	
		conceptInfo = getConcepts(conceptsUrl);
		result += "</a><span class='amount'> (" + topicDocCnt + ")</span>" + conceptInfo + "</li>";
	
	} 
	result += "</ul>";		
	document.getElementById("topic").innerHTML	= result;		
}

// Get topic concept list	for first pane	
function getConcepts(data) {		
	var xmlDoc=loadXMLDoc(data);
	var c = JSON.parse(xmlDoc); //eval ("(" + xmlDoc + ")");
	var conceptUrl 	= c.thisURL;
	var conceptPath	= conceptUrl.substr(0, conceptUrl.lastIndexOf("\/") + 1);
	var topicId	= c.topic.id;
		
	cc = c["concepts"];
	var conceptId;
	var conceptSelect;
	var conceptName;
	var conceptDocCnt;
	var classname;
	var conceptresult = "<ul class='concept'>";
	
	for (var j=0, jj = cc.length; j < jj; j++)
	{ 
		conceptId = cc[j].id;
		conceptSelect = cc[j].selected;
		conceptName = cc[j].name;
		conceptDocCnt = cc[j].numDocuments;
		documentsUrl  = cc[j].documentsURL;
		conceptresult += "<li class='" + classname + "'>";				
		conceptresult += "<a href=\"javascript:getConceptDocumentList('" + documentsUrl + "');\"> "; 
					  
		conceptresult += conceptName; 
		conceptresult += "</a><span class='amount'> (" + conceptDocCnt + ")</li>";
	}
	conceptresult += "</ul>";	
		
	return conceptresult;
}

// Get concept document list	
function getConceptDocumentList(data) {		
	var xmlDoc=loadXMLDoc(data);
	var d = JSON.parse(xmlDoc); 
	var docUrl 	= d.thisURL;
	var docPath	= docUrl.substr(0, docUrl.lastIndexOf("\/") + 1);
//	alert("getConceptDocumentList \n docUrl: " + docUrl + "\n docPath: " + docPath);
	var topicId		= d.topic.id;	
	var topicName	= d.topic.name;
	var conceptId	= d.concept.id;
	var conceptName	= d.concept.name;
	
	dd	= d["documents"];
	var docId;
	var docTitle;
	var docresult = "<ul class='doclist'><p>" + conceptName + "</p>";

	for (var k=0, kk = dd.length; k < kk; k++)
	{ 
		docId = dd[k].id;
		docTitle = dd[k].title.text;
		if (!docTitle)
			docTitle = dd[k].title;
		documentUrl	= dd[k].documentURL;
				
		docresult += "<li>";				
		docresult += "<a href=\"javascript:getDocument('" + documentUrl + "');\"> "; 	// rest/document/" + docId			  
		docresult += docTitle;  
		docresult += "</a></li>";
	}
	docresult += "</ul>";		
	document.getElementById("documentlist").innerHTML	= docresult;		
}
	
// Get topic document list
function getTopicDocumentList(data) {		
	var xmlDoc	= loadXMLDoc(data);
	var td		= JSON.parse(xmlDoc); 
	var docUrl 	= td.thisURL;
	var docPath	= docUrl.substr(0, docUrl.lastIndexOf("\/") + 1);
	var topicId		= td.topic.id;	
	var topicName	= td.topic.name;
//	alert("getTopicDocumentList \n docUrl: " + docUrl + "\n docPath: " + docPath);			
	tdl	= td["concepts"];
	var docresult 	= "<p>" + topicName + "</p><ul class='doclist'>";
	var result	= "";
	for (var m = 0, mm = tdl.length; m < mm; m++)
	{ 
		var docsUrl	 = tdl[m].documentsURL;
		var topicDList	= getDocList(docsUrl, result);
		docresult += topicDList;			
	}
	docresult += "</ul>";		
	document.getElementById("documentlist").innerHTML	= docresult;		
}

// Get concept document list for topic document list
function getDocList(data, result) {		
	var xmlDoc=loadXMLDoc(data);
	var d = JSON.parse(xmlDoc); 
			
	dl	= d["documents"];
	var docId;
	var docTitle;
	
	for (var k=0, kk = dl.length; k < kk; k++)
	{ 
		docId = dl[k].id;
		docTitle = dl[k].title.text;
		if (!docTitle)
			docTitle = dl[k].title;
		var docUrl 	= dl[k].documentURL;
		result += "<li>";				
		result += "<a href=\"javascript:getDocument('" + docUrl + "');\"> "; 				  
		result += docTitle; 
		result += "</a></li>";
	}

	return result;
}

// Get document data for third pane
function getDocument(data) {
	var xmlDoc	= loadXMLDoc(data);	
	var d		= JSON.parse(xmlDoc); 	
	var docUrl 	= d.thisURL;
	var docPath	= docUrl.substr(0, docUrl.lastIndexOf("\/") + 1);
	mydoc		= JSON.stringify(d);
	mydocurl	= docUrl;
	
	var docUrl			= d.thisURL;
	var topicId			= d.topic.id;	
	var topicName		= d.topic.name;
	var topicSelect		= d.topic.selected;
	var conceptId		= d.concept.id;
	var conceptName		= d.concept.name;
	var conceptSelect	= d.concept.selected;
	var docId			= d.document.id;
	var docTitleSelect	= d.document.title.selected;
	var docTitle		= d.document.title.text;
	var docSumarySelect	= d.document.summary.selected;
	var docSummary		= d.document.summary.text;
	var docBodyUrl		= d.document.bodyURL;
	var docSelect		= d.document.selected;
	var docTagSelect;
	var docNbrSelect;
	var classname;
	publishdoc = "rest/publish/" + docId;
//	alert("publishdoc: " + publishdoc);
	
	var result 	= '<a href="#" class="edit"><img src="images/editOn.png" /> Edit</a><button type="submit" name="publish" id="publishtop" value="Publish" onclick="publishing(publishdoc)">Publish</button><br />';
	
	classname	= getSelect(topicSelect);
	
	result 	+= "<div id='article'><h2>Topic</h2><h3 class='" + classname + "'>Topic name: ";	
	result += topicName + "</h3>";
	classname	= getSelect(conceptSelect);
	result += "<h3 class='" + classname + "'>Concept name: " + conceptName + "</h3>";
	classname	= getSelect(docSelect);
	result += "<h4 class='" + classname + "'>";
	result += docTitle;
	result += "</h4>";
	result += "<form name='form01' method='GET' action='#'>";
	classname	= getSelect(docSumarySelect);
	result += "<label for='summary'>Summary (Description)</label><p class='" + classname +"'>"; // <textarea rows='5' cols='45' name='summary' id='summary'>";	
	result += docSummary;
	result += "</p>"; //</textarea><br />";
	
	var dd	= d["document"];
	dt	= dd["tags"];
	result	+= "<label for='tags'>Document Tags</label>"; // <textarea rows='5' cols='45' name='tags' id='tags'>";

	for (var l=0, ll = dt.length; l < ll; l++)
	{ 	
		docTagSelect = dt[l].selected;
		classname	= getSelect(docTagSelect);
		result 	+= "<p class='" + classname +"'>";
		result  += dt[l].name;
		result  += "</p>";
	}
	var docBody	= getDocumentBody(docBodyUrl);
				
	result += "</textarea><br />";
	
	// get neighbors information
	cnt = 1;
	result += "<label for='like'>If you like this, see also </label>";			
	
	var nl = dd["neighbors"];
	var neighbor = "";
	for (var m = 0, mm = nl.length; m < mm; m++) {
		docNbrSelect = nl[m].selected;
		classname	= getSelect(docNbrSelect);
		result 	+= "<p class='" + classname +"'>";
		result += nl[m].id + "</p>"; // <a href='" + nl[m].documentURL + "'> " + nl[m].documentURL + "</a>";

		cnt++;
	}

	result += "<h4>Document: </h4>";			
	result += "<p>" + docBody + "</p>";	
	result += "</form></div>";	

	document.getElementById("document").innerHTML	= result;		
}

// Get document body information
function getDocumentBody(data) {
	var xmlDoc=loadXMLDoc(data);
	var b = JSON.parse(xmlDoc); 
	var docBodyUrl 	= b.thisURL;			
	var docBody 	= b.document.body;
	return docBody;
}

// check selected status
function getSelect(info) {
	var className;
//	alert("info: " + info);
	if (info)
		className = "selected";
	else
		className = "unselected";
		
	return className;	
}

// put publish
function publishing (url) {
	
	var xmlhttp = new XMLHttpRequest();
	xmlhttp.onreadystatechange	= function() {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200 || xmlhttp.status === 304) {
				;
			} else {
				alert("Invalid request,\n status: " + xmlhttp.status + ", \n status message: " + xmlhttp.statusText + ", \ndata path: " + url);
				return false;
			}
		}
	};
	xmlhttp.open("PUT", url, false);	
	xmlhttp.send(null);
	var result	= xmlhttp.responseText;
	alert("publish result: " + result);
//	return result;
}
// put JSON
function putJson (data, url) {
	var xmlhttp	= new XMLHttpRequest();
	xmlhttp.onreadystatechange	= function() {
		if (xmlhttp.readyState === 4) {
			if (xmlhttp.status === 200 || xmlhttp.status === 304) {
				;
			} else {
				alert("Invalid request,\n status: " + xmlhttp.status + ", \n status message: " + xmlhttp.statusText + ", \ndata path: " + url);
				return false;
			}
		}
	};
	xmlhttp.open("PUT", url, false);	
	xmlhttp.send(JSON.stringify(data));
	var result	= xmlhttp.responseText;
	alert("PUT result: " + result);
	return result;
}