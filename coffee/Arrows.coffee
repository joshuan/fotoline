  class Arrows

    # Контейнер событий
    events: {}
    # jQueryElement
    $prev: {}
    # jQueryElement
    $next: {}

    constructor: (events, $prev, $next) ->
      @events = events
      @$prev = $prev
      @$next = $next
      @initEvents()

      @events
        .on 'fotoline.visibleFirst', =>
          @block 'prev'
          return
        .on 'fotoline.visibleLast', =>
          @block 'next'
          return
        .on 'fotoline.hidedFirst', =>
          @unblock 'prev'
          return
        .on 'fotoline.hidedLast', =>
          @unblock 'next'
          return
        .on 'fotoline.visibleAll', =>
          @hide()
          return
        .on 'fotoline.visibleSome', =>
          @show()
          return
      @

    initEvents: ->

      @$prev.on 'click', =>
        @events.trigger '<'
        false
      @$next.on 'click', =>
        @events.trigger '>'
        false

      @

    block: (direction) =>
      $el = if direction == 'prev' then @$next else @$prev
      $el.addClass 'fotoline-arrow-block'
      @

    unblock: (direction) =>
      $el = if direction == 'prev' then @$next else @$prev
      $el.removeClass 'fotoline-arrow-block'
      @

    hide: ->
      @$prev.addClass 'fotoline-arrow-hide'
      @$next.addClass 'fotoline-arrow-hide'
      @

    show: ->
      @$prev.removeClass 'fotoline-arrow-hide'
      @$next.removeClass 'fotoline-arrow-hide'
      @