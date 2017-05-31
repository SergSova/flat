[[$head]]

<link rel="stylesheet" href="assets/plagins/scrollbar/jquery.mCustomScrollbar.css"/>
<link href="https://fonts.googleapis.com/css?family=Cormorant+SC|Cormorant:300" rel="stylesheet">
</head>
<body>
<header>
    [[$menu]]
</header>
<div class="wrapper-block">
    <div class="wrapper">
        <section class="slider_page_kartochka_kvartiry">
            <div class="slider_kartochka_kvartiry">
                [[getImageList?
                &docid=`[[*id]]`
                &tvname=`apart-image-slider`
                &tpl=`apart-image-slider-item-TPL`
                ]]
            </div>
        </section>
        <section class="page_kartochka_kvartiry">
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 col-lg-offset-1 wrap_knopka">
                        <div class="knopka">
                        </div>
                    </div>
                </div>
            </div>
            <div class="container">
                <div class="row">
                    <div class="col-lg-10 col-lg-offset-1 page_kartochka">
                        <div class="container block_flat">
                            <div class="row">
                                <div class="col-lg-2 col-lg-offset-4 page_kartochka_po">
                                    <!-- <div class="knopka"></div> -->
                                    <img class="logo_half" src="assets/images/logo_half.png">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-lg-offset-2">
                                    <h2>[[*pagetitle]]</h2>
                                </div>
                            </div>
                            <div class="row position_block">
                                <div class="col-lg-7 col-lg-offset-0 block_description">
                                    <span class="price_big">[[*price]]<p>грн/сутки</p></span>
                                    <h6>[[#[[#[[*street]].parent]].pagetitle]],
                                        [[#[[*street]].pagetitle]],[[*building]]</h6>
                                    <p class="more">[[*content]]</p>
                                    <h6 class="read-more-trigger">Подробнее</h6>
                                    <div class="flat_description">
                                        <div>
                                            <span>К-во комнат:</span>
                                            <p>[[*rooms]]</p>
                                        </div>
                                        <div>
                                            <span>К-во спален:</span>
                                            <p>[[*bedroom]]</p>
                                        </div>
                                        <div>
                                            <span>К-во спальных мест:</span>
                                            <p>[[*berths]]</p>
                                        </div>
                                        <div>
                                            <span>Этаж:</span>
                                            <p>[[*floor]]</p>
                                        </div>
                                        <div>
                                            <span>Метро:</span>
                                            <p>[[#[[#[[*street]].parent]].pagetitle]]</p>
                                        </div>
                                        <div>
                                            <span>Общая площадь:</span>
                                            <p>[[*full-area]]м.кв.</p>
                                        </div>
                                        <div>
                                            <span>Кухня:</span>
                                            <p>[[*kitchen]]</p>
                                        </div>
                                    </div>
                                </div>
                                <div class="col-lg-3 col-lg-offset-0 block_description_right">
                                    <span>Бронирование</span>
                                    <div class="form-group-2">
                                        <p class="labell">дата посещения</p>
                                        <div class="calendar">
                                            <p>Вьезд/Выезд</p>
                                        </div>
                                    </div>
                                    <div class="number">
                                        <span>Взрослые</span>
                                        <input type="number" min="1" max="9" step="1" value="1">
                                    </div>
                                    <div class="number">
                                        <span>Дети</span>
                                        <input type="number" min="1" max="9" step="1" value="1">
                                    </div>
                                    <div class="but_border">
                                        <button class="select">Забронировать</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="container block_flat_booking">
                            <div class="row">
                                <div class="col-lg-2 col-lg-offset-5">
                                    <img class="logo_half" src="assets/images/logo_half1.png">
                                </div>
                            </div>
                            <div class="row">
                                <div class="col-lg-6 col-lg-offset-3">
                                    <h2>Бронирование</h2>
                                </div>
                            </div>
                            <div class="col-lg-9 col-lg-offset-0 block_description">
                                <span class="price_big">Правила бронирования</span>
                                <p class="more">[[*reservation]]</p>
                            </div>
                            <div class="col-lg-3 col-lg-offset-0 block_description_right">
                                <h3>[[*pagetitle]]</h3>
                                <div class="but_border">
                                    <button class="select">Описание</button>
                                </div>
                            </div>
                            <div class="flat_description_wrapper col-lg-10 col-lg-offset-1">
                                <div class="flat_description">
                                    <div>
                                        <span>Квартира:</span>
                                        <p>г. Киев, [[#[[*street]].pagetitle]],[[*building]]</p>
                                    </div>
                                    <div>
                                        <span>К-во комнат:</span>
                                        <p>[[*rooms]]</p>
                                    </div>
                                    <div>
                                        <span>К-во спален:</span>
                                        <p>[[*bedroom]]</p>
                                    </div>
                                    <div>
                                        <span>К-во спальных мест:</span>
                                        <p>[[*berths]]</p>
                                    </div>
                                </div>
                                <div class="forma">
                                    <div class="form-group-2">
                                        <p class="labell">дата посещения</p>
                                        <div class="calendar">
                                            <p>Вьезд/Выезд</p>
                                        </div>
                                    </div>
                                    <div class="number">
                                        <span>Взрослые</span>
                                        <input type="number" min="1" max="9" step="1" value="1">
                                    </div>
                                    <div class="number">
                                        <span>Дети</span>
                                        <input type="number" min="1" max="9" step="1" value="1">
                                    </div>
                                </div>
                                <div class="flat_description fl_2">
                                    <div>
                                        <span>Количество ночей:</span>
                                        <p>9</p>
                                    </div>
                                    <div>
                                        <span>Стоимость в сутки:</span>
                                        <p>[[*price]] грн</p>
                                    </div>
                                    <div>
                                        <span>Итого:</span>
                                        <p>13 500грн</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="container block_3">
                            <div class="flat_description_wrapper_2 col-lg-10 col-lg-offset-1">
                                <div class="block_item block_item_1">
                                    <p class="main_p">Оплатить 1 сутки</p>
                                    <span>[[*price]]грн</span>
                                    <div class="but_border">
                                        <button class="select">Оплатить</button>
                                    </div>
                                </div>
                                <div class="block_item block_item_2">
                                    <p class="main_p">Оплатить весь срок пребывания</p>
                                    <span>13 500грн</span>
                                    <div class="but_border">
                                        <button class="select">Оплатить</button>
                                    </div>
                                </div>
                                <div class="block_item block_item_3">
                                    <p class="main_p lp">
                                        <input type="checkbox" id="c2" name="cc"/>
                                        <label for="c2"><span>С правилами ознакомлен</span></label>
                                    <p>
                                        <!-- <p class="main_p lp">С правилами ознакомлен</p> -->
                                    <div class="but_border big">
                                        <button class="select">Связаться с менеджером</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div class="wrap_block_click">
                            <ul class="buttons tabs clearfix" data-tabgroup="first-tab-group">
                                <li><a href="#tab1" class="active">3d-тур</a></li>
                                <li><a href="#tab2">удобства</a></li>
                                <li><a href="#tab3">правила</a></li>
                                <li><a href="#tab4">на карте</a></li>
                                <li><a href="#tab5">календарь</a></li>
                                <li><a href="#tab6">отзывы</a></li>
                            </ul>
                            <div class="block_click tabgroup" id="first-tab-group">
                                <div id="tab1" class="tour"></div>
                                <div id="tab2" class="ydobstva">
                                    <ul class="comfort comfort-1">
                                        [[facilities_list? &visible_max=`18`]]
                                    </ul>
                                    <span class="look-more">Смотреть еще</span>
                                    <span class="look-more-2">Свернуть</span>
                                </div>
                                <div id="tab3" class="rules">
                                    <div class="rules_description">
                                        <div>
                                            <div>
                                                <span>Старховой депозит:</span>
                                                <p>[[*depozit]]</p>
                                            </div>
                                            <div>
                                                <span>Минимальный срок аренды:</span>
                                                <p>[[*min_lease]]</p>
                                            </div>
                                            <div>
                                                <span>Время заселения:</span>
                                                <p>[[*time_in]]</p>
                                            </div>
                                            <div>
                                                <span>Время выселения:</span>
                                                <p>[[*time_out]]</p>
                                            </div>
                                        </div>
                                        <div>
                                            <div>
                                                <span>Размещение с детьми:</span>
                                                <p>[[*child]]</p>
                                            </div>
                                            <div>
                                                <span>Размещение с животными:</span>
                                                <p>[[*animals]]</p>
                                            </div>
                                            <div>
                                                <span>Курить можно:</span>
                                                <p>[[*smoking]]</p>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div id="tab4"></div>
                                <div id="tab5" class="calendar_onflat"></div>
                                <div id="tab6" class="feedback">
                                    [[!getResources?
                                    &parents=`41`
                                    &showHidden=`1`
                                    &includeTVs=`1`
                                    &includeContent=`1`
                                    &tvFilters=`feedback_document==[[*id]]`
                                    &tpl=`feedback-item-TPL`
                                    ]]
                                </div>
                            </div>
                        </div>
                        <div class="advice">
                            <h6>Также советуем</h6>
                            [[!getResources?
                            &parents=`6`
                            &showHidden=`1`
                            &includeTVs=`1`
                            &tvPrefix=``
                            &sortbyTV=`status`
                            &sortdirTV=`ASC`
                            &resources=`-[[*id]]`
                            &tpl=`advice-slider-item`
                            ]]
                        </div>
                        <div class="form-manager">
                            <h4 class="rules">Связаться с менеджером</h4>
                            <div class="col-lg-10 col-lg-offset-1 form">
                                <form class="form1">
                                    <input type="text" name="name" placeholder="Ф.И.О.">
                                    <input type="email" name="email" placeholder="E-MAIL">
                                    <input type="number" name="phone" placeholder="ТЕЛЕФОН">
                                    <textarea name="comment" placeholder="ВОПРОС"></textarea>
                                </form>
                            </div>
                            <div class="col-lg-3 col-lg-offset-5">
                                <div class="but_border">
                                    <button class="select">Задать вопрос</button>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    </div>
</div>
<script src="https://maps.googleapis.com/maps/api/js?key=AIzaSyDuKGM5Uyp8zEcgsODy7nxVwFIEgEgLJ_k"></script>
<script src="https://ajax.googleapis.com/ajax/libs/jquery/3.1.0/jquery.min.js"></script>

<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>

<script type="text/javascript" src="assets/js/bootstrap.min.js"></script>
<script type="text/javascript" src="assets/js/script.js"></script>

<script type="text/javascript" src="https://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>

<script type="text/javascript" src="assets/plagins/slick/slick/slick.min.js"></script>
<script src="assets/plagins/scrollbar/jquery.mCustomScrollbar.concat.min.js"></script>
</body>
</html>