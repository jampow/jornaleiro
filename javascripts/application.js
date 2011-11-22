      var jQT = $.jQTouch({
          addGlossToIcon: true,
          icon          : '/images/logo_g.png',
          startupScreen : '/images/startup.png',
          preloadImages: [
          //  'themes/apple/img/activeButton.png',
            'themes/apple/img/backButton.png',
          //  'themes/apple/img/cancel.png',
            'themes/apple/img/chevron.png',
          //  'themes/apple/img/grayButton.png',
          //  'themes/apple/img/greenButton.png',
          //  'themes/apple/img/listArrowSel.png',
          //  'themes/apple/img/listGroup.png',
          //  'themes/apple/img/loading.gif',
          //  'themes/apple/img/on_off.png',
            'themes/apple/img/pinstripes.png',
          //  'themes/apple/img/redButton.png',
          //  'themes/apple/img/selection.png',
          //  'themes/apple/img/thumb.png',
          //  'themes/apple/img/toggleOn.png',
          //  'themes/apple/img/toggle.png',
            'themes/apple/img/toolbar.png',
            'themes/apple/img/toolButton.png',
          //  'themes/apple/img/whiteButton.png',
            'images/logo_metro_p.png',
            'images/logo_destak_p.png'
          ]
      });

      var url = {
        metro:  function(){
          var loc  = local.get('metro');
          var date = url.timestamp();
          return "http://publimetro.band.com.br/pdf/"+date+"_metro"+loc+".pdf";
        },
        destak: function(){
          var loc  = local.get('destak');
          var date = url.timestamp();
          return "http://www.destakjornal.com.br/pdfedition/"+date+loc+".pdf";
        },
        timestamp: function(){
          var today = new Date();
          var y = '' + today.getFullYear();
          var m = '' + (today.getMonth() + 1);
          var d = '' + today.getDate();
          return y+m+d;
        }
      };

      var local = {
        get: function(journal) {
          return localStorage.getItem(journal);
        },
        set: function(journal, local) {
          return localStorage.setItem(journal, local);
        }
      };

      var init = {
        enabledHide:  true,
        disabledHide: false,
        setInitialValues: function(){
          for (i=0; i<=localStorage.length-1; i++) {
            key = localStorage.key(i);
            val = local.get(key);
            console.log(key + ' - ' + val);
            $('option[value='+val+']', '#'+key+'_local').attr('selected','selected');
          }
        },
        onLineStatus: function(){
          return window.navigator.onLine;
        },
        toggleLinks: function(){
          if (window.navigator.onLine) {
            $('.enabled').show();
            $('.disabled').hide();
          } else {
            $('.enabled').hide();
            $('.disabled').show();
          }
        }
      };

      $(function(){
        $('select').change(function(){
          var t       = $(this);
          var journal = t.attr('name');
          var loc     = t.val();
          local.set(journal, loc);
          $('#'+journal).attr('href', eval('url.'+journal+'()'));
        });

        $('#metro' ).attr('href', url.metro() );
        $('#destak').attr('href', url.destak());

        init.setInitialValues();
        init.toggleLinks();
      });

