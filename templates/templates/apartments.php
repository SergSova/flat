[[$head]]

</head>
<body>
<header>
    [[$menu]]
</header>
<section class="page_flats" id="flats">
    <div class="container">
        <div class="row">
            <div class="col-sm-1 col-sm-offset-6 col-lg-1 col-lg-offset-6">
                <div class="line"></div>
                <div class="rhomb"></div>
            </div>
        </div>
    </div>
    <div class="container">
        <div class="row">
            <p class="col-lg-10 col-lg-offset-1">
            <h1>[[*pagetitle]]</h1>
            <p class="description">[[*content]]</p>
        </div>
    </div>
    <div class="row">
        <div class="col-lg-1 col-lg-offset-6">
            <div class="line3"></div>
        </div>
    </div>
    </div>
    <div class="container no_padding">
        <div class="row">
            <div class="col-lg-10">
                <ul class="sort_by">
                    <li>Сортировать по:</li>
                    <li><a href="#" name="price">Цене
                            <div class="min"></div>
                            <div class="max"></div>
                        </a></li>
                    <li><a href="#" name="status">Новизне
                            <div class="min"></div>
                            <div class="max"></div>
                        </a></li>
                    <li><a href="#" name="comments">По отзывам
                            <div class="min"></div>
                            <div class="max"></div>
                        </a></li>
                    <li><a href="#" name="rooms">По количеству комнат
                            <div class="min"></div>
                            <div class="max"></div>
                        </a></li>
                </ul>
            </div>
            <div class="col-lg-2 col-lg-offset-0">
                <div class="plitka"></div>
                <div class="map"></div>
            </div>
        </div>
        <div class="row">
            <div class="col-lg-12 no_padding" id="list-apartments">
                [[!filter_apartment]]
            </div>
        </div>
        <div class="container lines">
            <div class="row">
                <div class="col-lg-1 col-lg-offset-6">
                    <div class="line1"></div>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-1 col-lg-offset-6">
                    <p class="to_top">наверх</p>
                    <a href="[[~[[*id]]]]#flats">
                        <div class="up hovicon effect-1 sub-a"></div>
                    </a>
                </div>
            </div>
            <div class="row">
                <div class="col-lg-1 col-lg-offset-6">
                    <div class="rhomb"></div>
                    <div class="line"></div>
                </div>
            </div>
        </div>
</section>
<section>
    <div class="popup_callback">
        <h6>Обратный звонок</h6>
        <form class="form1">
            <input type="number" name="phone" placeholder="ВАШ НОМЕР ТЕЛЕФОНА">
        </form>
        <div class="but_border">
            <button class="select">задать вопрос</button>
        </div>
        <div class="close_popup">
            <a href="javascript:void(0)"></a>
        </div>
    </div>
</section>
<div id="overlay"></div>
[[$foot]]
<script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.3/jquery.min.js"></script>
<script type="text/javascript" src="assets/js/bootstrap.min.js"></script>
<script type="text/javascript" src="assets/js/script.js"></script>
<script type="text/javascript" src="https://code.jquery.com/jquery-migrate-1.2.1.min.js"></script>
<script type="text/javascript" src="assets/plagins/slick/slick/slick.min.js"></script>
</body>
</html>