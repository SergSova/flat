$(document).ready(function(){

  $('a.additional').click(function(){
     $('.container.one').addClass('show');
     $('.row.show_add').fadeIn("slow");
  });
  $('.row.show_add a.additional').click(function(){
     $('.container.one').removeClass('show');
     $('.row.show_add').fadeOut("slow");
  });

// страница карточка квартиры кнопка смотреть еще

    $('span.look-more').click(function(){
    $('.ydobstva > ul.comfort-2').addClass('show-list');
    $('span.look-more').fadeOut(100);
    $('span.look-more-2').fadeIn(300);
  });

    $('span.look-more-2').click(function(){
    $('.ydobstva > ul.comfort-2').removeClass('show-list');
    $('span.look-more').fadeIn(300);
    $('span.look-more-2').fadeOut(100);
  });

// конец страница карточка квартиры кнопка смотреть еще

//---------------------------------strat burger click ----------------------------//

    $('.burger').click(function(){
    $('header').toggleClass('active_nav');

    });

//---------------------------------end burger click ------------------------------//

//---------------------------------strat number click ----------------------------//

    $('.call_right p.call img').click(function(){
    $('.call_right p.call.clhide').fadeToggle(200);

    });

//---------------------------------end number click ------------------------------//

  $('.make_position button').click(function() {
    $(this).toggleClass('active');
  });

   //------------------------- start dropdown filtr with checkbox -------------------------------//

     
       $(".selectBox").click(function() {

           $(this).closest(".choose4").siblings('.choose4').each(function() {
           $(this).find('.checkboxes').fadeOut('200');
         });

            $(this).siblings(".checkboxes").fadeToggle(200);


        });


  //------------------------- dropdown filtr with checkbox end -------------------------------//
  //-------------------------всплывающий текс страница правила -----------------------------------------------------//

  $('.text_show h3').click(function(){
    $(this).toggleClass('clicked');
        $(this).siblings('p').toggle('slow');

        $(this).closest('.text_shown').siblings('.text_shown').each(function() {
             $(this).find('.text_show h3').removeClass('clicked').siblings('p').hide('slow');
         });
    });


  //---------------------------все (11) страница правила---------------------------------------------------//

     $('.text-shown_wrapper').each(function() {

      var hiddenChildrenCount = $(this).find('.text_shown').length - 3;
      $(this).append('<a href="javascript:void(0)" class="showall"> Все ('+ hiddenChildrenCount +')</a>');
      $(this).append('<a href="javascript:void(0)" class="showallhide" style="margin-left: 40px;"> Свернуть</a>');
      $(this).find('.showallhide').hide();

          $(this).find('.text_shown').each(function(index) {
            if(index > 2) {
              $(this).hide('400');
            }
          });
        });


        $('a.showall').click(function() {
        $(this).closest('.text-shown_wrapper').find('.text_shown').show('300');
          $(this).hide();
          $(this).closest('.text-shown_wrapper').find('.showallhide').show();
        });

        $('a.showallhide').click(function() {
          $(this).hide();
          $(this).closest('.text-shown_wrapper').find('.showall').show();
            $(this).closest('.text-shown_wrapper').find('.text_shown').each(function(index) {
            if(index > 2) {
              $(this).hide('400');
            }
          });

          });
  //-------------------------------- конец все (11) страница правила-----------------------------------------//

          
     
    


   // слайдер на странице квартиры

    $('.slick_flat_slider').slick({
         
   });


  // конец слайдер на странице квартиры


   // слайдер на странице сервис

    $('.slider_servis_wrapper').slick({
         
   });


  // конец слайдер на странице сервис
 // слайдер на странице туристам

    $('.slider_turistam_wrapper').slick({
         
   });


  // конец слайдер на странице туристам

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
    $('.read-more-trigger').click(function(){
      $(".hidden-info").fadeToggle();
      $(this).text(function(i, v){
        return v === 'Свернуть' ? 'Подробнее' : 'Свернуть'
        })
      });

  // конец кнопка подробнее на странице карточка квартиры
  // страница кавартиры подгрузка блоков

      var  h = $(window).height();

      $(window).bind('scroll', function() {

        var scrollFromTop = $(this).scrollTop();

        $(".col-lg-4.flat_block.flat_block_image2").each(function () {
          if ( (scrollFromTop + h) >= $(this).offset().top + 200) {
        $(this).css({'top':0+'px'})
       }else if ( (scrollFromTop + h) <= $(this).offset().top + 200) {
        $(this).css({'top':100+'px'})
       }

      })


  });
   // конец страница кавартиры подгрузка блоков

  // ------------------------slider on page kartochka kvartiry -----------------------------------//

       $('.slider_kartochka_kvartiry').slick({
          dots:true,
          infinite: true,
          speed: 400,
          slidesToShow: 1,
          fade: true,
          cssEase: 'linear',
          autoplay: false,
          autoplaySpeed: 4000
      });

  //------------------------- end slider on page kartochka kvartiry -------------------------------//
  // ------------------------show parallax block on page kartochka kvartiry -----------------------------------//

        var  h = $(window).height();


var kartochka = $('section.page_kartochka_kvartiry'); 

    canFlow = true;
var percentToScroll;
    
if (kartochka.length > 0){
     kartochka.css({'position':'fixed', 'bottom': -kartochka.height() + kartochka.height()/6 + 'px'});
     //  в цсс боди вогнать в оверфлоу хидден и убрать transition ы цсс с карточки
     // $('body').css('overflow','hidden');
      kartochka.css({'transition':'all 0s'})

      percentToScroll = $('html').height() / (kartochka.height() + kartochka.offset().top);

      tovar();
} 



function tovar() {
  $('.knopka').click(function(){
      $(this).toggleClass('clicked_button');
      kartochka.toggleClass('change_position');
      change_position();
    }); 

  
  function change_position(){
      if(kartochka.hasClass('change_position')){
        canFlow = false;
        h = $(window).height;
        kartochka.css({
          transform: 'translateY('+ 0   +'px)', 'bottom': -kartochka.height() + 20   + 'px','transition':'all .5s'
        });
      }else {
        canFlow = true;
        kartochka.css({'position':'fixed', 'bottom': -kartochka.height() + kartochka.height()/6 + 'px','transition':'all .5s'});
        goToPos();
        setTimeout(function(){
          kartochka.css({'transition':'all 0s'})
        })
      }
  } 
  var ofTop = $(document).scrollTop();
  
  window.addEventListener('mousewheel',function(e){
      e.preventDefault(e);
      goToPos();
      ofTop = +ofTop + e.deltaY/5;
  });
 
  function goToPos(){
      
      htmlHeight = $('html').height();
      
      ofTop > htmlHeight ? ofTop = htmlHeight : '' 
      ofTop < 0 ? ofTop = 0 : '' 

      kartochkaOffsetTop = kartochka.offset().top;
      kartochkaHeight = kartochka.height();
      
      $('html, body').animate({
        scrollTop:  ofTop + 'px'
      },10);

      if(!canFlow){ return;}
      kartochka.css({
        transform: 'translateY('+ -ofTop *( 1+ (percentToScroll)) +'px)'
      });
// console.log(percentToScroll);
  }goToPos()

}

  //------------------------- end show parallax block on page kartochka kvartiry -------------------------------//

  

  // ----------------------------------------------------------------//

    $(window).on("load",function(){
      if( $(".feedback").length > 0 ) {
          $(".feedback").mCustomScrollbar();
        }
            
        });

       $(window).on("load",function(){
          $(".checkboxes").mCustomScrollbar();
        });

  //-------------------------------------------------------------//


        function parallax(){
        var scrolled = $(window).scrollTop();
        console.log(scrolled);
        $('.page_rules_wrapper').css('top',(scrolled*2)+'px');
      }
        $(window).scroll(function(e){
           parallax();
           });
 // load map script

    function initialize() {

        // Create an array of styles.
        var styles =   [{"featureType":"administrative","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"administrative.province","elementType":"all","stylers":[{"visibility":"off"}]},{"featureType":"landscape","elementType":"all","stylers":[{"saturation":-100},{"lightness":65},{"visibility":"on"}]},{"featureType":"poi","elementType":"all","stylers":[{"saturation":-100},{"lightness":"50"},{"visibility":"simplified"}]},{"featureType":"road","elementType":"all","stylers":[{"saturation":"-100"}]},{"featureType":"road","elementType":"geometry.fill","stylers":[{"visibility":"on"},{"color":"#ffde17 "}]},{"featureType":"road.highway","elementType":"all","stylers":[{"visibility":"simplified"}]},{"featureType":"road.arterial","elementType":"all","stylers":[{"lightness":"30"}]},{"featureType":"road.local","elementType":"all","stylers":[{"lightness":"40"}]},{"featureType":"transit","elementType":"all","stylers":[{"saturation":-100},{"visibility":"simplified"}]},{"featureType":"water","elementType":"geometry","stylers":[{"hue":"#ffff00 "},{"lightness":-25},{"saturation":-97}]},{"featureType":"water","elementType":"labels","stylers":[{"lightness":-25},{"saturation":-100}]}];



// Create a new StyledMapType object, passing it the array of styles,
        // as well as the name to be displayed on the map type control.
        var styledMap = new google.maps.StyledMapType(styles,
            {name: 'Styled Map'});

        // map tab4

        if($("#tab4").length > 0 ){


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

         var marker_0 = new google.maps.Marker(
              {
                  position: companyPos, 
                  icon: companyImage,
                  title:"0"
              }
          );

           marker_0.setMap(map);

        }




        if($("#map_contacts").length > 0 ){
            


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

         var marker_1 = new google.maps.Marker(
              {
                  position: contactsPos, 
                  icon: contactsImage,
                  title:"0"
              }
          );

           marker_1.setMap(mapContacts);

        }

          if($("#map_kvartiry").length > 0 ){
            


         var mapOptionsThree = {
            zoom: 14,
            mapTypeControl: false,
            center: new google.maps.LatLng(50.4436501, 30.517241),
            mapTypeControlOptions: {
                mapTypeIds: [google.maps.MapTypeId.ROADMAP, 'map_style']
            }
        };

        var mapKvartiry = new google.maps.Map(document.getElementById('map_kvartiry'),
           mapOptionsThree);
        //Associate the styled map with the MapTypeId and set it to display.
        mapKvartiry.mapTypes.set('map_style', styledMap);
        mapKvartiry.setMapTypeId('map_style');

        //--------marker 1------//

         var kvartiryPosOne = new google.maps.LatLng(50.4421196, 30.5067911);
         var kvartiryImage = new google.maps.MarkerImage('images/location.png');

         var marker_2 = new google.maps.Marker(
              {
                  position: kvartiryPosOne, 
                  icon: kvartiryImage,
                  title:"0"
              }
          );

           marker_2.setMap(mapKvartiry);

        }



   }

   if($("#tab4").length == 0 ){
    google.maps.event.addDomListener(window, 'load', initialize);
  }




//-------------- block with tabs страница карточка квартиры -------------------------------------------- //

    $('.tabgroup > div').hide();
    $('.tabgroup > div:first-of-type').show();
    $('.tabs a').click(function(e){
      e.preventDefault();
        var $this = $(this),
            tabgroup = '#'+$this.parents('.tabs').data('tabgroup'),
            others = $this.closest('li').siblings().children('a'),
            target = $this.attr('href');
        others.removeClass('active');
        $this.addClass('active');
        $(tabgroup).children('div').hide();
        $(target).show('400', function() {
          if ($(target).attr('id') == 'tab4' && $(target).find('div').length == 0){
            initialize();
          }
        });
      
    });
    



});





