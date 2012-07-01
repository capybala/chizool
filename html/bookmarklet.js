function chizoolCapybalaComInit() {
	/**
	 * function to extract addresses is based on
	 * 'Add link to google maps japan on address-like texts' 
	 * by twk from http://nonn-et-twk.net/twk/node/51
	 */
	var NODE_TYPE = {TAG:1, TEXT:3};

	function AddressLink(node, callback) {
		if (!node) node = document.body;
		if (isNaN(arguments.callee.count)) arguments.callee.count = 0;

		var splitNodeNum = 0;
		if (node.nodeType == NODE_TYPE.TAG && node.childNodes)
		{
			var childNodes = node.childNodes;
			for (var i = 0; i < childNodes.length; ++i)
				i += arguments.callee(childNodes[i], callback);
		}
		else if (node.nodeType == NODE_TYPE.TEXT)
		{
			var text = node.data;
			var re = arguments.callee.re;
			var matched = text.match(re.general);
			if (matched)
			{
				var m = matched[0];
				var ws = m.match(re.prews);
				if (ws)
					m = ws[1];
				// remove building names since google maps rarely recognize them
				var building = m.match(re.building1);
				if (building)
					m = building[0];
				var building2 = m.match(re.building2);
				if (building2)
					m = building2[1];

				// split at first matched place
				//var matchedNode = node.splitText(text.indexOf(m));
				var matchedNode = node;
				callback(matchedNode, m);

				//++splitNodeNum;
				++arguments.callee.count;
			}
		}
		return splitNodeNum;

	} // AddressLink

	// initialize 
	(function (){
	  var WHITESPACE_ex = /[\s　:：()\[\]［］「」（）、。]/.source;
	  var NO_WHITESPACE_ex = /[^\s　:：()\[\]［］「」（）、。]/.source;

	  var TODOFUKEN_ex = /(?:東京都|北海道|(?:大阪|京都)府|(?:神奈川|和歌山|鹿児島|.{2})県)(?![\d０-９])/.source;
	  var CITY_SEPARATE_CHAR_ex = new RegExp('(?:^|' + WHITESPACE_ex + ')').source;
	  var SHICHOSON_ex = new RegExp(NO_WHITESPACE_ex + '{1,4}[郡市区]').source;
	  var AZA_ex = NO_WHITESPACE_ex + '{1,20}';
	  var BANCHI_ex = /[\d０-９]/.source + '{1,8}'; // 一二三四五六七八九十東西南北無ABC
	  var KYOTO_ex = /京都[府市][^\s]{6,20}(?:[上下][るル])?(?:(?:東入|西入)?[るル]?|入中)/.source;

	  var PRE_WHITESPACES_re = new RegExp('^' + WHITESPACE_ex + '+(.*)$');
	  var BUILDING1_re = /^[^\d０-９]+[\d０-９]+(?:(?:[-―－ー]|丁目|番地?|号)[\d０-９]+)+/;
	  var BUILDING2_re = /^(.*(?:丁目|番地?|号))[^地\d０-９]+(?:ビル|$)/;
	  AddressLink.re = {
		general: new RegExp(
			'(?:' + TODOFUKEN_ex + '|' + CITY_SEPARATE_CHAR_ex + SHICHOSON_ex + ')' + '[ \t　]*' +
			'(?:' + AZA_ex + '[ \t　]*' +
				'(?:' + BANCHI_ex + '(?:丁目|番地?|号)?[-―－ー]?' + '){1,8}' +
				')' +
			'|' + KYOTO_ex
		)
		, prews: PRE_WHITESPACES_re
		, building1: BUILDING1_re
		, building2: BUILDING2_re
		};
	//  prompt('',AddressLink.re.prews.source);
	})();


	// from http://d.hatena.ne.jp/brazil/20070103/1167788352
	function absolutePath(path){
		var e = document.createElement('span');
		e.innerHTML = '<a href="' + path + '" />';
		return e.firstChild.href;
	}

	function trimEx(s) {
		s = s.replace(/〒?\d{3}-?\d{4}/g, ''); // 郵便番号を除去
		return trim(s);
	}

	function trim(s) {
		return s.replace(/^[\s　]+|[\s　]+$/g, ''); // 空白文字と全角スペースを除去
	}

	function tryGetUri(atag) {
		// try-catchはIEで壊れたタグのatag.hrefが未定義のエラーとなり取得できない問題への対策
		try {
			var absHref = absolutePath(atag.href)
			if (absHref.match(/^http/)) {
				return absHref;
			}
		} catch (e) {
			// do nothing
		}
		
		return '';
	}

	function findNameAndUri(addressNode) {
		var name = '';
		var uri = '';
		
		var baseNode = addressNode.node;
		// 前後に意味のあるテキストを含んだノードが見つかるまで上に上がっていく
		while (true)
		{
			if ((function () {
				var prev = baseNode;
				while (prev = prev.previousSibling) {
				 	if (trimEx(prev.textContent || prev.innerText || '') != '') return 1;
				}
				var next = baseNode;
				while (next = next.nextSibling) {
				 	if (trimEx(next.textContent || next.innerText || '') != '') return 1;
				}
				return 0;
			})() == 1) break;
			
			baseNode = baseNode.parentNode;
		}
		
		var node = baseNode;		
		while ((node = node.previousSibling) && (name == '' || uri == ''))
		{
			if (name == '')
			{
				var text = trim(node.textContent || node.innerText || '');
				if (text != "")
				{
					name = text;
				}
			}
			if (uri == '')
			{
				if (node.nodeType == NODE_TYPE.TAG && node.tagName == 'A') {
					uri = tryGetUri(node);
				} else if (node.getElementsByTagName) {
					var atags = node.getElementsByTagName('a');
					for (var j = 0; j < atags.length; j++) {
						var atag = atags[atags.length - 1 - j];
						
						uri = tryGetUri(atag);
						if (uri == '') {
							break;
						}
					}
				}
			}
		}
		
		node = baseNode;
		while ((node = node.nextSibling) && (name == '' || uri == ''))
		{
			if (name == '')
			{
				var text = trim(node.textContent || node.innerText || '');
				if (text != "")
				{
					name = text;
				}
			}
			if (uri == '')
			{
				if (node.nodeType == NODE_TYPE.TAG && node.tagName == 'A') {
					uri = tryGetUri(node);
				} else if (node.getElementsByTagName) {
					var atags = node.getElementsByTagName('a');
					for (var j = 0; j < atags.length; j++) {
						var atag = atags[j];
						
						uri = tryGetUri(atag);
						if (uri == '') {
							break;
						}
					}
				}
			}
		}
		
		if (name == '') {
			name = addressNode.address;
		}
		
		return {
			'name': name,
			'uri': uri
		};
	}

	var geocoder = new google.maps.Geocoder();
	var num_to_be_geocoded; // undefined
	var num_geocode_completed = 0;
	var addressNodes = [];

	AddressLink(null, function (matchedNode, matchedText) {
		var addressNode = {"node": matchedNode, "address": matchedText};
		addressNodes.push(addressNode);

		geocoder.geocode({'address': addressNode.address}, function (results, status) {
			if (status == google.maps.GeocoderStatus.OK) {
				addressNode.lat = results[0].geometry.location.lat();
				addressNode.lon = results[0].geometry.location.lng();
			} else {
				addressNode.lat = '';
				addressNode.lon = '';
			}
			num_geocode_completed++;

			if (num_to_be_geocoded !== undefined && num_geocode_completed == num_to_be_geocoded) {
				// All geocodings are completed (generic case)
				showMap(addressNodes);
			}
		});
	});

	if (addressNodes.length == 0) {
		return; // no address found. do nothing
	}

	for (var i = 0; i < addressNodes.length; i++) {
		var addressNode = addressNodes[i];
		var name_and_uri = findNameAndUri(addressNode);
		addressNode.name = name_and_uri.name;
		addressNode.uri = name_and_uri.uri;
	}

	if (num_geocode_completed == addressNodes.length) {
		// All geocodings are completed (rare case)
		showMap(addressNodes);
	} else {
		num_to_be_geocoded = addressNodes.length;
	}

	function showMap(addressNodes) {

		var query_items = [];

		var form = document.createElement('form');
		form.action = 'http://chizool.capybala.com/kml.php';
		form.method = 'post';
		//form.target = "_blank";

		function createInput(name, value) {
			var input = document.createElement('input');
			input.type = 'hidden';
			input.name = name;
			input.value = value;
			form.appendChild(input);
		}

		for (var i = 0; i < addressNodes.length; i++) 
		{
			var addressNode = addressNodes[i];
			createInput('name' + i, addressNode.name);
			createInput('address' + i, addressNode.address);
			createInput('uri' + i, addressNode.uri);
			createInput('lat' + i, addressNode.lat);
			createInput('lon' + i, addressNode.lon);
		}
		document.body.appendChild(form);
		form.submit();
	}
}

(function () {
	var s = document.createElement('script');
	s.charset = 'utf-8';
	s.src = 'http://maps.google.com/maps/api/js?sensor=false&callback=chizoolCapybalaComInit';
	document.body.appendChild(s);
})();
