var jQT = $.jQTouch({
    addGlossToIcon: true,
    icon          : '/images/logo_g.png',
    startupScreen : '/images/startup.png',
    preloadImages: [
    //  '/themes/apple/img/activeButton.png',
      '/themes/apple/img/backButton.png',
    //  '/themes/apple/img/cancel.png',
      '/themes/apple/img/chevron.png',
    //  '/themes/apple/img/grayButton.png',
    //  '/themes/apple/img/greenButton.png',
    //  '/themes/apple/img/listArrowSel.png',
    //  '/themes/apple/img/listGroup.png',
    //  '/themes/apple/img/loading.gif',
    //  '/themes/apple/img/on_off.png',
      '/themes/apple/img/pinstripes.png',
    //  '/themes/apple/img/redButton.png',
    //  '/themes/apple/img/selection.png',
    //  '/themes/apple/img/thumb.png',
    //  '/themes/apple/img/toggleOn.png',
    //  '/themes/apple/img/toggle.png',
      '/themes/apple/img/toolbar.png',
      '/themes/apple/img/toolButton.png',
    //  '/themes/apple/img/whiteButton.png',
      '/images/logo_metro_p.png',
      '/images/logo_destak_p.png',
      '/images/gear.png'
    ]
});

var storage = {
  version: "3.0.0",
  get: function(journal) {
    return JSON.parse(localStorage.getItem(journal));
  },
  set: function(journal, obj) {
    return localStorage.setItem(journal, JSON.stringify(obj));
  },
  
  getLocal: function(journal) {
    var oJournal = storage.get(journal);
    return oJournal.local;
  },
  
  getUrl: function(journal) {
    var oJournal = storage.get(journal);
    return oJournal.url;
  }
};

var req = {
  today: function(){
    var today = new Date();
    var y = '' + today.getFullYear();
    var m = '' + (today.getMonth() + 1);
    var d = '' + today.getDate();
    d = (d.length == 1) ? '0' + d : d;
    return y+m+d;
  },
  lastUpdate: function(journal) {
    var oJournal = storage.get(journal);
    return oJournal.reqDate;
  },
  getLast: function(journal, local) {
    if (req.today() != req.lastUpdate(journal) || storage.getLocal(journal) != local) {
      var backButton = $('#settings a[href=#home]');
      backButton.hide();
      $.ajax({
        url: '/get_last.php', 
        data: 'name='+journal+'&local='+local,
        async: false,
        dataType: 'json',
        success: function(data){
          storage.set(journal, data);
          backButton.show();
        },
        error: function(){
          alert('Erro ao montar link');
          backButton.show();
        }
      });
    }
    return storage.getUrl(journal);
  }
};

var init = {
  enabledHide:  true,
  disabledHide: false,
  setInitialValues: function(){
    init.verifyConfig();
    for (i=0; i<=localStorage.length-1; i++) {
      key = localStorage.key(i);
      val = storage.getLocal(key);
      $('option[value='+val+']', '#'+key+'_local').attr('selected','selected');
    }
  },
  verifyConfig: function(){
    var setGhostValues = (localStorage.length == 0) ? true : false;
    
    if (!setGhostValues) {
      try {
        storage.get('metro');
        storage.get('destak');
        storage.get('version');
      } catch(err) {
        localStorage.clear();
        setGhostValues = true;
      }
    }
    
    if (!setGhostValues) {
      var destak  = typeof(storage.get('destak' ));
      var metro   = typeof(storage.get('metro'  ));
      var version = typeof(storage.get('version'));
      if (destak != "object" || metro != "object" || version != "string") {
        setGhostValues = true;
      }
    }
  
  
    if (setGhostValues){
      var oDef = { "url"      : "http://..."
                 , "local"    : "SaoPaulo"
                 , "timestamp": "20111216"
                 , "humandate": "16-12-2011"
                 , "reqDate"  : "20111217"};
      $('a[href=#settings]:first').click();
      storage.set('metro' , oDef);
      
      oDef.local = '21';
      storage.set('destak', oDef);
      
      storage.set("version", "0.0.0");
    }
  },
  updateVersion: function() {
    var oldV = storage.get('version');
    if (storage.version != oldV) {
      alert('Yeah! Modificações foram feitas! Confira o que é novo no meu blog.');
      storage.set("version", storage.version);
    }
    $('#version').text('Versão '+ storage.get('version'));
  },
  toggleLinks: function(){
    if (window.navigator.onLine) {
      $('.enabled').show();
      $('.disabled').hide();
    } else {
      $('.enabled').hide();
      $('.disabled').show();
      return false;
    }
  }
};

var refresh = {
  journals: ['metro', 'destak'],
  links: function() {
    var jou = refresh.journals;
    var qtd = jou.length;
    for (i = 0; i <= qtd -1; i++) {
      var t = jou[i]; //this
      $('#'+t).attr('href', req.getLast(t , storage.getLocal(t)));
      $('#'+t+' span').text(storage.get(t).humandate);
    }
  }
};

$(window).load(function(){
  $('select').change(function(){
    var t       = $(this);
    var journal = t.attr('name');
    var loc     = t.val();
    req.getLast(journal, loc);
  });
  
  $('#settings a[href=#home]').click(function(){
    refresh.links();
  });


  init.updateVersion();
  init.setInitialValues();
  init.toggleLinks();
  refresh.links();
  
  //$('#metro' ).attr('href', req.getLast('metro' , storage.getLocal('metro' )));
  //$('#destak').attr('href', req.getLast('destak', storage.getLocal('destak')));

});

