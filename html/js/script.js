var windowWidthValue = (window.innerWidth > 0) ? window.innerWidth : screen.width;

$(window).on('load', function() {
    if ($('body.main-page').length > 0) {
        $('body').addClass('start');
    }
});


$(document).ready(function() {

    $('a.additional').click(function() {
        $('.container.one').addClass('show1');
        $('.row.show_add').show(200);
    });
    $('.row.show_add a.additional').click(function() {
        $('.container.one').removeClass('show1');
        $('.row.show_add').hide(200);
    });

    // страница карточка квартиры кнопка смотреть еще

    $('span.look-more').click(function() {
        $('.ydobstva > ul.comfort').addClass('show-list');
        $('.ydobstva > ul.comfort  li.hided').show(200);
        $('span.look-more').fadeOut(100);
        $('span.look-more-2').fadeIn(300);
    });

    $('span.look-more-2').click(function() {
        $('.ydobstva > ul.comfort').removeClass('show-list');
        $('.ydobstva > ul.comfort  li.hided').hide(200);
        $('span.look-more').fadeIn(300);
        $('span.look-more-2').fadeOut(100);
    });

    // конец страница карточка квартиры кнопка смотреть еще

    //---------------------------------strat burger click ----------------------------//

    $('.burger').click(function() {
        $('header').toggleClass('active_nav');

    });

    //---------------------------------end burger click ------------------------------//

    //---------------------------------strat number click ----------------------------//

    $('.call_right p.call img').click(function() {
        $('.call_right p.call.clhide').fadeToggle(200);

    });

    $('span.runglish').click(function() {
        $('span.english').fadeIn(200);
        $(this).addClass('clicked_ru');

    });
    $('span.english').click(function() {
        $('span.runglish').fadeOut(200);
        $(this).addClass('clicked');
    });

        $('span.english.clicked').click(function(){
            console.log(22);
         $('span.runglish.clicked_ru').fadeIn(200);
        });

        $('.language-select').click(function(){
            $(this).toggleClass('open');
        })

        $('.language-select li').click(function(){
        var setLang = $('.language-select').data('location'),
            dataLangSelect = $(this).data('lang')
              $('.language-select').data('location', dataLangSelect);
              $('.language-select li').removeClass('active');
              $(this).toggleClass('active');
        })

    //---------------------------------end number click ------------------------------//

    $('.make_position button').click(function() {
        $(this).toggleClass('active');
    });

    //------------------------- start dropdown filtr with checkbox -------------------------------//


    $(".selectBox").click(function() {

        $(this).closest(".choose4").siblings('.choose4').each(function() {
            $(this).find('.checkboxes').fadeOut(200);

        });

        $(this).siblings(".checkboxes").fadeToggle(200);



    });


    //------------------------- dropdown filtr with checkbox end -------------------------------//
    //-------------------------всплывающий текс страница правила -----------------------------------------------------//

    $('.text_show h3').click(function() {
        $(this).toggleClass('clicked');
        $(this).siblings('p').toggle('slow');

        $(this).closest('.text_shown').siblings('.text_shown').each(function() {
            $(this).find('.text_show h3').removeClass('clicked').siblings('p').hide('slow');
        });
    });


    //---------------------------все (11) страница правила---------------------------------------------------//

    $('.text-shown_wrapper').each(function() {

        var hiddenChildrenCount = $(this).find('.text_shown').length - 3;
        $(this).append('<a href="javascript:void(0)" class="showall"> Все (' + hiddenChildrenCount + ')</a>');
        $(this).append('<a href="javascript:void(0)" class="showallhide" style="margin-left: 40px;"> Свернуть</a>');
        $(this).find('.showallhide').hide();

        $(this).find('.text_shown').each(function(index) {
            if (index > 2) {
                $(this).hide('400');
            }
        });

    });




    $('a.showall').click(function() {
        $(this).closest('.text-shown_wrapper').find('.text_shown').show('300');
        $(this).hide();
        $(this).closest('.text-shown_wrapper').find('.showallhide').show();

        $(this).closest('.text-shown_wrapper').siblings('.text-shown_wrapper').each(function() {
            $(this).find('a.showallhide').click();
            $(this).find('.text_show h3').removeClass('clicked').siblings('p').hide('slow');


        });


    });

    $('a.showallhide').click(function() {
        $(this).hide();
        $(this).closest('.text-shown_wrapper').find('.showall').show();
        $(this).closest('.text-shown_wrapper').find('.text_shown').each(function(index) {
            if (index > 2) {
                $(this).hide('400');
            }
        });

    });
    //-------------------------------- конец все (11) страница правила-----------------------------------------//

    // слайдер на главной странице

    $('.slider_mainpage').slick({
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: false,
        autoplaySpeed: 6000,
        fade: true,
        cssEase: 'linear',
        prevArrow: false,
        nextArrow: false,
    });


    // конец слайдер на странице квартиры




    // слайдер на странице квартиры

    $('.slick_flat_slider').slick({

    });


    // конец слайдер на странице квартиры


    // слайдер на странице сервис

    $('.slider_servis_wrapper').slick({

    });


    // конец слайдер на странице сервис

    // слайдер на странице туристам
    var windowWidthValue = (window.innerWidth > 0) ? window.innerWidth : screen.width;
    if (windowWidthValue > 767) {

        $('.slider_turistam_wrapper').slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            dots: false,
            infinite: true,
            arrows: false,
            draggable: false,
            speed: 500,
            fade: true,
            cssEase: 'linear',
            asNavFor: '#blocksShow'
        });
        $('#blocksShow').slick({
            slidesToShow: 5,
            slidesToScroll: 1,
            dots: false,
            infinite: true,
            speed: 500,
            arrows: false,
            fade: false,
            focusOnSelect: true,
            cssEase: 'linear',
            asNavFor: '.slider_turistam_wrapper'
        });

    }

    $('.slick_each_block').each(function() {
        var that = $(this).find('.block_slider');
        that.slick({
            slidesToShow: 1,
            slidesToScroll: 1,
            draggable: false,
            infinite: false,
            dots: false,
            speed: 500,
            fade: true
        });


        if (windowWidthValue > 767) {

            that.on('edge', function(event, slick, direction) {
                if (direction == 'left') {
                    // next
                    $('.slider_turistam_wrapper').slick('slickNext');
                    $('.slider_turistam_wrapper .slick_each_block.slick-active .block_slider').slick('slickGoTo', 0);
                } else if (direction == 'right') {
                    // prev
                    $('.slider_turistam_wrapper').slick('slickPrev');
                    var lastSlideNum = $('.slider_turistam_wrapper .slick_each_block.slick-active .block_slider').slick('getSlick').slideCount - 1;
                    $('.slider_turistam_wrapper .slick_each_block.slick-active .block_slider').slick('slickGoTo', lastSlideNum);
                }
            });

            that.find('button').mousedown(function() {
                var that = $(this);
                if (that.hasClass('slick-disabled')) {
                    if (that.hasClass('slick-next')) {
                        // next
                        $('.slider_turistam_wrapper').slick('slickNext');
                        $('.slider_turistam_wrapper .slick_each_block.slick-active .block_slider').slick('slickGoTo', 0);
                    } else {
                        // prev
                        $('.slider_turistam_wrapper').slick('slickPrev');
                        var lastSlideNum = $('.slider_turistam_wrapper .slick_each_block.slick-active .block_slider').slick('getSlick').slideCount - 1;
                        $('.slider_turistam_wrapper .slick_each_block.slick-active .block_slider').slick('slickGoTo', lastSlideNum);
                    }
                }
            });
        }
    });

    if (windowWidthValue > 767) {

        $('#blocksShow .slick-slide').click(function() {
            $('.slider_turistam_wrapper .slick_each_block.slick-active .block_slider').slick('slickGoTo', 0);
        });

    }




    if (windowWidthValue < 767) {
        $('.block_slider').hide();
        $('.slider_turistam_wrapper .other_block').click(function() {

            $(this).siblings('.block_slider').toggle(200, function() {
                $(this).slick('setPosition');
            });
            $(this).closest('.slick_each_block').toggleClass('active_block_show');


            $(this).closest('.slick_each_block').siblings('.slick_each_block').each(function() {
                $(this).find('.block_slider').hide('slow');
                $(this).removeClass('active_block_show');
            });

        });

    }

    // конец слайдер на странице туристам

    //------------------начало переключатель на карту на странице квартиры ---------------------//
    var windowWidthValue = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    var map;

    $('#map_kvartiry').hide();

    $('.map').click(function() {
        $(this).addClass('active');
        $(this).siblings('.plitka').removeClass('active');
        $('.displayed_block').hide();
        $('#map_kvartiry').show(200, function() {
            initializeOnPageKvartiry();
        });

    });

    $('.plitka').click(function() {
        $(this).addClass('active');
        $(this).siblings('.map').removeClass('active');
        $('#map_kvartiry').hide();
        $('.displayed_block').show(200);

    });


    function initializeOnPageKvartiry() {

        var myLatlng = { lat: 50.471706, lng: 30.601709 };


        map = new google.maps.Map(document.getElementById('map_kvartiry'), {
            zoom: 14,
            center: myLatlng,
            disableDefaultUI: true
        });

        setMarkers(map, markersInfo);
        infowindow = new google.maps.InfoWindow({
            content: "loading...",
            pixelOffset: new google.maps.Size(0, 0)
        });

        // var mapstyle = [{"featureType":"all","elementType":"labels","stylers":[{"color":"#ff0000"},{"visibility":"on"}]},{"featureType":"all","elementType":"labels.text","stylers":[{"color":"#ff0000"}]},{"featureType":"all","elementType":"labels.text.fill","stylers":[{"color":"#ff0000"}]},{"featureType":"all","elementType":"labels.text.stroke","stylers":[{"visibility":"off"}]},{"featureType":"all","elementType":"labels.icon","stylers":[{"visibility":"off"}]},{"featureType":"administrative","elementType":"all","stylers":[{"color":"#7f7479"}]},{"featureType":"administrative","elementType":"labels.text","stylers":[{"color":"#c3b8b5"}]},{"featureType":"landscape","elementType":"all","stylers":[{"color":"#ead9e0"}]},{"featureType":"landscape","elementType":"geometry","stylers":[{"color":"#4a3f47"}]},{"featureType":"landscape","elementType":"geometry.fill","stylers":[{"color":"#7c7376"}]},{"featureType":"landscape","elementType":"labels.text","stylers":[{"color":"#d3cac7"}]},{"featureType":"poi","elementType":"all","stylers":[{"color":"#a4999c"}]},{"featureType":"poi","elementType":"labels.text","stylers":[{"color":"#c3b8b5"}]},{"featureType":"road","elementType":"all","stylers":[{"color":"#6c6169"}]},{"featureType":"road","elementType":"labels.text","stylers":[{"color":"#d6cbc7"}]},{"featureType":"transit","elementType":"labels.text","stylers":[{"color":"#c3b8b5"}]},{"featureType":"water","elementType":"all","stylers":[{"color":"#a4999c"}]}];  

        // map.setOptions({
        //     styles: mapstyle
        // });
    };

    var markersInfo = [];
    var emptyIcon = "assets/image/marker-empty.png";

    function collectMarkersInfo(objects) {
        markersInfo = [];
        objects.each(function() {
            var that = $(this);
            var sticker = that.find('.plag');
            var commentHide = '';
            var oldPriceHide = '';
            if (sticker.length) {
                sticker = sticker.attr('class').replace('plag ', '');
            } else {
                sticker = 'hidden';
            }
            if (that.find('.small_info .num-comments').length == 0) {
                commentHide = 'hidden';
            }
            if (that.find('.price-1 p').length < 2) {
                oldPriceHide = 'hidden';
            }
            var markerObj = {
                lat: that.data('lat'),
                lng: that.data('lng'),
                photo: that.data('photo'),
                adress: that.find('.info > p').html(),
                buttonBookText: that.find('.but_border').eq(0).find('button').html(),
                buttonBookLink: that.find('.but_border').eq(0).find('a').attr('href'),
                buttonMoreText: that.find('.but_border').eq(1).find('button').html(),
                buttonMoreLink: that.find('.but_border').eq(1).find('a').attr('href'),
                price: that.find('.price-1 p:last-child').html(),
                oldPrice: that.find('.price-1 p:first-child').html(),
                roomsCount: that.find('.small_info .num-rooms').html(),
                bedsCount: that.find('.small_info .num-beds').html(),
                commentsCount: that.find('.small_info .num-comments').html(),
                cornerWord: sticker,
                commentsHide: commentHide,
                oldPriceHide: oldPriceHide
            };
            markersInfo.push(markerObj);
        });
    }

    collectMarkersInfo($('.flat_block'));

    var markersArray = [];

    function setMarkers(map, markers) {

        for (var i = 0; i < markers.length; i++) {
            var markerInfo = markers[i];
            var siteLatLng = new google.maps.LatLng(+markerInfo.lat, +markerInfo.lng);
            var marker = new google.maps.Marker({
                position: siteLatLng,
                map: map,
                icon: 'images/marker.png',
                adress: markerInfo.adress,
                photo: markerInfo.photo,
                price: markerInfo.price,
                oldPrice: markerInfo.oldPrice,
                roomsCount: markerInfo.roomsCount,
                bedsCount: markerInfo.bedsCount,
                commentsCount: markerInfo.commentsCount,
                cornerWord: markerInfo.cornerWord,
                buttonBookText: markerInfo.buttonBookText,
                buttonBookLink: markerInfo.buttonBookLink,
                buttonMoreText: markerInfo.buttonMoreText,
                buttonMoreLink: markerInfo.buttonMoreLink,
                commentsHide: markerInfo.commentsHide,
                oldPriceHide: markerInfo.oldPriceHide
            });

            markersArray.push(marker);

            google.maps.event.addListener(marker, "click", function() {
                // map.panTo(this.getPosition());
                infowindow.setContent('' +
                    '<style>' +
                    '.gm-style .gm-style-iw{overflow: visible;}' +
                    '.gm-style .gm-style-iw > div{overflow: visible!important;}' +
                    '.gm-style .gm-style-iw > div > div{overflow: visible!important;}' +
                    '</style>' +
                    '<div class="room-popup-inner">' +
                    '<div class="room-popup" style="background: url(' + this.photo + ') no-repeat center center">' +
                    '<div class="front">' +
                    '<div class="sticker">' +
                    '<span class="' + this.cornerWord + '"></span>' +
                    '</div>' +
                    '<div class="prices">' +
                    '<span class="' + this.oldPriceHide + '">' + this.oldPrice + '</span>' +
                    '<span>' + this.price + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="back">' +
                    '<div class="top-block">' +
                    '<div class="inform">' +
                    '<span class="title">' + this.adress + '</span>' +
                    '<div class="prices">' +
                    '<span class="' + this.oldPriceHide + '">' + this.oldPrice + '</span>' +
                    '<span>' + this.price + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="room-counts">' +
                    '<span class="num-rooms">' + this.roomsCount + '</span>' +
                    '<span class="num-beds">' + this.bedsCount + '</span>' +
                    '<span class="num-comments ' + this.commentsHide + '">' + this.commentsCount + '</span>' +
                    '</div>' +
                    '</div>' +
                    '<div class="bottom-block">' +
                    '<div class="buttons">' +
                    '<a href="' + this.buttonBookLink + '">' + this.buttonBookText + '</a>' +
                    '<a href="' + this.buttonMoreLink + '">' + this.buttonMoreText + '</a>' +
                    '</div>' +
                    '</div>' +
                    '</div>' +
                    '<div class="like_abs"><span class="like"></span></div>' +
                    '<span class="close">&#10005;</span>' +
                    '</div>' +
                    '</div>');
                infowindow.open(map, this);
                $('.gm-style-iw').prev().remove();
                $('.gm-style-iw').next().remove();
                $('.room-popup-inner .close').on('click', function() {
                    infowindow.close(map, this);
                    for (var j = 0; j < markersArray.length; j++) {
                        markersArray[j].setIcon('images/marker.png');
                    }
                });

                for (var j = 0; j < markersArray.length; j++) {
                    markersArray[j].setIcon('images/marker.png');
                }
                this.setIcon('images/marker-active.png');

                // google.maps.event.addListener(infowindow, "mouseout", function() {
                //     infowindow.close(map, this);
                // });
            });


            // google.maps.event.addListener(marker, "mouseout", function() {
            //     infowindow.close(map, this);
            // });
        }
    }


    //------------------конец переключатель на странице квартиры ---------------------//


    // -----------------начало перекидывания блоков на квартирах --------------------//
    $(window).on('load', function() {

        // - Noel Delgado | @pixelia_me


        var nodes = [];
        $('.flat_block_image2').each(function() {
            var obj = {};
            obj.me = $(this)[0];
            obj.child = $(this).find('.info_abs')[0];
            nodes.push(obj);
        });
        var _nodes = [].slice.call(nodes, 0);

        var getDirection = function(ev, obj, jqObj) {
            var w = obj.offsetWidth,
                h = obj.offsetHeight,
                x = (ev.pageX - jqObj.offset().left - (w / 2) * (w > h ? (h / w) : 1)),
                y = (ev.pageY - jqObj.offset().top - (h / 2) * (h > w ? (w / h) : 1)),
                d = Math.round(Math.atan2(y, x) / 1.57079633 + 5) % 4;
            return d;
        };

        var addClass = function(ev, obj, state, jqObj) {
            var direction = getDirection(ev, obj, jqObj),
                class_suffix = "";

            obj.className = "";

            switch (direction) {
                case 0:
                    class_suffix = '-top';
                    break;
                case 1:
                    class_suffix = '-right';
                    break;
                case 2:
                    class_suffix = '-bottom';
                    break;
                case 3:
                    class_suffix = '-left';
                    break;
            }

            obj.classList.add(state + class_suffix);
        };

        // bind events
        _nodes.forEach(function(el, index) {
            el.me.addEventListener('mouseenter', function(ev) {
                addClass(ev, el.child, 'in', $(this));
            }, false);

            el.me.addEventListener('mouseleave', function(ev) {
                addClass(ev, el.child, 'out', $(this));
            }, false);
        });
    });
    // -----------------конец перекидывания блоков на квартирах --------------------//


    // поп ап заказать звонок 

    $('footer ul li a.call').click(function(e) {
        e.preventDefault();
        $('.popup_callback').fadeIn(400);
        $("#overlay").show().css({ "opacity": "0.5", "display": "block" });
        canScroll = false;
    });

    $('.close_popup a').click(function(e) {
        e.preventDefault();
        $('.popup_callback').fadeOut(400);
        $("#overlay").show().css({ "opacity": "0", "display": "none" });
        canScroll = true;
    });

    // конец поп ап заказать звонок 

    // кнопка подробнее на странице карточка квартиры
    $('.hidden-info').hide();
    $('.read-more-trigger').click(function() {
        $(".hidden-info").fadeToggle();
        $(this).text(function(i, v) {
            return v === 'Свернуть' ? 'Подробнее' : 'Свернуть'
        })
    });

    // конец кнопка подробнее на странице карточка квартиры
    // страница кавартиры подгрузка блоков

    // var h = $(window).height();

    // $(window).bind('scroll', function() {

    //     var scrollFromTop = $(this).scrollTop();

    //     $(".col-lg-4.flat_block.flat_block_image2").each(function() {
    //         if ((scrollFromTop + h) >= $(this).offset().top + 200) {
    //             $(this).css({ 'top': 0 + 'px' })
    //         } else if ((scrollFromTop + h) <= $(this).offset().top + 200) {
    //             $(this).css({ 'top': 100 + 'px' })
    //         }

    //     })


    // });
    // конец страница кавартиры подгрузка блоков

    // ------------------------slider on page kartochka kvartiry -----------------------------------//

    $('.slider_kartochka_kvartiry').slick({
        dots: true,
        infinite: true,
        speed: 400,
        slidesToShow: 1,
        fade: true,
        cssEase: 'linear',
        autoplay: false,
        autoplaySpeed: 4000
    });

    //------------------------- end slider on page kartochka kvartiry -------------------------------//
    // ----------------------------------------------------------------//

    $(window).on("load", function() {
        if ($(".feedback").length > 0) {
            $(".feedback").mCustomScrollbar();
        }


        if ($(".main-page .checkboxes").length > 0){
            $(".main-page .checkboxes").mCustomScrollbar();
        }

        $(".scrolling").each(function() {
            $(this).mCustomScrollbar({
                scrollInertia: 100
            });
        })

    });


    //-------------------------------------------------------------//

    function parallax() {
        $('body,html').animate({
            scrollTop: $('#id' + z).offset().top + 'px'
        }, 1000, function() {
            can = true;
        })

    }

    var can = true;
    var z = 0;
    window.addEventListener('scrollDown', scrollToDown);

    window.addEventListener('scrollUp', scrollToTop);

    function scrollToDown(event) {
        event.preventDefault(event)
        console.log(1111);
        if (can) {
            can = false;
            z++
            parallax();

            $('#id' + z).addClass('active');
        }
    }

    function scrollToTop(event) {
        event.preventDefault(event)
        console.log(1111);
        if (can) {
            can = false;
            $('#id' + z).removeClass('active');
            z--
            z < 0 ? z = 0 : z = z
            parallax();

        }
    }

    // load map script

    function initialize() {

        // Create an array of styles.
        var styles = [{ "featureType": "administrative", "elementType": "all", "stylers": [{ "saturation": "-100" }] }, { "featureType": "administrative.province", "elementType": "all", "stylers": [{ "visibility": "off" }] }, { "featureType": "landscape", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": 65 }, { "visibility": "on" }] }, { "featureType": "poi", "elementType": "all", "stylers": [{ "saturation": -100 }, { "lightness": "50" }, { "visibility": "simplified" }] }, { "featureType": "road", "elementType": "all", "stylers": [{ "saturation": "-100" }] }, { "featureType": "road", "elementType": "geometry.fill", "stylers": [{ "visibility": "on" }, { "color": "#ffde17 " }] }, { "featureType": "road.highway", "elementType": "all", "stylers": [{ "visibility": "simplified" }] }, { "featureType": "road.arterial", "elementType": "all", "stylers": [{ "lightness": "30" }] }, { "featureType": "road.local", "elementType": "all", "stylers": [{ "lightness": "40" }] }, { "featureType": "transit", "elementType": "all", "stylers": [{ "saturation": -100 }, { "visibility": "simplified" }] }, { "featureType": "water", "elementType": "geometry", "stylers": [{ "hue": "#ffff00 " }, { "lightness": -25 }, { "saturation": -97 }] }, { "featureType": "water", "elementType": "labels", "stylers": [{ "lightness": -25 }, { "saturation": -100 }] }];



        // Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.
        var styledMap = new google.maps.StyledMapType(styles, { name: 'Styled Map' });

        // map tab4

        if ($("#tab4").length > 0) {


            var mapOptionsOne = {
                zoom: 14,
                mapTypeControl: false,
                center: new google.maps.LatLng(50.436634, 30.506283),
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            };

            var map = new google.maps.Map(document.getElementById('tab4'),
                mapOptionsOne);

            //Associate the styled map with the MapTypeId and set it to display.
            map.mapTypes.set('map_style', styledMap);
            map.setMapTypeId('map_style');


            var companyPos = new google.maps.LatLng(50.436634, 30.506283);
            var companyImage = new google.maps.MarkerImage('images/location.png');

            var marker_0 = new google.maps.Marker({
                position: companyPos,
                icon: companyImage,
                title: "0"
            });

            marker_0.setMap(map);

        }




        if ($("#map_contacts").length > 0) {



            var mapOptionsTwo = {
                zoom: 15,
                mapTypeControl: false,
                center: new google.maps.LatLng(50.4262685, 30.5427609),
                mapTypeControlOptions: {
                    mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
                }
            };
            var mapContacts = new google.maps.Map(document.getElementById('map_contacts'),
                mapOptionsTwo);
            //Associate the styled map with the MapTypeId and set it to display.
            mapContacts.mapTypes.set('map_style', styledMap);
            mapContacts.setMapTypeId('map_style');

            var contactsPos = new google.maps.LatLng(50.427116, 30.537053);
            var contactsImage = new google.maps.MarkerImage('images/location.png');

            var marker_1 = new google.maps.Marker({
                position: contactsPos,
                icon: contactsImage,
                title: "0"
            });

            marker_1.setMap(mapContacts);

        }

        // if ($("#map_kvartiry").length > 0) {



        //     var mapOptionsThree = {
        //         zoom: 14,
        //         mapTypeControl: false,
        //         center: new google.maps.LatLng(50.4436501, 30.517241),
        //         mapTypeControlOptions: {
        //             mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
        //         }
        //     };

        //     var mapKvartiry = new google.maps.Map(document.getElementById('map_kvartiry'),
        //         mapOptionsThree);
        //     //Associate the styled map with the MapTypeId and set it to display.
        //     mapKvartiry.mapTypes.set('map_style', styledMap);
        //     mapKvartiry.setMapTypeId('map_style');

        //     //--------marker 1------//

        //     var kvartiryPosOne = new google.maps.LatLng(50.4421196, 30.5067911);
        //     var kvartiryImage = new google.maps.MarkerImage('images/location.png');

        //     var marker_2 = new google.maps.Marker({
        //         position: kvartiryPosOne,
        //         icon: kvartiryImage,
        //         title: "0"
        //     });

        //     marker_2.setMap(mapKvartiry);

        // }



    }

    if ($("#tab4").length == 0) {
        google.maps.event.addDomListener(window, 'load', initialize);
    }




    //-------------- block with tabs страница карточка квартиры -------------------------------------------- //


    $('.tabgroup .block_toshow').hide();
    // $('.tabgroup div:first-of-type div.calendar_onflat').show(); // скрыть все табы кроме первой
    $('.tabgroup  div.calendar_onflat').show();
    $('.tabs a').click(function(e) {
        e.preventDefault();
        var $this = $(this),
            tabgroup = '#' + $this.parents('.tabs').data('tabgroup'),
            others = $this.closest('li').siblings().children('a'),
            target = $this.attr('href');
        others.removeClass('active');
        $this.addClass('active');
        $(tabgroup).find('.block_toshow').hide();
        $(target).show('400', function() {
            if ($(target).attr('id') == 'tab4' && $(target).find('div').length == 0) {
                initialize();
            }
        });
    });



    $('.wrap_tab .romb').click(function() {

        $(this).each(function() {
            $(this).siblings('.block_toshow').toggle(200);
            $(this).closest('.wrap_tab').toggleClass('active_block');
        });

        $(this).closest('.wrap_tab').siblings('.wrap_tab').each(function() {
            $(this).find('.block_toshow').hide('slow');
            $(this).removeClass('active_block');
        });

    });


    // $(".lines22").show(200);
    $(".but_border.select_1 button.select").click(function() {
        $("section.main").toggleClass('height_change');
        $(".container.one").fadeToggle(200);
        $(".lines22").fadeToggle(100);
    });

    $(".select_hide").click(function() {
        $(".container.one").hide(200);
        // $(".lines22").show(100);
    });





    //------------------begin daterangepicker --страница карточка квартиры-----------------------//
    if ($('#calendar_kartochka').length > 0){
        moment.locale('ru');
        var d = new Date(),

            day = d.getDate(),

            mounth = d.getMonth(),

            year = d.getFullYear();


        start = day + '/' + (mounth + 1) + '/' + year;
        var parent = $('.position_block');
        var parentTwo = $('.calendar_onflat');
        var parentThree = $('.make_position .calendar');

        $(function() {

            $('#calendar_kartochka').daterangepicker({
                locale: {
                    format: 'DD/MM/YYYY',
                    cancelLabel: 'Clear'
                },
                "autoApply": true,
                "autoUpdateInput": false,
                "startDate": start,
                "endDate": start,
                "buttonClasses": "my_button",
                "opens": "left",
                "applyClass": "my_button_success",
                "cancelClass": "my_button-default",
                "parentEl": parent,
            });

            $('#calendar_kartochka').on('apply.daterangepicker', function(ev, picker) {
                $(this).val(picker.startDate.format('MM/DD/YYYY') + ' - ' + picker.endDate.format('MM/DD/YYYY'));
            });

            $('#calendar_kartochka').on('cancel.daterangepicker', function(ev, picker) {
                $(this).val('');
            });


            $('#calendar_main_page').daterangepicker({
                locale: {
                    format: 'DD/MM/YYYY',
                    cancelLabel: 'Clear'
                },
                "autoApply": true,
                "autoUpdateInput": false,
                "startDate": start,
                "endDate": start,
                "buttonClasses": "my_button",
                "opens": "right",
                "applyClass": "my_button_success",
                "cancelClass": "my_button-default",
                "parentEl": parentThree,
            });

        });
    }

    //------------calendar on tabs--карточка квартиры-------------------//
    if ($('#datetimepicker').length > 0){
        $.datetimepicker.setLocale('ru');

        $('#datetimepicker').datetimepicker({
            timepicker: false,
            startDate: new Date(),
            format: 'd.m.Y',
            inline: true,
            lang: 'ru'
        });
    }

    //------------calendar on tabs---------------------//



    //------------------end daterangepicker --страница карточка квартиры-----------------------//


    // ------------------------show parallax block on page kartochka kvartiry -----------------------------------//

    // var h = $(window).height();


    // var kartochka = $('section.page_kartochka_kvartiry');

    // canFlow = true;
    // var percentToScroll;


    // kartochka.css({ 'position': 'fixed', 'bottom': -kartochka.height() + kartochka.height() / 6 + 'px' });
    // //  в цсс боди вогнать в оверфлоу хидден и убрать transition ы цсс с карточки
    // // $('body').css('overflow','hidden');
    // kartochka.css({ 'transition': 'all 0s' })

    // percentToScroll = $('html').height() / (kartochka.height() + kartochka.offset().top);

    // tovar();




    // function tovar() {
    //     $('.knopka').click(function() {
    //         $(this).toggleClass('clicked_button');
    //         kartochka.toggleClass('change_position');
    //         change_position();
    //     });


    //     function change_position() {
    //         if (kartochka.hasClass('change_position')) {
    //             canFlow = false;
    //             h = $(window).height;
    //             kartochka.css({
    //                 transform: 'translateY(' + 0 + 'px)',
    //                 'bottom': -kartochka.height() + 20 + 'px',
    //                 'transition': 'all .5s'
    //             });
    //         } else {
    //             canFlow = true;
    //             kartochka.css({ 'position': 'fixed', 'bottom': -kartochka.height() + kartochka.height() / 6 + 'px', 'transition': 'all .5s' });
    //             goToPos();
    //             setTimeout(function() {
    //                 kartochka.css({ 'transition': 'all 0s' })
    //             })
    //         }
    //     }
    //     var ofTop = $(document).scrollTop();

    //     window.addEventListener('mousewheel', function(e) {
    //         e.preventDefault(e);
    //         goToPos();
    //         ofTop = +ofTop + e.deltaY / 5;
    //     });

    //     function goToPos() {

    //         htmlHeight = $('html').height();

    //         ofTop > htmlHeight ? ofTop = htmlHeight : ''
    //         ofTop < 0 ? ofTop = 0 : ''

    //         kartochkaOffsetTop = kartochka.offset().top;
    //         kartochkaHeight = kartochka.height();

    //         $('html, body').animate({
    //             scrollTop: ofTop + 'px'
    //         }, 10);

    //         if (!canFlow) {
    //             return; }
    //         kartochka.css({
    //             transform: 'translateY(' + -ofTop * (1 + (percentToScroll)) + 'px)'
    //         });
    //         // console.log(percentToScroll);
    //     }
    //     goToPos()

    // }

    //------------------------- end show parallax block on page kartochka kvartiry -------------------------------//

});


if ($('.apartments-page').length > 0) {

    // SKROLLR

    function skrollr_init() {
        skrollrInstance = skrollr.init({
            forceHeight: false,
            smoothScrolling: true,
        });
    }

    var scroll_token = null;

    function bodyheight() {
        var bh = $('.scroll-front').outerHeight();
        var wh = $(window).outerHeight();
        var sliderHeight = $('.slider_page_kartochka_kvartiry').outerHeight();
        var elemMarginTop = $('.page_kartochka_kvartiry').css('margin-top').slice(0, -2);
        // var toscroll = bh - wh - elemMarginTop + 400;
        var toscroll = bh - wh;
        var backToScroll = sliderHeight - wh;
        $('.scroll-front').removeAttr("data-" + scroll_token);
        $('.header-front').removeAttr("data-" + scroll_token);
        $('.slider_kartochka_kvartiry > button').removeAttr("data-" + scroll_token);
        $('.back-front').removeAttr("data-" + scroll_token);
        $('.scroll-front').attr("data-" + toscroll, "transform: translateY(-" + toscroll + "px)");
        $('.header-front').attr("data-" + toscroll, "transform: translateY(-" + toscroll + "px)");
        $('.slider_kartochka_kvartiry > button').attr("data-start", "transform: translateY(0px)");
        $('.slider_kartochka_kvartiry > button').attr("data-" + toscroll, "transform: translateY(-" + toscroll + "px)");
        $('.scroll-back').attr("data-" + 20 + 'p', "transform: translateY(-" + backToScroll * 0.8 + "px)");
        $('.scroll-back').attr("data-" + toscroll, "transform: translateY(-" + backToScroll + "px)");
        scroll_token = toscroll;
        $('body').height(bh);
    }

    $('.apartments-page .knopka').click(function() {
        if ($(this).hasClass('active')) {
            $('.apartments-page .scroll-front').css('transition', '.3s linear');
            setTimeout(function() {
                $('.apartments-page .scroll-front').css('transition', '0s linear');
            }, 500);
        }
        $(this).toggleClass('active');
        $('.wrapper-block .wrapper').toggleClass('hideRooms');
    });

    // RESIZE

    $(window).on('load', function() {
        $('section.slider_page_kartochka_kvartiry .slick-dots').appendTo('.wrapper-block .wrapper');
        setTimeout(function() {
            // $('.slider_kartochka_kvartiry').slick('setPosition');
            bodyheight();
            skrollr_init();
            menuInvertColor();
        }, 500);
    });
    $(window).on('resize', function() {
        menuInvertColor();
        bodyheight();
        skrollrInstance.refresh();
    });
    $(window).on('scroll', function() {
        menuInvertColor();
    });


    function menuInvertColor() {
        var windowPos = $(window).scrollTop();
        var changePos = $('.page_kartochka_kvartiry').css('margin-top').slice(0, -2);
        if (!$('.wrapper-block > .wrapper').hasClass('hideRooms')) {
            if (windowPos > changePos) {
                $('.apartments-page .menu').addClass('underblue');
            } else {
                $('.apartments-page .menu').removeClass('underblue');
            }
        }
    }

}



//--------------------------------------begin--sort flats ------------------------------------------------//

// Custom sorting plugin
    $(document).ready(function() {
            (function($) {
                $.fn.sorted = function(customOptions) {
                    var options = {
                        reversed: false,
                        by: function(a) {
                            return a.text(); }
                    };
                    $.extend(options, customOptions);
                    $data = $(this);
                    arr = $data.get();
                    arr.sort(function(a, b) {
                        var valA = options.by($(a));
                        var valB = options.by($(b));
                        if (options.reversed) {
                            return (valA < valB) ? 1 : (valA > valB) ? -1 : 0;
                        } else {
                            return (valA < valB) ? -1 : (valA > valB) ? 1 : 0;
                        }
                    });
                    return $(arr);
                };
            });


        });
            // DOMContentLoaded
            $(function() {

                // bind radiobuttons in the form
                var $filterType = $('#filter input[name="type"]');
                var $filterSort = $('#filter input[name="sort"]');

                // get the first collection
                var $applications = $('#applications');

                // clone applications to get a second collection
                var $data = $applications.clone();

                // attempt to call Quicksand on every form change
                $filterType.add($filterSort).change(function(e) {
                    if ($($filterType + ':checked').val() == 'all') {
                        var $filteredData = $data.find('li');
                    } else {
                        var $filteredData = $data.find('li[data-type=' + $($filterType + ":checked").val() + ']');
                    }

                    // if sorted by size
                    if ($('#filter input[name="sort"]:checked').val() == "size") {
                        var $sortedData = $filteredData.sorted({
                            by: function(v) {
                                return parseFloat($(v).find('span[data-type=size]').text());
                            }
                        });
                    } else {
                        // if sorted by name
                        var $sortedData = $filteredData.sorted({
                            by: function(v) {
                                return $(v).find('strong').text().toLowerCase();
                            }
                        });
                    }

                    // finally, call quicksand
                    $applications.quicksand($sortedData, {
                        duration: 800,
                        easing: 'easeInOutQuad'
                    });

                });

            });


//--------------------------------------end--sort flats ------------------------------------------------//
