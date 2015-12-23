  class Item

    # Контейнер событий
    events: {}
    # jQueryElement
    $el: {}
    # Отступ
    margin: 0

    constructor: (events, $el) ->
      @events = events
      @$el = $($el)
      @

    getWidth: () =>
      @$el.width()

    getHeight: () =>
      @$el.height()

    setMargin: (margin) ->
      @margin = margin
      @updateMargin()
      @

    updateMargin: () ->
      @$el.css
        marginLeft: @margin
        marginRight: @margin
      @