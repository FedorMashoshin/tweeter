$( document ).ready(function() {
    // "event triggers whenever the input changes"
    $('#tweet-text').on('input', function() {
        const final = $(this).val().length;
        const counter = $(this).siblings().children('.counter');
        // Changin counter on HTML page via .text()
        counter.text(140 - final);
        if(final > 140){
            counter.addClass('red');
        } else {
            counter.removeClass('red');
        }
      });
});