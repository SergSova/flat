<?php
/**
 * @var $modx modX
 */

$filter = '';
if ( $_GET['price'] ) {
	$str_where = str_replace( ':', '', $_GET['price'] );
	$str_where = 'price' . str_replace( '||', ',price', $str_where );
	$filter    = $filter ? $filter . ', ' . $str_where : $str_where;
}
if ( $_GET['rooms'] ) {
	$rooms_where = $_GET['rooms'];
	$str_where   = 'rooms===' . implode( '||rooms===', $rooms_where );
	$filter      = $filter ? $filter . ',' . $str_where : $str_where;
}
if ( $_GET['facilities'] ) {
	$facilities_where = $_GET['facilities'];
	$str_where        = 'facilities==%' . implode( '%,facilities==%', $facilities_where ) . '%';
	$filter           = $filter ? $filter . ',' . $str_where : $str_where;
}
if ( $_GET['addition'] ) {
	$addition_where = $_GET['addition'];
	$str_where      = '';
	foreach ( $addition_where as $item ) {
		$str_where .= $item . '==%да%||%балкон%';
	}

	$filter = $filter ? $filter . ',' . $str_where : $str_where;
}

if ( $_GET['metro'] && ! $_GET['street'] ) {
	$metro_where = $_GET['metro'];
	if ( ! is_array( $metro_where ) ) {
		$metro_where = array( $metro_where );
	}
	$str_where = '';
	/** @var modResource[] $metro_arr */
	$metro_arr = $modx->getCollection( 'modResource', array( 'parent' => '11', 'AND:id:IN' => $metro_where ) );
	foreach ( $metro_arr as $item ) {
		$q = $modx->newQuery( 'modResource' );
		$q->where( array( 'parent' => $item->id, 'deleted' => '0' ) );
		$q->select( 'id' );
		$q->prepare();
		$q->stmt->execute();
		$streets   = $q->stmt->fetchAll( PDO::FETCH_ASSOC );
		$str_where = 'street===';
		foreach ( $streets as $street ) {
			$str_where .= $street['id'] . "||$filter,street===";
		}
	}
	$str_where = substr( $str_where, 0, strrpos( $str_where, '||' ) );
	$filter    = $filter ? $filter . ',' . $str_where : $str_where;
}
if ( $_GET['street'] ) {
	$street_where = $_GET['street'];
	$str_where    = 'street===' . implode( "||$filter,street===", $street_where );
	$filter       = $filter ? $filter . ',' . $str_where : $str_where;
}

if ( $_GET['actions'] ) {
	$street_where = $_GET['actions'];
	$str_where    = 'old_price>>0';
	$filter       = $filter ? $filter . ',' . $str_where : $str_where;
}

//echo $filter;
echo $modx->runSnippet(
	'getResources', array(
		'parents'    => '6',
		'showHidden' => '1',
		'tvFilters'  => $filter,
		'includeTVs' => '1',
		'tvPrefix'   => '',
		'sortbyTV'   => 'status',
		'sortdirTV'  => 'ASC',
		'tpl'        => 'filtred_apartment-item-TPL'
	)
);