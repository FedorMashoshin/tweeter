$(document).ready(function() {
  const renderTweets = function(tweets) {
    // loops through tweets
    for (const user of tweets) {
      // calls createTweetElement for each tweet
      const $result = createTweetElement(user);
      // takes return value and appends it to the tweets container
      $("#main-tweets").prepend($result);
    }
  };
  // FUNCTION for Preventing XSS (Cross-Site Scripting) with Escaping
  const escape =  function(str) {
    let div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
  };

  const createTweetElement = function(tweet) {
    // Data of tweet
    const date = new Date(tweet.created_at);
    const finalDate = `${date.getMonth()}/${date.getDate()}/${date.getUTCFullYear()}, ${date.getHours()}:${(date.getMinutes() < 10 ? '0' : '') + date.getMinutes()}`;

    let $tweet = `
      <div class="main-tweet">
      <header class="header-tweets">
           <div class="header-info">
               <img class="header-info-pic" src="${tweet.user.avatars}" alt="">
               <span class="header-info-name">${tweet.user.name}n</span>
           </div>
           <span class="header-nickname">
             ${tweet.user.handle}
           </span>
         </header>

         <p class="tweets-text">${escape(tweet.content.text)}</p>

         <footer class="footer-tweets">
           <div class="footer-time">${finalDate}</div>
           <div class="footer-icons"> 
             <div class="icon star">&starf;</div> 
             <div class="icon arrow">&#8633;</div> 
             <div class="icon heart">&#9829;</div>
           </div>
         </footer>

      </div>
      `;
    return $tweet;
  };

  const $form = $("#form");
  const $text = $('#tweet-text');
  const $error = $('#error');

  $form.on("submit", function(event) {
    // Dont want our page to reload
    event.preventDefault();
    // Encode a set of form elements as a string for submission.
    const serialized = $form.serialize();

    if ($text.val() === '' || $text.val() === null) {
    // Showing 2sec. error while input is empty!
      $error.css('display', 'block').text('Your tweet is empty!');
      setTimeout(() => {
        $error.css('display', 'none');
      }, 2000);
    // Showing 3sec. error while input is > 140 characters!
    } else if ($text.val().length > 140) {
      $error.css('display', 'block').text('Your tweet is too long! Must be 140 characters or less!');
      setTimeout(() => {
        $error.css('display', 'none');
      }, 3000);
    } else {
      $.post("/tweets", serialized).then(() => {
        // Cleaning our input
        $text.val('');
        // Setting back to 140 our counter
        $('#tweet-text').siblings().children('.counter').text(140);
        // Running function
        loadTweets();
      });
    }
  });

  //  ========= Loading tweets from JSON file ========= \\
  const loadTweets = function() {
    $.getJSON(`/tweets`)
      .then((tweets) => {
        $('#main-tweets').empty();
        renderTweets(tweets);
      });
  };

  // ========= When scrolling down our "red arrow up" appears ========= \\
  $(window).scroll(function() {
    $("#up").css("display", "flex");
  });

  // ========= Clicking on up button --> going to the top and focus in input ========= \\
  $("#up").click(function() {
    $("html, body").animate({ scrollTop: 0 }, "slow");
    $("#tweet-text").focus();
    $("#form").slideDown("slow");
  });

  //  ========= Show and hde our tweet form ========= \\
  $("#nav-tweet").click(function() {
    $("#form").slideToggle("slow");
  });

  // ========= Show all tweets on my page when page is loaded! ========= \\
  loadTweets();
});
