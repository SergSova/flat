<?php
/**
 * @var modX $modx
 * @var modResource $res
 * @var string $tpl
 */
$res = $modx->getObject( 'modResource', $id );

$q = $modx->newQuery( 'modTemplateVar' );
$q->innerJoin( 'modTemplateVarTemplate', 'tvt', '`modTemplateVar`.`id` = `tvt`.`tmplvarid`' );
$q->where(
	array(
		'tvt.templateid' => $res->template
	)
);
$q->select( 'name' );
$q->prepare();
$q->stmt->execute();
$tvs = $q->stmt->fetchAll( PDO::FETCH_ASSOC );
//var_dump($q->toSQL());die();
foreach ( $res->_fields as $key => $field ) {
	$modx->setPlaceholder( $key, $field );
}
foreach ( $tvs as $tv ) {
	$modx->setPlaceholder( $tv['name'], $res->getTVValue( $tv['name'] ) );
}

$output = $modx->getChunk( $tpl );

return $output;