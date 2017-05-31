<?php
/**
 * Created by PhpStorm.
 * User: sergsova
 * Date: 28.04.17
 * Time: 14:50
 */
/** @var modX $modx */
$facilities = $modx->resource->getTVValue( 'facilities' );
$result     = array();
if ( ! $facilities ) {
	return;
}
$facilities = explode( ',', $facilities );
foreach ( $facilities as $facility ) {
	$facility = explode( '#', $facility );
	echo "<li class='$facility[1]'>$facility[0]</li>";
}