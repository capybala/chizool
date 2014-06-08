<?php

define('BASE_URL', 'http://chizool.capybala.com/');
define('BOOKMARKLET_URL', BASE_URL . 'bookmarklet.js');
define('BOOKMARKLET', "javascript:(function(){" .
	"var%20s;" .
	"s=document.createElement('script');" .
	"s.charset='utf-8';" .
	"s.src='" . BOOKMARKLET_URL . "';" .
	"document.body.appendChild(s);" .
	"})();");

?><!DOCTYPE html>
<html>
<head>
	<meta charset="utf-8">
	<title>住所の羅列を地図上にマッピングするよα</title>
	<link rel="stylesheet" type="text/css" href="css/map.css"/>
</head>
<body>
<div id="wrapper">
	<header>
		<h1><img src="images/logo.png" alt="ワンクリックマッピングツール Chizool-チズール-" /></h1>
	</header>
	<div id="main_visual">
		<div class="centering">
			<img src="images/main_visual.jpg">
		</div><!--/centering-->
	</div><!--/main_visual-->
	<div id="contents">
		<div class="centering">
			<h2>なにこれ？</h2>
			<p>
			住所が含まれているページで次のブックマークレット <a href="<?php echo BOOKMARKLET; ?>">住所を地図上に表示</a> を実行すると地図上にマッピングしてくれます。<br />
			※ポップアップブロックを解除する必要があります。
			</p>
			<h2>何が嬉しいの？</h2>
			<p>
			住所がたくさん書いてあっても地図上で見ないと位置関係がわからないWebページでも、地図上に住所をマッピングできます。
			</p>
			<h2>サンプル</h2>
			<p>仮に次のように住所が書いてあっても、東京に詳しくない人は地図上での位置関係がわかりません。</p>
			<ol>
			<li><a href="http://www.jreast.co.jp/estation/stations/1039.html">東京駅</a> 千代田区丸の内1-9-1</li>
			<li><a href="http://www.jreast.co.jp/estation/stations/866.html">新宿駅</a> 新宿区新宿三丁目38-1</li>
			<li><a href="http://www.jreast.co.jp/estation/stations/788.html">品川駅</a> 港区高輪三丁目26-26</li>
			<li><a href="http://www.tokyodisneyresort.co.jp/tdl/index.html">東京ディズニーランド</a> 千葉県浦安市舞浜1</li>
			</ol>
			<p>ここで<a href="<?php echo BOOKMARKLET; ?>">住所を地図上に表示</a>というブックマークレットをクリックすると…</p>
			<p>ブックマークレットをブックマークツールバーなどに登録しておくと便利です。</p>

			<p>
			スクリーンショット<br/>
			<a href="images/screenshot.png"><img src="images/screenshot.png" style="width: 400px"/></a>
			</p>

		</div><!--/centering-->
	</div><!--/contents-->
	<footer>
		<address>copyright (c) capybala.com all rights reserved.</address>
	</footer>
</div><!--/wrapper-->
</body>

</html>
