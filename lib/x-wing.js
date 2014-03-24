App = Ember.Application.create();
App.Router.reopen({location: 'none'});

App.XWingComponent = Ember.Component.extend({

  attributeBindings: ['tabindex'],

  tabindex: 0,

  tagName: 'x-wing',

  launched: false,

  vals: {
    up: 0,
    down: 0,
    clockwise: 0,
    counterClockwise: 0,
    front: 0,
    back: 0,
    left: 0,
    right: 0
  },

  opps: {
    front: 'back',
    back: 'front',
    up: 'down',
    down: 'up',
    clockwise: 'counterClockwise',
    counterClockwise: 'clockwise',
    left: 'right',
    right: 'left'
  },

  keyMap: {
    13: 'toggleLaunchLand',
    32: 'stop',
    38: 'up',
    40: 'down',
    39: 'clockwise',
    37: 'counterClockwise',
    87: 'front',
    83: 'back',
    65: 'left',
    68: 'right'
  },

  keyboard: throttle(function(event) {
    var action = this.get('keyMap')[event.keyCode];
    if (!action) return;
    event.preventDefault();
    this.performAction(action);
  }, 100).on('keyDown'),

  performAction: function(action) {
    if (this.get('vals.'+action) != null) {
      this.performActionWithValue(action);
    } else {
      this[action]();
    }
  },

  performActionWithValue: function(action) {
    var opposite = this.get('opps.'+action);
    this.set('vals.'+opposite, 0);
    this.increment('vals.'+action);
    this.req(action, this.get('vals.'+action));
  },

  req: function(action, value) {
    var data = {action: action};
    if (value) data.value = value;
    console.log(action, value);
    return $.ajax({
      url: this.get('url')+'/action',
      type: "POST",
      data: data,
      crossDomain: true
    });
  },

  increment: function(prop) {
    var old = this.get(prop);
    old = Math.round(old*100)/100;
    if (old >= 1) return;
    this.set(prop, old + 0.1);
  },

  toggleLaunchLand: function() {
    if (this.get('launched')) {
      this.req('land');
      this.set('launched', false);
    } else {
      this.req('takeoff');
      this.set('launched', true);
    }
  },

  stop: function() {
    this.req('stop');
  }

});

App.XWingActionComponent = Ember.Component.extend({
  tagName: 'x-wing-action',

  action: null,

  click: function() {
    this.get('parentView').performAction(this.get('action'));
  }

});

App.SpacerGifComponent = Ember.Component.extend({
  tagName: 'img',
  attributeBindings: ['src', 'width', 'height'],
  width: 128,
  height: 128,
  src: 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'
});

var IconComponent = Ember.Component.extend({
  tagName: 'icon',
  width: 128,
  height: 128,
  rotate: 0,
  orient: function() {
    var rotate = this.get('rotate');
    this.$().css('transform', 'rotate('+rotate+'deg)');
  }.on('didInsertElement').observes('rotate')
});

App.IconArrowComponent = IconComponent.extend();
App.IconLaunchComponent = IconComponent.extend();
App.IconLandComponent = IconComponent.extend();
App.IconTriangleComponent = IconComponent.extend();
App.IconEyeComponent = IconComponent.extend();



function throttle(fn, delay){
  var context, timeout, result, args,
    cur, diff, prev = 0;
  function delayed(){
    prev = Date.now();
    timeout = null;
    result = fn.apply(context, args);
  }
  function throttled(){
    context = this;
    args = arguments;
    cur = Date.now();
    diff = delay - (cur - prev);
    if (diff <= 0) {
      clearTimeout(timeout);
      prev = cur;
      result = fn.apply(context, args);
    } else if (! timeout) {
      timeout = setTimeout(delayed, diff);
    }
    return result;
  }
  throttled.cancel = function(){
    clearTimeout(timeout);
  };
  return throttled;
}

