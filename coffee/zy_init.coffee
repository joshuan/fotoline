  $('.fotoline').each () ->

    $el = $(@)
    data = new Fotoline $el
    $el.data({
        fotoline: data
    })

    return

  jQuery.fn.fotoline = (params) ->
    $el = $(this)
    $.each(params, (param, value) ->
        $el.data('fotoline-'+param, value);
    );
    data = new Fotoline $el
    $el.data({
      fotoline: data
    })

    return data;