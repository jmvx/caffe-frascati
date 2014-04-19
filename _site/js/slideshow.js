/*******************************************************************************
 * slideshow.js
 *
 * Copyright (c) 2013 Julia Van Cleve
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 * 
 * The above copyright notice and this permission notice shall be included in
 * all copies or substantial portions of the Software.
 * 
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
 * THE SOFTWARE.
 ******************************************************************************/

var jmvxAnimationCounter = 0;

function jmvxApplySlideshow(target) {
  target = $(target);
  
  // Keep a counter for the images that have yet to load, i.e., those without
  // src="blah.jpg" attributes
  var notloaded = $('img:not([src])', target);
  target.data('counter', notloaded.length);
  
  // After all images are loaded, we can set up the CSS to animate
  target.on('onLoadComplete', function () {
    var target = $(this);
    var imgs = $('img', target);
    var n = imgs.length;
    var a = parseInt(target.data('showduration'));
    var b = parseInt(target.data('fadeduration'));
    var t = (a + b) * n;
    
    // Generate a unique animation name
    var aniname = 'jmvxSlideshow' + (++jmvxAnimationCounter).toString();
    
    // Add CSS to each image
    $.each(imgs, function(i, item) {
      $(item).css({
        'animation-name': aniname,
        'animation-timing-function': 'ease-in-out',
        'animation-iteration-count': 'infinite',
        'animation-duration': t.toString() + 's',
        
        // The last image added occludes the others, so we start its animation
        // first
        'animation-delay': ((a + b) * (n - i - 1)).toString() + 's'
      });
    });
    
    // Create the keyframes for the animation
    // Based on http://css3.bradshawenterprises.com/cfimg/
    var keyframes = '';
    [ '', '-webkit-', '-moz-' ].forEach(function (prefix) {
      keyframes += '@' + prefix + 'keyframes ' + aniname + ' {\n';
      keyframes += '\t0% { opacity: 1; }\n';
      keyframes += '\t' + Math.round(100*a/t) + '% { opacity: 1; }\n';
      keyframes += '\t' + Math.round(100/n) + '% { opacity: 0; }\n';
      keyframes += '\t' + Math.round(100*(1-(b/t))) + '% { opacity: 0; }\n';
      keyframes += '\t100% { opacity: 1; }\n';
      keyframes += '}\n\n';
    });
    target.append($('<style type="text/css">' + keyframes + '</style>'));
  });
  
  // Load each image, decrementing the counter as they load, and then trigger
  // onLoadComplete() when all are loaded
  notloaded.each(function(i, img) {
    img.onload = function() {
      target.data('counter', target.data('counter') - 1);
      if (target.data('counter') === 0)
        target.trigger('onLoadComplete');
    }
    img.src = $(img).data('slidesrc');
  });
  
}


// When the document is loaded, initialize each slideshow on the page
$(document).ready(function () {
  $('.slideshow').each(function(i, target) {
    jmvxApplySlideshow(target);
  });
});
