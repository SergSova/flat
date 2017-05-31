<?php
/**
 * @var modX $modx
 */


$metro_options     = '';
$street_options    = '';
$facilites_options = '';
$additional_rules  = '';

//region metro
$q = $modx->newQuery( 'modResource' );
$q->where(
	array(
		'parent' => '11'
	)
);
$q->select( 'id, pagetitle' );
$q->prepare();
$q->stmt->execute();
$metro = $q->stmt->fetchAll( PDO::FETCH_ASSOC );

foreach ( $metro as $item ) {
	$metro_options .= '<label><input type="checkbox" value="' . $item['id'] . '"/><span class="otstup">' . $item['pagetitle'] . '</span></label>';
}
//endregion

//region street
$q = $modx->newQuery( 'modTemplateVarResource' );
$q->innerJoin( 'modTemplateVar', 'tv', '`tv`.`id` = `tmplvarid`' );
$q->where(
	array(
		'tv.name' => 'street',
	)
);

$q->distinct( 'value' );
$q->select( 'value' );
$q->prepare();
$q->stmt->execute();
/** @var modResource[] $apartments */
$address = $q->stmt->fetchAll( PDO::FETCH_ASSOC );
$addr    = array();

foreach ( $address as $item ) {
	$item = $modx->getObject( 'modResource', $item['value'] );
	if ( ! in_array( $item, $addr ) ) {
		array_push( $addr, $item );
		$street_options .= '<label><input type="checkbox" value="' . $item->id . '"/><span class="otstup">' . $item->pagetitle . '</span></label>';
	}
}
//endregion

//region facil
$q = $modx->newQuery( 'modTemplateVarResource' );
$q->innerJoin( 'modTemplateVar', 'tv', '`tv`.`id` = `tmplvarid`' );
$q->where(
	array(
		'tv.name' => 'facilities',
	)
);

$q->distinct( 'value' );
$q->select( 'value' );
$q->prepare();
$q->stmt->execute();
/** @var modResource[] $apartments */
$facil = $q->stmt->fetchAll( PDO::FETCH_ASSOC );

foreach ( $facil as $item ) {
	$items = explode( '||', $item['value'] );
	foreach ( $items as $facilit ) {
		$facilit = explode( '#', $facilit )[0];
		$facilites_options .= '<label><input type="checkbox" value="' . $facilit . '"/><span class="otstup">' . $facilit . '</span></label>';
	}
}
//endregion

//region addit
$addition_id = $addition_id ? explode( ',', $addition_id ) : array( 23, 22, 19, 35, 24 );
$q           = $modx->newQuery( 'modTemplateVar' );
$q->where(
	array(
		'id:IN' => $addition_id
	)
);
$q->select( 'name, caption' );
$q->prepare();
$q->stmt->execute();
/** @var modResource[] $apartments */
$addit = $q->stmt->fetchAll( PDO::FETCH_ASSOC );

foreach ( $addit as $item ) {
	$additional_rules .= '<label><input type="checkbox" value="' . $item['name'] . '"/><span class="otstup">' . $item['caption'] . '</span></label>';
}
//endregion

$modx->setPlaceholder( 'metro_options', $metro_options );
$modx->setPlaceholder( 'street_options', $street_options );
$modx->setPlaceholder( 'facilites_options', $facilites_options );
$modx->setPlaceholder( 'additional_rules', $additional_rules );