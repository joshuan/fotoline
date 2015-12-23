  $('.fotoline').each () ->

    $el = $(@)
    data = new Fotoline $el
    $el.data({
        fotoline: data
    })

    return