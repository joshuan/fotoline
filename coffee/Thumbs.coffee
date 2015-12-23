  class Thumbs

    # Контейнер событий
    events: {}
    # Подсветка текущего элемента
    $el: {}
    # Коллекция
    collection: {}
    # Линия
    row: {}
    # Текущий элемент
    current: 0
    # Fotorama Object
    fotorama: {}
    # Fotorama API
    fotoramaApi: {}

    constructor: (events, row, collection, fotorama) ->
      @events = events
      @collection = collection
      @row = row
      @$el = $('<div>', {class: 'fotoline-current'})
      row.$row.append @$el
      row.children().on 'click', @onClick
      @update()
      @events
        .on 'fotoline.resize', () =>
          @update('css')
          return
        .on 'fotoline.update', () =>
          @update()
          return
        .on 'fotoline.margin', (event, size) =>
          setTimeout () =>
            @update('css')
            return
          , 500
          return

      if fotorama
        @fotorama = $(fotorama)
        @fotoramaInit()
      @

    update: (action='animate') =>
      current_item = @collection.elements[@current]
      position = current_item.$el.position()
      w = current_item.$el.width()
      h = current_item.$el.height()
      $.each @collection.elements, (index, item) ->
        item.$el.removeClass('active')
        return
      current_item.$el.addClass('active')
      @$el[action]
        width: w
        height: h
        left: position.left + current_item.margin
        top: position.top
      @

    onClick: (event) =>
      index = $(event.currentTarget).index()
      @current = index
      left = @calcLeft @current

      @collection.currentLeft = left
      @events.trigger 'fotoline.update'

      false

    calcLeft: (index) ->
      visible_count = @row.current_visible
      count = @collection.count

      if visible_count%2 == 0
        left = index - (visible_count / 2) + 1
      else
        left = index - Math.floor(visible_count / 2)
      if left < 0
        left = 0
      else if left > (count - visible_count)
        left = count - visible_count

      left

    fotoramaInit: () ->
      @events.on 'fotoline.update', () =>
        fotoramaApi = @fotorama.data('fotorama')
        if @current != fotoramaApi.activeIndex
          fotoramaApi.show(@current)
        return
      @fotorama.on 'fotorama:show', (e, api, extra) =>
        if @current != api.activeIndex
          @current = api.activeIndex
          @collection.currentLeft = @calcLeft @current
          @events.trigger 'fotoline.update'
        return
      return