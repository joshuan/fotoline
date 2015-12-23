  class Row

    # Контейнер событий
    events: {}
    # jQueryElement
    $row: {}
    # Collection
    collection: {}
    # Максимально возможное кол-во видимых элементов
    max_visible: 0
    # Текущее кол-во видимых элементов
    current_visible: 0
    # Текущий размер с отступами
    current_width: 0
    # Максимальный отступ между элементами
    max_margin: 999
    # Минимальный отступ между элементами
    min_margin: 0

    constructor: (events, $row, minMargin, maxMargin) ->
      @min_margin = minMargin
      @max_margin = maxMargin
      @events = events
      @$row = $row
      @collection = new Collection events, $row.children()
      @events
        .on 'fotoline.resize', => @size(); @
        .on 'fotoline.resize', => @rowWidth(); @
        .on 'fotoline.resize', => @update('css'); @
        .on 'fotoline.resize', => @updateArrowStatus(); @
        .on '<', => @moveLeft(); @
        .on '>', => @moveRight(); @
        .on 'fotoline.update', => @updateArrowStatus(); @
        .on 'fotoline.update', => @update('animate'); @
      @updateArrowStatus();
      @

    getCollection: ->
      @collection

    children: ->
      @$row.children()

    canLeft: ->
      @collection.getCurrentLeft() < @collection.count - @current_visible

    canRight: ->
      @collection.getCurrentLeft() > 0

    moveLeft: ->
      if @canLeft()
        @collection.next()

    moveRight: ->
      if @canRight()
        @collection.prev()

    size: ->
      # TODO: При растягивании, если currentLeft > 0
      item_width = @collection.getItemWidth()
      $jack = @$row.parent()
      visible_width = $jack.parent().width()
      count = @collection.getSize()
      @max_visible = Math.floor visible_width/(item_width+(@min_margin*2))

      @current_visible = if @max_visible < count then @max_visible else count
      space = 0
      margin = ( ( visible_width - (item_width * @current_visible) ) / @current_visible ) / 2
      if margin > @max_margin
        margin = @max_margin
        space = (visible_width - @current_visible * (item_width + (margin*2)))/2
      else if margin < @min_margin
        margin = @min_margin
      @current_width = item_width + (margin * 2)
      $jack.css
        marginLeft: space
        marginRight: space
      @events.trigger 'fotoline.margin', [margin]
      @

    update: (method) ->
      current = @collection.getCurrentLeft()
      left = -current * @current_width
      method = method || 'css'
      @$row[method] left: left
      @

    rowWidth: ->
      @$row.width @collection.getSize()*@current_width
      @

    updateArrowStatus: ->
      count = @collection.getSize()
      if count <= @max_visible
        @events.trigger 'fotoline.visibleAll'
      else
        @events.trigger 'fotoline.visibleSome'
        current = @collection.getCurrentLeft()
        if current == 0
          @events.trigger 'fotoline.visibleFirst'
        else
          @events.trigger 'fotoline.hidedFirst'
        if current >= count - @max_visible
          @events.trigger 'fotoline.visibleLast'
        else
          @events.trigger 'fotoline.hidedLast'
      @