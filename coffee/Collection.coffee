  class Collection

    # Контейнер событий
    events: {}
    # Item[]
    elements: []
    # Кол-во элементов в коллекции
    count: 0
    # Текущий первый элемент
    currentLeft: 0

    constructor: (events, $els) ->
      @events = events
      $.each $els, (index, $el) =>
        @addElement $el
        return

      @events.on 'fotoline.margin', (event, size) =>
        @setMargin size
        @
      @

    getCurrentLeft: ->
      @currentLeft

    next: () ->
      @currentLeft++
      @events.trigger 'fotoline.update'
      @

    prev: () ->
      @currentLeft--
      @events.trigger 'fotoline.update'
      @

    addElement: ($el) ->
      @elements.push(new Item(@events, $el))
      @count++
      @

    getSize: ->
      @count

    setMargin: (size) ->
      $.each @elements, (index, item) =>
        item.setMargin size
        @
      @

    getItemWidth: ->
      @elements[0].getWidth()

    getItemHeight: ->
      @elements[0].getHeight()

    setWidth: (width) ->
      $.each @elements, (index, item) ->
        item.$el.width width
        @