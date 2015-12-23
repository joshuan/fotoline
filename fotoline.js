(function() {
  var __bind = function(fn, me){ return function(){ return fn.apply(me, arguments); }; };

  $(function() {
    var Arrows, Collection, Fotoline, Item, Row, Thumbs;
    Item = (function() {
      Item.prototype.events = {};

      Item.prototype.$el = {};

      Item.prototype.margin = 0;

      function Item(events, $el) {
        this.getHeight = __bind(this.getHeight, this);
        this.getWidth = __bind(this.getWidth, this);
        this.events = events;
        this.$el = $($el);
        this;
      }

      Item.prototype.getWidth = function() {
        return this.$el.width();
      };

      Item.prototype.getHeight = function() {
        return this.$el.height();
      };

      Item.prototype.setMargin = function(margin) {
        this.margin = margin;
        this.updateMargin();
        return this;
      };

      Item.prototype.updateMargin = function() {
        this.$el.css({
          marginLeft: this.margin,
          marginRight: this.margin
        });
        return this;
      };

      return Item;

    })();
    Collection = (function() {
      Collection.prototype.events = {};

      Collection.prototype.elements = [];

      Collection.prototype.count = 0;

      Collection.prototype.currentLeft = 0;

      function Collection(events, $els) {
        var self;
        this.events = events;
        this.elements = [];
        self = this;
        $.each($els, function(index, $el) {
          self.addElement($el);
        });
        this.events.on('fotoline.margin', (function(_this) {
          return function(event, size) {
            _this.setMargin(size);
            return _this;
          };
        })(this));
        this;
      }

      Collection.prototype.getCurrentLeft = function() {
        return this.currentLeft;
      };

      Collection.prototype.next = function() {
        this.currentLeft++;
        this.events.trigger('fotoline.update');
        return this;
      };

      Collection.prototype.prev = function() {
        this.currentLeft--;
        this.events.trigger('fotoline.update');
        return this;
      };

      Collection.prototype.addElement = function($el) {
        this.elements.push(new Item(this.events, $el));
        this.count++;
        return this;
      };

      Collection.prototype.getSize = function() {
        return this.count;
      };

      Collection.prototype.setMargin = function(size) {
        $.each(this.elements, (function(_this) {
          return function(index, item) {
            item.setMargin(size);
            return _this;
          };
        })(this));
        return this;
      };

      Collection.prototype.getItemWidth = function() {
        return this.elements[0].getWidth();
      };

      Collection.prototype.getItemHeight = function() {
        return this.elements[0].getHeight();
      };

      Collection.prototype.setWidth = function(width) {
        $.each(this.elements, function(index, item) {
          item.$el.width(width);
          return this;
        });
      };

      return Collection;

    })();
    Row = (function() {
      Row.prototype.events = {};

      Row.prototype.$row = {};

      Row.prototype.collection = {};

      Row.prototype.max_visible = 0;

      Row.prototype.current_visible = 0;

      Row.prototype.current_width = 0;

      Row.prototype.max_margin = 999;

      Row.prototype.min_margin = 0;

      function Row(events, $row, minMargin, maxMargin) {
        this.min_margin = minMargin;
        this.max_margin = maxMargin;
        this.events = events;
        this.$row = $row;
        this.collection = new Collection(events, $row.children());
        this.events.on('fotoline.resize', (function(_this) {
          return function() {
            _this.size();
            return _this;
          };
        })(this)).on('fotoline.resize', (function(_this) {
          return function() {
            _this.rowWidth();
            return _this;
          };
        })(this)).on('fotoline.resize', (function(_this) {
          return function() {
            _this.update('css');
            return _this;
          };
        })(this)).on('fotoline.resize', (function(_this) {
          return function() {
            _this.updateArrowStatus();
            return _this;
          };
        })(this)).on('<', (function(_this) {
          return function() {
            _this.moveLeft();
            return _this;
          };
        })(this)).on('>', (function(_this) {
          return function() {
            _this.moveRight();
            return _this;
          };
        })(this)).on('fotoline.update', (function(_this) {
          return function() {
            _this.updateArrowStatus();
            return _this;
          };
        })(this)).on('fotoline.update', (function(_this) {
          return function() {
            _this.update('animate');
            return _this;
          };
        })(this));
        this.updateArrowStatus();
        this;
      }

      Row.prototype.getCollection = function() {
        return this.collection;
      };

      Row.prototype.children = function() {
        return this.$row.children();
      };

      Row.prototype.canLeft = function() {
        return this.collection.getCurrentLeft() < this.collection.count - this.current_visible;
      };

      Row.prototype.canRight = function() {
        return this.collection.getCurrentLeft() > 0;
      };

      Row.prototype.moveLeft = function() {
        if (this.canLeft()) {
          return this.collection.next();
        }
      };

      Row.prototype.moveRight = function() {
        if (this.canRight()) {
          return this.collection.prev();
        }
      };

      Row.prototype.size = function() {
        var $jack, count, item_width, margin, space, visible_width;
        item_width = this.collection.getItemWidth();
        $jack = this.$row.parent();
        visible_width = $jack.parent().width();
        count = this.collection.getSize();
        this.max_visible = Math.floor(visible_width / (item_width + (this.min_margin * 2)));
        this.current_visible = this.max_visible < count ? this.max_visible : count;
        space = 0;
        margin = ((visible_width - (item_width * this.current_visible)) / this.current_visible) / 2;
        if (margin > this.max_margin) {
          margin = this.max_margin;
          space = (visible_width - this.current_visible * (item_width + (margin * 2))) / 2;
        } else if (margin < this.min_margin) {
          margin = this.min_margin;
        }
        this.current_width = item_width + (margin * 2);
        $jack.css({
          marginLeft: space,
          marginRight: space
        });
        this.events.trigger('fotoline.margin', [margin]);
        return this;
      };

      Row.prototype.update = function(method) {
        var current, left;
        current = this.collection.getCurrentLeft();
        left = -current * this.current_width;
        method = method || 'css';
        this.$row[method]({
          left: left
        });
        return this;
      };

      Row.prototype.rowWidth = function() {
        this.$row.width(this.collection.getSize() * this.current_width);
        return this;
      };

      Row.prototype.updateArrowStatus = function() {
        var count, current;
        count = this.collection.getSize();
        if (count <= this.max_visible) {
          this.events.trigger('fotoline.visibleAll');
        } else {
          this.events.trigger('fotoline.visibleSome');
          current = this.collection.getCurrentLeft();
          if (current === 0) {
            this.events.trigger('fotoline.visibleFirst');
          } else {
            this.events.trigger('fotoline.hidedFirst');
          }
          if (current >= count - this.max_visible) {
            this.events.trigger('fotoline.visibleLast');
          } else {
            this.events.trigger('fotoline.hidedLast');
          }
        }
        return this;
      };

      return Row;

    })();
    Fotoline = (function() {
      Fotoline.prototype.events = {};

      Fotoline.prototype.$container = {};

      Fotoline.prototype.row = {};

      Fotoline.prototype.collection = {};

      Fotoline.prototype.arrows = {};

      Fotoline.prototype.defaults = {
        Height: false,
        Width: false,
        Margin: 10,
        Behavior: 'none',
        MinMargin: 1,
        MaxMargin: 999,
        Arrow: true,
        Fotorama: false,
        NextArrow: '&lt;',
        PrevArrow: '&gt;'
      };

      Fotoline.prototype.parameters = {};

      function Fotoline($root) {
        var $next, $prev;
        this.events = $root;
        this.$container = $root;
        this.params();
        this.wrap();
        $prev = $root.find('[data-fotoline-direct="prev"]');
        $next = $root.find('[data-fotoline-direct="next"]');
        if (this.parameters.Arrow) {
          this.arrows = new Arrows(this.events, $prev, $next);
        } else {
          $prev.remove();
          $next.remove();
        }
        this.row = new Row(this.events, $root.find('.fotoline-row'), this.parameters.MinMargin, this.parameters.MaxMargin);
        this.collection = this.row.getCollection();
        if (this.parameters.Behavior === 'thumbs') {
          new Thumbs(this.events, this.row, this.collection, this.parameters.Fotorama);
        }
        this.height();
        this.events.trigger('fotoline.resize');
        $(window).on('resize', (function(_this) {
          return function() {
            _this.events.trigger('fotoline.resize');
            return _this;
          };
        })(this));
        this;
      }

      Fotoline.prototype.wrap = function() {
        var $content, data;
        $content = this.$container.children();
        data = [];
        $content.each(function() {
          data.push('<div class="fotoline-item">' + $(this).wrap('<div/>').parent().html() + '</div>');
        });
        return this.$container.html('<div class="fotoline-wrap"> <div class="fotoline-arrow fotoline-arrow-left" data-fotoline-direct="next">&lt;</div> <div class="fotoline-container"> <div class="fotoline-jack"> <div class="fotoline-row">' + data.join('') + '</div> </div> </div> <div class="fotoline-arrow fotoline-arrow-right" data-fotoline-direct="prev">&gt;</div> </div>');
      };

      Fotoline.prototype.params = function() {
        var data;
        data = {};
        $.each(this.$container.data(), function(name, value) {
          name = name.replace(/^fotoline/, '');
          data[name] = value;
        });
        return this.parameters = $.extend({}, this.defaults, data);
      };

      Fotoline.prototype.height = function() {
        var height, width;
        if (this.parameters.Width) {
          width = this.parameters.Width;
        } else {
          width = this.collection.getItemWidth();
        }
        if (this.parameters.Height) {
          height = this.parameters.Height;
        } else {
          height = this.collection.getItemHeight();
        }
        height += this.parameters.Margin * 2;
        this.collection.setWidth(width);
        this.$container.find('.fotoline-wrap').height(height);
        return this;
      };

      return Fotoline;

    })();
    Arrows = (function() {
      Arrows.prototype.events = {};

      Arrows.prototype.$prev = {};

      Arrows.prototype.$next = {};

      function Arrows(events, $prev, $next) {
        this.unblock = __bind(this.unblock, this);
        this.block = __bind(this.block, this);
        this.events = events;
        this.$prev = $prev;
        this.$next = $next;
        this.initEvents();
        this.events.on('fotoline.visibleFirst', (function(_this) {
          return function() {
            _this.block('prev');
          };
        })(this)).on('fotoline.visibleLast', (function(_this) {
          return function() {
            _this.block('next');
          };
        })(this)).on('fotoline.hidedFirst', (function(_this) {
          return function() {
            _this.unblock('prev');
          };
        })(this)).on('fotoline.hidedLast', (function(_this) {
          return function() {
            _this.unblock('next');
          };
        })(this)).on('fotoline.visibleAll', (function(_this) {
          return function() {
            _this.hide();
          };
        })(this)).on('fotoline.visibleSome', (function(_this) {
          return function() {
            _this.show();
          };
        })(this));
        this;
      }

      Arrows.prototype.initEvents = function() {
        this.$prev.on('click', (function(_this) {
          return function() {
            _this.events.trigger('<');
            return false;
          };
        })(this));
        this.$next.on('click', (function(_this) {
          return function() {
            _this.events.trigger('>');
            return false;
          };
        })(this));
        return this;
      };

      Arrows.prototype.block = function(direction) {
        var $el;
        $el = direction === 'prev' ? this.$next : this.$prev;
        $el.addClass('fotoline-arrow-block');
        return this;
      };

      Arrows.prototype.unblock = function(direction) {
        var $el;
        $el = direction === 'prev' ? this.$next : this.$prev;
        $el.removeClass('fotoline-arrow-block');
        return this;
      };

      Arrows.prototype.hide = function() {
        this.$prev.addClass('fotoline-arrow-hide');
        this.$next.addClass('fotoline-arrow-hide');
        return this;
      };

      Arrows.prototype.show = function() {
        this.$prev.removeClass('fotoline-arrow-hide');
        this.$next.removeClass('fotoline-arrow-hide');
        return this;
      };

      return Arrows;

    })();
    Thumbs = (function() {
      Thumbs.prototype.events = {};

      Thumbs.prototype.$el = {};

      Thumbs.prototype.collection = {};

      Thumbs.prototype.row = {};

      Thumbs.prototype.current = 0;

      Thumbs.prototype.fotorama = {};

      Thumbs.prototype.fotoramaApi = {};

      function Thumbs(events, row, collection, fotorama) {
        this.onClick = __bind(this.onClick, this);
        this.update = __bind(this.update, this);
        this.events = events;
        this.collection = collection;
        this.row = row;
        this.$el = $('<div>', {
          "class": 'fotoline-current'
        });
        row.$row.append(this.$el);
        row.children().on('click', this.onClick);
        this.update();
        this.events.on('fotoline.resize', (function(_this) {
          return function() {
            _this.update('css');
          };
        })(this)).on('fotoline.update', (function(_this) {
          return function() {
            _this.update();
          };
        })(this)).on('fotoline.margin', (function(_this) {
          return function(event, size) {
            setTimeout(function() {
              _this.update('css');
            }, 500);
          };
        })(this));
        if (fotorama) {
          this.fotorama = $(fotorama);
          this.fotoramaInit();
        }
        this;
      }

      Thumbs.prototype.update = function(action) {
        var current_item, h, position, w;
        if (action == null) {
          action = 'animate';
        }
        current_item = this.collection.elements[this.current];
        position = current_item.$el.position();
        w = current_item.$el.width();
        h = current_item.$el.height();
        $.each(this.collection.elements, function(index, item) {
          item.$el.removeClass('active');
        });
        current_item.$el.addClass('active');
        this.$el[action]({
          width: w,
          height: h,
          left: position.left + current_item.margin,
          top: position.top
        });
        return this;
      };

      Thumbs.prototype.onClick = function(event) {
        var index, left;
        index = $(event.currentTarget).index();
        this.current = index;
        left = this.calcLeft(this.current);
        this.collection.currentLeft = left;
        this.events.trigger('fotoline.update');
        return false;
      };

      Thumbs.prototype.calcLeft = function(index) {
        var count, left, visible_count;
        visible_count = this.row.current_visible;
        count = this.collection.count;
        if (visible_count % 2 === 0) {
          left = index - (visible_count / 2) + 1;
        } else {
          left = index - Math.floor(visible_count / 2);
        }
        if (left < 0) {
          left = 0;
        } else if (left > (count - visible_count)) {
          left = count - visible_count;
        }
        return left;
      };

      Thumbs.prototype.fotoramaInit = function() {
        this.events.on('fotoline.update', (function(_this) {
          return function() {
            var fotoramaApi;
            fotoramaApi = _this.fotorama.data('fotorama');
            if (_this.current !== fotoramaApi.activeIndex) {
              fotoramaApi.show(_this.current);
            }
          };
        })(this));
        this.fotorama.on('fotorama:show', (function(_this) {
          return function(e, api, extra) {
            if (_this.current !== api.activeIndex) {
              _this.current = api.activeIndex;
              _this.collection.currentLeft = _this.calcLeft(_this.current);
              _this.events.trigger('fotoline.update');
            }
          };
        })(this));
      };

      return Thumbs;

    })();
    $('.fotoline').each(function() {
      var $el, data;
      $el = $(this);
      data = new Fotoline($el);
      $el.data({
        fotoline: data
      });
    });
    return this;
  });

}).call(this);
