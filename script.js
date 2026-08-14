(function(){
  var isMobile = window.matchMedia('(max-width: 820px)').matches;
  var track = document.getElementById('track');
  var train = document.getElementById('train');
  var sections = Array.prototype.slice.call(document.querySelectorAll('.hero, .station'));

  // Build barcode
  var barcode = document.querySelector('.barcode');
  if(barcode){
    for(var i=0;i<38;i++){
      var bar = document.createElement('span');
      var h = 10 + Math.round(Math.random()*18);
      bar.style.height = h+'px';
      bar.style.width = (Math.random()>0.7 ? '3px':'2px');
      barcode.appendChild(bar);
    }
  }

  // Build station stops on the track
  var stopEls = [];
  sections.forEach(function(sec, idx){
    var stop = document.createElement('div');
    stop.className = 'track__stop';
    stop.setAttribute('role','button');
    stop.setAttribute('tabindex','0');
    var labelText = sec.id ? sec.id.charAt(0).toUpperCase()+sec.id.slice(1) : 'Start';
    var label = document.createElement('span');
    label.className = 'track__label';
    label.textContent = (idx===0 ? 'Boarding' : labelText);
    stop.appendChild(label);
    stop.addEventListener('click', function(){
      sec.scrollIntoView({behavior:'smooth', block:'start'});
    });
    stop.addEventListener('keydown', function(e){
      if(e.key==='Enter' || e.key===' '){ e.preventDefault(); sec.scrollIntoView({behavior:'smooth'}); }
    });
    track.appendChild(stop);
    stopEls.push({el:stop, section:sec});
  });

  function docProgressRange(){
    return Math.max(document.documentElement.scrollHeight - window.innerHeight, 1);
  }

  function layoutStops(){
    var range = docProgressRange();
    var trackLen = isMobile ? window.innerWidth : window.innerHeight;
    stopEls.forEach(function(item){
      var prog = Math.min(Math.max(item.section.offsetTop / range, 0), 1);
      var pos = prog * (trackLen - 20) + 10;
      if(isMobile){ item.el.style.left = pos+'px'; }
      else{ item.el.style.top = pos+'px'; }
    });
  }

  function positionTrain(){
    var range = docProgressRange();
    var prog = Math.min(Math.max(window.scrollY / range, 0), 1);
    var trackLen = isMobile ? window.innerWidth : window.innerHeight;
    var pos = prog * (trackLen - 46) + 4;
    if(isMobile){ train.style.left = pos+'px'; }
    else{ train.style.top = pos+'px'; }
  }

  function onScroll(){
    positionTrain();
  }

  window.addEventListener('scroll', onScroll, {passive:true});
  window.addEventListener('resize', function(){
    isMobile = window.matchMedia('(max-width: 820px)').matches;
    layoutStops();
    positionTrain();
  });

  layoutStops();
  positionTrain();

  // Active station highlighting
  var io = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      var match = stopEls.find(function(s){ return s.section === entry.target; });
      if(!match) return;
      if(entry.isIntersecting){
        stopEls.forEach(function(s){ s.el.classList.remove('is-active'); });
        match.el.classList.add('is-active');
      }
    });
  }, {rootMargin:'-40% 0px -50% 0px', threshold:0});
  sections.forEach(function(sec){ io.observe(sec); });

  // Reveal-on-scroll for content blocks
  var revealIo = new IntersectionObserver(function(entries){
    entries.forEach(function(entry){
      if(entry.isIntersecting){
        entry.target.classList.add('is-visible');
        revealIo.unobserve(entry.target);
      }
    });
  }, {threshold:0.15});
  document.querySelectorAll('.reveal').forEach(function(el){ revealIo.observe(el); });
})();
