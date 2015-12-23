  class Fotoline

    # Контейнер событий
    events: {}
    # jQueryElement
    $container: {}
    # Row
    row: {}
    # Collection
    collection: {}
    # Arrows
    arrows: {}
    # Дефолтные параметры
    defaults:
      Height: false
      Width: false
      Margin: 10
      Behavior: 'none'
      MinMargin: 1
      MaxMargin: 999
      Arrow: true
      Fotorama: false
      NextArrow: '&lt;',
      PrevArrow: '&gt;'
    # Параметры
    parameters: {}

    constructor: ($root) ->
      @events = $root
      @$container = $root
      @params()
      @wrap()

      $prev = $root.find('[data-fotoline-direct="prev"]')
      $next = $root.find('[data-fotoline-direct="next"]')
      if @parameters.Arrow
        @arrows = new Arrows @events, $prev, $next
      else
        $prev.remove()
        $next.remove()

      @row = new Row @events, $root.find('.fotoline-row'), @parameters.MinMargin, @parameters.MaxMargin
      @collection = @row.getCollection()

      if @parameters.Behavior == 'thumbs'
        new Thumbs @events, @row, @collection, @parameters.Fotorama

      @height()
      @events.trigger 'fotoline.resize'
      $(window).on 'resize', =>
        @events.trigger 'fotoline.resize'
        @

      @

    wrap: ->

      $content = @$container.children()

      data = []
      $content.each () ->
        data.push '<div class="fotoline-item">'+$(this).wrap('<div/>').parent().html()+'</div>'
        return

      @$container.html('<div class="fotoline-wrap">
            <div class="fotoline-arrow fotoline-arrow-left" data-fotoline-direct="next">&lt;</div>
            <div class="fotoline-container">
                <div class="fotoline-jack">
                    <div class="fotoline-row">'+data.join('')+'</div>
                </div>
            </div>
            <div class="fotoline-arrow fotoline-arrow-right" data-fotoline-direct="prev">&gt;</div>
        </div>');

    params: ->

      data = {}
      $.each @$container.data(), (name, value) ->
        name = name.replace(/^fotoline/, '')
        data[name] = value
        return

      @parameters = $.extend {}, @defaults, data

    height: ->
      if @parameters.Width
        width = @parameters.Width
      else
        width = @collection.getItemWidth()

      if @parameters.Height
        height = @parameters.Height
      else
        height = @collection.getItemHeight()
      height += @parameters.Margin*2

      @collection.setWidth width
      @$container.find('.fotoline-wrap').height height
      @