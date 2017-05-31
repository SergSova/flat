<?php
/**
 * @var modX $modx
 */

$coments_count = 0;
$q             = $modx->newQuery( 'modResource' );
$q->innerJoin( 'modTemplateVarResource', 'tvr', '`modResource`.`id`=`tvr`.`contentid`' );
$q->innerJoin( 'modTemplateVar', 'tv', '`tvr`.`tmplvarid`=`tv`.`id`' );
$q->where(
	array(
		'tv.name'   => 'feedback_document',
		'tvr.value' => $id
	)
);
$q->select( 'modResource.id' );
$q->prepare();
$q->stmt->execute();
$result = $q->stmt->fetchAll( PDO::FETCH_ASSOC );
if ( count( $result ) ) {
	$coments_count = count( $result );
	echo '<span class="num-comments">' . $coments_count . '</span>';
}

//$modx->setPlaceholder( 'comments', $coments_count );