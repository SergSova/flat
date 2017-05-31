<div class="col-lg-4 flat_block-1 flat_block_image2" style="background: url([[getImageList?
        &docid=`[[+id]]`
        &tvname=`apart-image-slider`
        &randomize=`1`
        &limit=`1`
        &tpl=`@CODE: [[+image]]`
        ]]) no-repeat center center;}">

    <!--absolute block info -->
    <div class="info_abs">
        <div class="info">
            <p>[[#[[+street]].pagetitle]],[[+building]]<br> [[#[[#[[+street]].parent]].pagetitle]]</p>
            <div class="small_info">
                [[+rooms:is=``:else=`<span class="num-rooms">[[+rooms]]</span>`]]
                [[+bedroom:is=``:else=`<span class="num-beds">[[+bedroom]]</span>`]]
                [[!count_comments?&id=`[[+id]]`]]
            </div>
            <div class="price-1">
                [[+old_price:is=``:else=`<p><span class="font-s">[[+old_price]]</span>грн/сутки</p>`]]
                <p><span>[[+price]]</span>грн/сутки</p>
            </div>
            <div class="but_border">
                <button class="select">Бронировать</button>
            </div>
            <div class="but_border">
                <a href="[[~[[+id]]]]"><button class="select">Подробнее</button></a>
            </div>
        </div>
    </div>

    <!-- end absolute block info -->

    <!-- absolute block price -->
    <div class="price_abs">
        <div class="price">
            [[+old_price:is=``:else=`<p><span class="font-s">[[+old_price]]</span>грн/сутки</p>`]]
            <p><span>[[+price]]</span>грн/сутки</p>
        </div>
    </div>
    <!-- end absolute block price -->

    <!-- absolute block like -->
    <div class="like_abs">
        <div class="like"></div>
    </div>
    <!-- end absolute block like -->
    <div class="plag [[+status:is=`1`:then=`top`]][[+status:is=`2`:then=`hot`]][[+status:is=`3`:then=`new`]]"></div>
</div>