<?php

define('KML_DIR', 'kml');
define('BASE_URL', 'http://chizool.capybala.com/');
define('GOOGLE_MAPS_BASE_URL', 'http://maps.google.co.jp/?q=');

$kml = array();
$kml[] = '<kml xmlns="http://www.opengis.net/kml/2.2" xmlns:atom="http://www.w3.org/2005/Atom">';
$kml[] = '<Document>';

function h($str) {
	return htmlspecialchars($str, ENT_QUOTES, 'UTF-8');
}

for ($i = 0; $i < 1000; $i++) {
	if (!$_POST['name' . $i]) {
		break;
	}

	$name = h($_POST['name' . $i]);
	$address = h($_POST['address' . $i]);
	$uri = h($_POST['uri' . $i]);
	$lat = h($_POST['lat' . $i]);
	$lon = h($_POST['lon' . $i]);

	$kml[] = '<Placemark>';
	$kml[] = '<name>' . $name . '</name>';
	$kml[] = '<Point><coordinates>' . $lon . ',' . $lat . '</coordinates></Point>';
	$kml[] = '<atom:link>' . $uri . '</atom:link>';
	$kml[] = '</Placemark>';
}

$kml[] = '</Document>';
$kml[] = '</kml>';

$kml_text = implode('', $kml);

$sha1 = sha1($kml_text);
$path = KML_DIR . '/' . $sha1 . '.kml';
file_put_contents($path, $kml_text);

$kml_url = BASE_URL . $path;

header('Location: ' . GOOGLE_MAPS_BASE_URL . $kml_url);

?>
