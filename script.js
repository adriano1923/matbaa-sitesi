/* NovaDent interaction layer — framework free */
const $=(s,c=document)=>c.querySelector(s),$$=(s,c=document)=>[...c.querySelectorAll(s)];
const root=document.documentElement;

/* FIX: responsive menu, dark mode and language control */
const menu=$('.menu-toggle'),nav=$('#mainNav');
menu.addEventListener('click',()=>{const open=nav.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Menüyü kapat':'Menüyü aç')});
$$('#mainNav a').forEach(a=>a.addEventListener('click',()=>{nav.classList.remove('open');menu.setAttribute('aria-expanded','false')}));
const savedTheme=localStorage.getItem('nova-theme');if(savedTheme)root.dataset.theme=savedTheme;
$('.theme-toggle').addEventListener('click',()=>{const dark=root.dataset.theme!=='dark';root.dataset.theme=dark?'dark':'light';localStorage.setItem('nova-theme',root.dataset.theme);$('.theme-toggle').setAttribute('aria-label',dark?'Açık temayı aç':'Koyu temayı aç')});
$('.lang-toggle').addEventListener('click',e=>{const en=e.currentTarget.textContent.trim()==='TR / EN';e.currentTarget.textContent=en?'EN / TR':'TR / EN';e.currentTarget.setAttribute('aria-label',en?'Dili Türkçe yap':'Dili İngilizce yap')});

/* FIX: scroll spy, reveal and top control */
const revealObserver=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting){e.target.classList.add('visible');revealObserver.unobserve(e.target)}}),{threshold:.12});$$('.reveal').forEach(el=>revealObserver.observe(el));
const spy=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)$$('#mainNav a').forEach(a=>a.classList.toggle('active',a.hash==='#'+e.target.id))}),{rootMargin:'-35% 0px -55%'});$$('main section[id]').forEach(s=>spy.observe(s));
window.addEventListener('scroll',()=>$('.to-top').classList.toggle('visible',scrollY>600),{passive:true});$('.to-top').addEventListener('click',()=>scrollTo({top:0,behavior:'smooth'}));

/* FIX: service chips are a real filter with aria-pressed */
$$('.filter-bar button').forEach(button=>button.addEventListener('click',()=>{const filter=button.dataset.filter;$$('.filter-bar button').forEach(b=>{const active=b===button;b.classList.toggle('active',active);b.setAttribute('aria-pressed',String(active))});$$('.service-card').forEach(card=>card.classList.toggle('hidden',filter!=='all'&&card.dataset.category!==filter))}));

/* FIX: accessible service modal */
const modal=$('#serviceModal');let lastFocus;
function openModal(title){lastFocus=document.activeElement;$('#modalTitle').textContent=title;modal.hidden=false;document.body.classList.add('modal-open');$('.modal-close').focus()}
function closeModal(){modal.hidden=true;document.body.classList.remove('modal-open');lastFocus?.focus()}
$$('[data-modal]').forEach(b=>b.addEventListener('click',()=>openModal(b.dataset.modal)));$('.modal-close').addEventListener('click',closeModal);modal.addEventListener('click',e=>{if(e.target===modal)closeModal()});$('.modal a').addEventListener('click',closeModal);document.addEventListener('keydown',e=>{if(e.key==='Escape'&&!modal.hidden)closeModal()});

/* FIX-2: Before/After uses six real DOM images, pointer, touch and keyboard */
const compare=$('#compare'),handle=$('#compareHandle'),casePanels=$$('.case-pair');let compareValue=50,dragging=false;
function setCompare(value){compareValue=Math.max(0,Math.min(100,value));compare.style.setProperty('--position',compareValue+'%');handle.setAttribute('aria-valuenow',String(Math.round(compareValue)))}
function setFromPointer(e){const r=compare.getBoundingClientRect();setCompare(((e.clientX-r.left)/r.width)*100)}
handle.addEventListener('pointerdown',e=>{dragging=true;handle.setPointerCapture(e.pointerId);setFromPointer(e)});
handle.addEventListener('pointermove',e=>{if(dragging)setFromPointer(e)});
handle.addEventListener('pointerup',()=>dragging=false);
handle.addEventListener('pointercancel',()=>dragging=false);
compare.addEventListener('pointerdown',e=>{if(e.target!==handle)setFromPointer(e)});
handle.addEventListener('keydown',e=>{if(e.key==='ArrowLeft'){e.preventDefault();setCompare(compareValue-2)}if(e.key==='ArrowRight'){e.preventDefault();setCompare(compareValue+2)}if(e.key==='Home'){e.preventDefault();setCompare(0)}if(e.key==='End'){e.preventDefault();setCompare(100)}});
$$('.case-tabs button').forEach((button,index)=>button.addEventListener('click',()=>{casePanels.forEach((panel,i)=>panel.classList.toggle('active',i===index));$$('.case-tabs button').forEach(b=>b.setAttribute('aria-selected',String(b===button)));setCompare(50)}));

/* FIX-2: 5-review carousel shows 3/2/1 cards, auto-plays, pauses and swipes */
const carousel=$('#reviewCarousel'),track=$('.review-track'),reviews=$$('.review'),dots=$('.review-dots');let reviewIndex=0,timer,touchStart=0,visibleReviews=3;
function getVisibleReviews(){return innerWidth<768?1:innerWidth<1024?2:3}
function maxReviewIndex(){return Math.max(0,reviews.length-getVisibleReviews())}
function buildReviewDots(){dots.innerHTML='';for(let i=0;i<=maxReviewIndex();i++){const d=document.createElement('button');d.type='button';d.setAttribute('aria-label',`${i+1}. yorum grubunu göster`);d.addEventListener('click',()=>showReview(i));dots.appendChild(d)}}
function showReview(index){visibleReviews=getVisibleReviews();reviewIndex=Math.max(0,Math.min(index,maxReviewIndex()));const step=reviews[0].getBoundingClientRect().width+16;track.style.transform=`translateX(${-reviewIndex*step}px)`;$$('.review-dots button').forEach((d,i)=>d.classList.toggle('active',i===reviewIndex));reviews.forEach((r,i)=>r.setAttribute('aria-hidden',String(i<reviewIndex||i>=reviewIndex+visibleReviews)))}
function startReviews(){clearInterval(timer);timer=setInterval(()=>showReview(reviewIndex>=maxReviewIndex()?0:reviewIndex+1),6000)}
buildReviewDots();showReview(0);startReviews();
$('#nextReview').addEventListener('click',()=>showReview(reviewIndex>=maxReviewIndex()?0:reviewIndex+1));
$('#prevReview').addEventListener('click',()=>showReview(reviewIndex<=0?maxReviewIndex():reviewIndex-1));
carousel.addEventListener('mouseenter',()=>clearInterval(timer));carousel.addEventListener('mouseleave',startReviews);
carousel.addEventListener('focusin',()=>clearInterval(timer));carousel.addEventListener('focusout',startReviews);
carousel.addEventListener('touchstart',e=>touchStart=e.changedTouches[0].clientX,{passive:true});carousel.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchStart;if(Math.abs(delta)>45)showReview(reviewIndex+(delta<0?1:-1))},{passive:true});
addEventListener('resize',()=>{buildReviewDots();showReview(Math.min(reviewIndex,maxReviewIndex()))});

/* FIX-2: counter values support decimals, prefixes and suffixes without repeats */
let counted=false;const statObserver=new IntersectionObserver(entries=>{if(entries[0].isIntersecting&&!counted){counted=true;$$('[data-count]').forEach(el=>{const target=Number(el.dataset.count),start=performance.now(),duration=1300,prefix=el.dataset.prefix||'',suffix=el.dataset.suffix||'',decimals=String(target).includes('.')?1:0;function tick(now){const p=Math.min((now-start)/duration,1),value=target*(1-Math.pow(1-p,3));el.textContent=prefix+value.toLocaleString('tr-TR',{minimumFractionDigits:p===1?decimals:0,maximumFractionDigits:decimals})+suffix;if(p<1)requestAnimationFrame(tick)}requestAnimationFrame(tick)})}},{threshold:.3});statObserver.observe($('.stats-band'));

/* FIX: complete form with inline accessible validation */
const form=$('#appointmentForm'),dateInput=$('input[name="date"]',form);dateInput.min=new Date().toISOString().split('T')[0];
const messages={valueMissing:'Bu alan zorunludur.',typeMismatch:'Geçerli bir e-posta adresi yazın.',patternMismatch:'Geçerli bir telefon numarası yazın.',tooShort:'En az 3 karakter yazın.'};
function validate(field){const label=field.closest('label');if(!label)return true;const error=$('small',label);const valid=field.checkValidity();label.classList.toggle('invalid',!valid);field.setAttribute('aria-invalid',String(!valid));if(error){error.textContent='';if(!valid){for(const key of Object.keys(messages))if(field.validity[key]){error.textContent=messages[key];break}}}return valid}
$$('input,select,textarea',form).forEach(field=>{field.addEventListener('blur',()=>validate(field));field.addEventListener('input',()=>{if(field.getAttribute('aria-invalid')==='true')validate(field)})});
form.addEventListener('submit',async e=>{e.preventDefault();const fields=$$('input,select,textarea',form),valid=fields.every(validate),status=$('#formStatus');if(!valid){status.textContent='Lütfen işaretli alanları kontrol edin.';status.className='form-status error';fields.find(f=>!f.checkValidity())?.focus();return}const submit=$('.submit-button',form);submit.disabled=true;status.textContent='Gönderiliyor…';status.className='form-status';try{await new Promise(r=>setTimeout(r,650));/* Production: POST /api/appointment */form.reset();status.textContent='Talebiniz alındı. Sizi kısa sürede arayacağız.';status.className='form-status success'}catch{status.textContent='Bir hata oluştu. Lütfen telefonla ulaşın.';status.className='form-status error'}finally{submit.disabled=false}});

/* FIX: full-width cookie bar with localStorage */
const cookie=$('.cookie-bar');
if(localStorage.getItem('nova-cookie')) cookie.classList.add('hidden'); else document.body.classList.add('cookie-visible');
$$('.cookie-accept,.cookie-reject').forEach(b=>b.addEventListener('click',()=>{localStorage.setItem('nova-cookie',b.classList.contains('cookie-accept')?'accepted':'rejected');cookie.classList.add('hidden');document.body.classList.remove('cookie-visible')}));

/* FIX: graceful image fallback without layout shift */
/* FIX-2: remote clinical imagery falls back to bundled WebP artwork instead of an empty block */
$$('img').forEach(img=>{const fail=()=>{if(img.dataset.fallback&&!img.dataset.localFallback){img.dataset.localFallback='true';img.src=img.dataset.fallback;return}img.classList.add('image-fallback');img.parentElement?.classList.add('image-fallback');img.closest('.compare')?.classList.add('image-fallback')};img.addEventListener('error',fail);if(img.complete&&img.naturalWidth===0)fail()});
