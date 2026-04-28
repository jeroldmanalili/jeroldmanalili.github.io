/* ===================================================================
 * Hola - Main JS
 *
 * ------------------------------------------------------------------- */

(function($) {

    "use strict";

    var cfg = {
        scrollDuration : 800, // smoothscroll duration
        mailChimpURL   : ''   // mailchimp url
    },

    $WIN = $(window);

    // Add the User Agent to the <html>
    // will be used for IE10 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0))
    var doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);


    /* Preloader
     * -------------------------------------------------- */
    var ssPreloader = function() {

        $("html").addClass('ss-preload');

        $WIN.on('load', function() {

            // force page scroll position to top at page refresh
            // $('html, body').animate({ scrollTop: 0 }, 'normal');

            // will first fade out the loading animation 
            $("#loader").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('ss-preload');
            $("html").addClass('ss-loaded');
        
        });
    };


    /* pretty print
     * -------------------------------------------------- */
    var ssPrettyPrint = function() {
        $('pre').addClass('prettyprint');
        $( document ).ready(function() {
            prettyPrint();
        });
    };


    /* Move header
     * -------------------------------------------------- */
    var ssMoveHeader = function () {

        var hero = $('.page-hero'),
            hdr = $('header'),
            triggerHeight = hero.outerHeight() - 170;


        $WIN.on('scroll', function () {

            var loc = $WIN.scrollTop();

            if (loc > triggerHeight) {
                hdr.addClass('sticky');
            } else {
                hdr.removeClass('sticky');
            }

            if (loc > triggerHeight + 20) {
                hdr.addClass('offset');
            } else {
                hdr.removeClass('offset');
            }

            if (loc > triggerHeight + 150) {
                hdr.addClass('scrolling');
            } else {
                hdr.removeClass('scrolling');
            }

        });

        // $WIN.on('resize', function() {
        //     if ($WIN.width() <= 768) {
        //             hdr.removeClass('sticky offset scrolling');
        //     }
        // });

    };


    /* Mobile Menu
     * ---------------------------------------------------- */ 
    var ssMobileMenu = function() {

        var toggleButton = $('.header-menu-toggle'),
            nav = $('.header-nav-wrap');

        toggleButton.on('click', function(event){
            event.preventDefault();

            toggleButton.toggleClass('is-clicked');
            nav.slideToggle();
        });

        if (toggleButton.is(':visible')) nav.addClass('mobile');

        $WIN.on('resize', function() {
            if (toggleButton.is(':visible')) nav.addClass('mobile');
            else nav.removeClass('mobile');
        });

        nav.find('a').on("click", function() {

            if (nav.hasClass('mobile')) {
                toggleButton.toggleClass('is-clicked');
                nav.slideToggle(); 
            }
        });

    };


    /* Masonry
     * ---------------------------------------------------- */ 
    var ssMasonryFolio = function () {

        var containerBricks = $('.masonry');

        containerBricks.imagesLoaded(function () {
            containerBricks.masonry({
                itemSelector: '.masonry__brick',
                resize: true
            });
        });
    };


    /* Tabs
* ---------------------------------------------------- */
var ssTabs = function(nextTab = false) {

    var $tabList = $('.tab-nav__list'),
        $tabItems = $tabList.find('li'),
        $tabPanels = $('.tab-content__item');

    if (!$tabList.length || !$tabItems.length || !$tabPanels.length) return;

    var tabLinks = [];

    // Initialize tabs
    $tabItems.each(function(i) {
        var $item = $(this),
            $link = $item.find('a');

        if (!$link.length) return;

        tabLinks.push($link);

        // Accessibility roles
        $item.attr('role', 'presentation');
        $link.attr({
            'role': 'tab',
            'aria-controls': $link.attr('href').substring(1),
            'tabindex': i === 0 ? '0' : '-1',
            'aria-selected': i === 0 ? 'true' : 'false'
        });

        if (i === 0) {
            $item.attr('data-tab-active', '');
            $tabPanels.eq(i).attr({
                'data-tab-active': '',
                'aria-hidden': 'false'
            });
        } else {
            $tabPanels.eq(i).attr('aria-hidden', 'true');
        }

        // Click event
        $link.on('click', function(e) {
            e.preventDefault();
            activateTab(i);
        });

        // Keyboard navigation
        $link.on('keydown', function(e) {
            switch (e.key) {
                case 'ArrowRight':
                    e.preventDefault();
                    var next = tabLinks[i + 1] || tabLinks[0];
                    next.focus();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    var prev = tabLinks[i - 1] || tabLinks[tabLinks.length - 1];
                    prev.focus();
                    break;
                case 'Enter':
                case ' ':
                    e.preventDefault();
                    activateTab(i);
                    break;
            }
        });
    });

    // Activate a tab
    function activateTab(index) {
        tabLinks.forEach(function($link, i) {
            $link.attr({
                'tabindex': '-1',
                'aria-selected': 'false'
            });
            $link.parent().removeAttr('data-tab-active');
            $tabPanels.eq(i).removeAttr('data-tab-active').attr('aria-hidden', 'true');
        });

        // Activate selected
        var $activeLink = tabLinks[index];
        $activeLink.attr({
            'tabindex': '0',
            'aria-selected': 'true'
        });
        $activeLink.parent().attr('data-tab-active', '');
        $tabPanels.eq(index).attr({
            'data-tab-active': '',
            'aria-hidden': 'false'
        });

        // Trigger resize if needed
        $(window).trigger('resize');
    }

};

// Initialize tabs safely after DOM is ready
$(document).ready(function() {
    ssTabs(true);
});


    /* photoswipe
     * ----------------------------------------------------- */
    var ssPhotoswipe = function() {
        var items = [],
            $pswp = $('.pswp')[0],
            $folioItems = $('.item-folio');

            // get items
            $folioItems.each( function(i) {

                var $folio = $(this),
                    $thumbLink =  $folio.find('.thumb-link'),
                    $title = $folio.find('.item-folio__title'),
                    $caption = $folio.find('.item-folio__caption'),
                    $titleText = '<h4>' + $.trim($title.html()) + '</h4>',
                    $captionText = $.trim($caption.html()),
                    $href = $thumbLink.attr('href'),
                    $size = $thumbLink.data('size').split('x'),
                    $width  = $size[0],
                    $height = $size[1];
         
                var item = {
                    src  : $href,
                    w    : $width,
                    h    : $height
                }

                if ($caption.length > 0) {
                    item.title = $.trim($titleText + $captionText);
                }

                items.push(item);
            });

            // bind click event
            $folioItems.each(function(i) {

                $(this).on('click', function(e) {
                    e.preventDefault();
                    var options = {
                        index: i,
                        showHideOpacity: true
                    }

                    // initialize PhotoSwipe
                    var lightBox = new PhotoSwipe($pswp, PhotoSwipeUI_Default, items, options);
                    lightBox.init();
                });

            });

    };


    /* slick slider
     * ------------------------------------------------------ */
    var ssSlickSlider = function() {
        
        $('.testimonials__slider').slick({
            arrows: true,
            dots: false,
            infinite: true,
            slidesToShow: 2,
            slidesToScroll: 1,
            prevArrow: "<div class=\'slick-prev\'><i class=\'im im-arrow-left\' aria-hidden=\'true\'></i></div>",
            nextArrow: "<div class=\'slick-next\'><i class=\'im im-arrow-right\' aria-hidden=\'true\'></i></div>",       
            pauseOnFocus: false,
            autoplaySpeed: 1500,
            responsive: [
                {
                    breakpoint: 900,
                    settings: {
                        slidesToShow: 1,
                        slidesToScroll: 1
                    }
                }
            ]
        });

    };


    /* Highlight the current section in the navigation bar
     * ------------------------------------------------------ */
    var ssWaypoints = function() {

        var sections = $(".target-section"),
            navigation_links = $(".header-nav li a");

        sections.waypoint( {

            handler: function(direction) {

                var active_section;

                active_section = $('section#' + this.element.id);

                if (direction === "up") active_section = active_section.prevAll(".target-section").first();

                var active_link = $('.header-nav li a[href="#' + active_section.attr("id") + '"]');

                navigation_links.parent().removeClass("current");
                active_link.parent().addClass("current");

            },

            offset: '25%'

        });
        
    };


   /* Stat Counter
    * ------------------------------------------------------ */
    var ssStatCount = function() {

        var statSection = $(".s-stats"),
        stats = $(".stats__count");

        statSection.waypoint({

            handler: function(direction) {

                if (direction === "down") {

                    stats.each(function () {
                        var $this = $(this);

                        $({ Counter: 0 }).animate({ Counter: $this.text() }, {
                            duration: 4000,
                            easing: 'swing',
                            step: function (curValue) {
                                $this.text(Math.ceil(curValue));
                            }
                        });
                    });

                } 

                // trigger once only
                this.destroy();

            },

            offset: "90%"

        });
    };


   /* Smooth Scrolling
    * ------------------------------------------------------ */
    var ssSmoothScroll = function() {

        $('.smoothscroll').on('click', function (e) {
            var target = this.hash,
            $target    = $(target);
        
            e.preventDefault();
            e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, cfg.scrollDuration, 'swing', function () {
                window.location.hash = target;
            });

        });
    };


    /* Placeholder Plugin Settings
     * ------------------------------------------------------ */
    var ssPlaceholder = function() {
        $('input, textarea, select').placeholder();  
    };


    /* Alert Boxes
     * ------------------------------------------------------ */
    var ssAlertBoxes = function() {

        $('.alert-box').on('click', '.alert-box__close', function() {
            $(this).parent().fadeOut(500);
        }); 

    };


    /* Contact Form
     * ------------------------------------------------------ */
    var ssContactForm = function() {

        /* local validation */
	    $('#contactForm').validate({
        
            /* submit via ajax */
            submitHandler: function(form) {
    
                var sLoader = $('.submit-loader');
    
                $.ajax({
    
                    type: "POST",
                    url: "inc/sendEmail.php",
                    data: $(form).serialize(),
                    beforeSend: function() { 
    
                        sLoader.slideDown("slow");
    
                    },
                    success: function(msg) {
    
                        // Message was sent
                        if (msg == 'OK') {
                            sLoader.slideUp("slow"); 
                            $('.message-warning').fadeOut();
                            $('#contactForm').fadeOut();
                            $('.message-success').fadeIn();
                        }
                        // There was an error
                        else {
                            sLoader.slideUp("slow"); 
                            $('.message-warning').html(msg);
                            $('.message-warning').slideDown("slow");
                        }
    
                    },
                    error: function() {
    
                        sLoader.slideUp("slow"); 
                        $('.message-warning').html("Something went wrong. Please try again.");
                        $('.message-warning').slideDown("slow");
    
                    }
    
                });
            }
    
        });
    };


   /* Back to Top
    * ------------------------------------------------------ */
    var ssBackToTop = function() {

        var pxShow  = 500,   // height on which the button will show
        fadeInTime  = 400,   // how slow/fast you want the button to show
        fadeOutTime = 400,   // how slow/fast you want the button to hide
        scrollSpeed = 300,   // how slow/fast you want the button to scroll to top. can be a value, 'slow', 'normal' or 'fast'
        goTopButton = $(".go-top")

        // Show or hide the sticky footer button
        $(window).on('scroll', function() {
            if ($(window).scrollTop() >= pxShow) {
                goTopButton.fadeIn(fadeInTime);
            } else {
                goTopButton.fadeOut(fadeOutTime);
            }
        });
    };

    /* FLUID
    * ------------------------------------------------------ */

    jQuery(document).ready(function( $ ){


    const t1 = gsap.timeline({ repeat: -1 });
const t2 = gsap.timeline({ repeat: -1, repeatDelay: 1 });

const imgContainer = document.getElementsByClassName(".img-container")[0];

const extraDistort = document.getElementById("extra-turbulence");
const imgDisplMap = document.getElementById("displ-map");

//Side cover distort
t1.to(extraDistort, {
  attr: {
    baseFrequency: 0.036
  },
  duration: 12
}).to(extraDistort, {
  attr: {
    baseFrequency: 0.03
  },
  duration: 12
});

//Image distort
t2.to(imgDisplMap, {
  attr: {
    scale: 40
  },
  duration: 1.2
})
  .to(imgDisplMap, {
    attr: {
      scale: 0
    },
    duration: 0.4
  })
  .to(imgDisplMap, {
    attr: {
      scale: -30
    },
    duration: 1
  })
  .to(imgDisplMap, {
    attr: {
      scale: 0
    },
    duration: 1
  });

  });

// Media query object
  const mediaQuery = window.matchMedia("(max-width: 900px)");

  // Function to update both images
  function updateImages(e) {
    const img1 = document.getElementById('jerold-img');
    const img2 = document.getElementById('main-img');

    if (e.matches) {
      // Small screen images
      img1.src = "images/hero-bg-2.png";
      img2.src = "images/hero-bg.jpg";
    } else {
      // Large screen images
      img1.src = "images/hero-bg-2.png";
      img2.src = "images/hero-bg.jpg";
    }
  }

  // Listen for changes in screen size
  mediaQuery.addEventListener('change', updateImages);

  // Initial check on page load
  updateImages(mediaQuery);


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssPrettyPrint();
        ssMoveHeader();
        ssMobileMenu();
        ssMasonryFolio();
        ssPhotoswipe();
        ssSlickSlider();
        ssWaypoints();
        ssStatCount();
        ssSmoothScroll();
        ssPlaceholder();
        ssAlertBoxes();
        ssContactForm();
        ssBackToTop();

    })();


})(jQuery);