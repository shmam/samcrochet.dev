import React, { useEffect, useState } from 'react';
import ReactGA, { EventArgs } from 'react-ga';
import axios from 'axios';
import dayjs from 'dayjs';
import './App.scss';
import { Content, Emoji, Track, VisitorInfo } from './types';
import Globe from './Globe';

const GA_TRACKING_ID = 'UA-208886147-1';

ReactGA.initialize(GA_TRACKING_ID);

const staticContent: Content = {
  'bodyHeadline': '',
  'body': [
    'Sam Crochet is ...',
  ],
  'projectHeadline': '',
  'projects': [],
}

const App: React.FC = () => {
  const [content, setContent] = useState<Content>(staticContent);
  const [lastSong, setLastSong] = useState<Track>();
  const [pageContentSize, setPageContentSize] = useState<Array<number>>([554363]);
  const [allEmojis, setAllEmojis] = useState<Array<Emoji>>([]);
  const [randomEmoji, setRandomEmoji] = useState<string>();
  const [displayAllEmojis, setDisplayAllEmojis] = useState<boolean>(false);
  const [visitorInfo, setVisitorInfo] = useState<VisitorInfo>();

  // run only one
  useEffect(() => {

    axios.get('https://www.cloudflare.com/cdn-cgi/trace')
    .then(cfTrace => {
      const data = cfTrace.data.trim().split('\n').reduce((obj: any, pair: any)  => {
        pair = pair.split('=');
        return obj[pair[0]] = pair[1], obj;
      }, {});

      const ip = data['ip'];
      axios.get(`https://ipwhois.app/json/${ip}?objects=ip,type,region,city,latitude,longitude`)
      .then(whois => {
        console.log(whois.headers['content-length'])
        setVisitorInfo(whois.data)
      })
    })

    axios.get('https://samcrochetdotcom-default-rtdb.firebaseio.com/content.json')
    .then(contentResponse => {
      setContent(contentResponse.data);
      console.log(contentResponse.headers['content-length']);
    });

    axios.get('https://3083z6i6fl.execute-api.us-east-1.amazonaws.com/?json')
    .then(recentTrackresponse => {
      setLastSong(recentTrackresponse.data);
      console.log(recentTrackresponse.headers['content-length']);
    });

    axios.get('https://allemojis-de327-default-rtdb.firebaseio.com/allEmojis.json')
    .then(emojiResponse => {
      setAllEmojis(emojiResponse.data);
      console.log(emojiResponse.headers['content-length']);

      const randEmoji = emojiResponse.data[Math.floor(Math.random() * emojiResponse.data.length)]
      setRandomEmoji(randEmoji.c)
    })
  }, []);

  const onClickLinkAnalytics = (category: string, link: string, text: string) => {
    ReactGA.event({
      category,
      action: 'click',
      dimension1: link,
      dimension2: text,
    } as EventArgs)
  }

  return (
    <div className='samcrochet'>

      <div className="header grid-x content mono">
        <div className="header__left">
          <Globe lat={visitorInfo?.latitude} long={visitorInfo?.longitude}/>
        </div>
        <div className="header__right">
            <>
              <div className="header__right--greeting">
                {`Hey ${visitorInfo?.ip || '...'}!`}
              </div>
              <div className='highlight'></div>
              <div className="header__right--location">
                {`How's the weather in ${visitorInfo?.city || '...'}, ${visitorInfo?.region || '...'}?`}
              </div>
              <div className="header__right--mobile-disclaimer">
                {'(or if you are on mobile this may be a random city)'}
              </div>
            </>
        </div>
      </div>

      <div className="body grid-x content mono">
        {content.body.map((line: string, key: number) =>
          <div className={`body__line line${key} cell `} key={key}>{line}</div>
        )}
      </div>

      {lastSong &&
        <div className="track grid-x content mono">
          <div className="track__line cell">
            {lastSong.current ?
              <div className="track__line--current">
                <div className="dot"></div>Sam's currently listening to <a onClick={() => onClickLinkAnalytics('projects', lastSong.trackLink, lastSong.title)} href={lastSong.trackLink}>{lastSong.title}</a> by <a onClick={() => onClickLinkAnalytics('projects', lastSong.artistLink, lastSong.artist)} href={lastSong.artistLink}>{lastSong.artist}</a> on <a href='https://open.spotify.com/user/sayuuuummmm?si=f2b307c720fb468a'>Spotify</a>
              </div>
              :
              <div className="track__line--past">
                Sam last listened to  <a onClick={() => onClickLinkAnalytics('projects', lastSong.trackLink, lastSong.title)} href={lastSong.trackLink}>{lastSong.title}</a> by <a onClick={() => onClickLinkAnalytics('projects', lastSong.artistLink, lastSong.artist)} href={lastSong.artistLink}>{lastSong.artist}</a> on <a href='https://open.spotify.com/user/sayuuuummmm?si=f2b307c720fb468a'>Spotify</a> at {dayjs(lastSong.timestamp).toString()}
              </div>
            }
          </div>
        </div>
      }

      { pageContentSize &&
        <div className="headline content mono">
          {`👋 welcome to my ${pageContentSize.reduce((a, b) => a + b,0)} bytes of internet real estate`}
        </div>
      }
    </div>
  )
}

export default App;
