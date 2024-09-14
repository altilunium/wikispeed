# WikiSpeed Leaderboard

A visualization of the rate of edits to Wikipedia in various languages.



https://github.com/user-attachments/assets/f62c38e2-d6c4-44ef-ba8f-fc8562b72882




This is essentially a replica of the original **[Wikipulse](https://web.archive.org/web/20220413111810/http://wikipulse.herokuapp.com)** (now defunct),
created in 2011 by [Ed Summers](http://mith.umd.edu/people/person/ed-summers/),
but using the new ~~[Recent Changes stream](https://www.mediawiki.org/wiki/API:Recent_changes_stream)
over [websockets](https://en.wikipedia.org/wiki/WebSocket),~~
[EventStreams service](https://wikitech.wikimedia.org/wiki/Event_Platform/EventStreams_HTTP_Service)
for server-sent events (SSE)
via the [EventSource API](https://developer.mozilla.org/en-US/docs/Web/API/EventSource),
instead of the old
[Recent Changes IRC feeds](https://meta.wikimedia.org/wiki/IRC/Channels#Recent_changes).
This allows for a more convenient and completely server-less setup.

Besides the backend change, a functional difference from Wikipulse
is that WikiSpeed uses a logarithmic scale in the gauge charts,
which allows for a better visualization of the wide range of editing rates
of the various projects. (See https://github.com/edsu/wikipulse/issues/13)

**Update**: The original Wikipulse is no longer available since Heroku discontinued their free tier in November 2022.

## Credits / thanks

- Ed Summers for [Wikipulse](https://web.archive.org/web/20220413111810/http://wikipulse.herokuapp.com/)
- Krinkle for the [RCFeed demo code](http://codepen.io/Krinkle/pen/laucI/) (no longer used)
- Andrew Otto for the [EventStreams demo code](https://codepen.io/ottomata/pen/VKNyEw/)
- WMF devs for providing the [RCFeed](https://www.mediawiki.org/wiki/API:Recent_changes_stream) service
- HighCharts for their wonderful [charts library](http://www.highcharts.com/)

## See also

You might be interested in these similar projects
that also visualize real-time edits to Wikimedia projects:

- [Wikistream](http://wikistream.wmflabs.org/)
- [Listen to Wikipedia](http://listen.hatnote.com/)
- [Recent Changes map](http://rcmap.hatnote.com/) and [Wikipedia Vision](http://www.lkozma.net/wpv/)
- [Wikipedia and Wikidata Realtime Edit Stats](https://web.archive.org/web/20210601185835/https://wikipedia-edits.herokuapp.com/)
