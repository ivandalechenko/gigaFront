import { useEffect, useRef, useState } from 'react'
import './scss/App.scss'


function App() {
  const [count, setCount] = useState(0)
  const [opacity, setopacity] = useState(0);
  const inputRef = useRef(null);
  const [IsFocused, setIsFocused] = useState(false);
  const [text, settext] = useState('');
  const [blockedInput, setblockedInput] = useState(false);
  const [chat, setchat] = useState([]);
  const [rank, setrank] = useState('');
  // const [id, setid] = useState(localStorage.getItem('id') || '');
  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key.length !== 1) {
        if (!['Backspace', 'Enter'].includes(event.key)) {
          event.preventDefault();
        }
      }
    };
    const input = inputRef.current;
    input.addEventListener("keydown", handleKeyDown);

    return () => {
      input.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const getId = () => {
    const id = localStorage.getItem('id')
    if (!id) {
      const newId = `${Date.now()}${Math.floor(Math.random() * 100000)}`
      localStorage.setItem('id', newId)
      return newId
    } else {
      return id
    }
  }

  useEffect(() => {

    const init = async () => {
      const response = await fetch('https://api.gigai.co/quest/getQuest/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json' // Исправленный заголовок
        },
        body: JSON.stringify({
          id: getId()
        }),
      });
      const data = await response.json();

      if (data === "What's up degen! Welcome to Giga Terminal. Giga Chad, diamond hands, gay, rugger or nigger? Answer a few questions and you will figure it out. Ready to start?") {
        setblockedInput(true)
        setchat([...chat, {
          toMe: true,
          message: "What's up degen! Welcome to Giga Terminal."
        }])
        setTimeout(() => {
          setchat([...chat, {
            toMe: true,
            message: "What's up degen! Welcome to Giga Terminal."
          }, {
            toMe: true,
            message: "Giga Chad, diamond hands, gay, rugger or nigger? Answer a few questions and you will figure it out."
          }])
        }, 2000);
        setTimeout(() => {
          setchat([...chat, {
            toMe: true,
            message: "What's up degen! Welcome to Giga Terminal."
          }, {
            toMe: true,
            message: "Giga Chad, diamond hands, gay, rugger or nigger? Answer a few questions and you will figure it out."
          }, {
            toMe: true,
            message: "Ready to start?"
          }])
          setblockedInput(false)
        }, 4000);

      } else if ([
        "Rugger",
        "Nigger",
        "Gay",
        "Diamond Hands",
        "Giga Chad"
      ].includes(data)) {
        setblockedInput(true)
        setloadingType(3)
        setrank(data)
        setchat([...chat, {
          toMe: true,
          message: `Congratulations, you are "${data}"!`
        }])

      } else {
        setchat([...chat, {
          toMe: true,
          message: data
        }])
      }
    }
    init()
  }, [])


  const handleFocus = () => {
    inputRef.current.focus();
  };
  useEffect(() => {
    let newOpacity = opacity;
    newOpacity += 0.3;
    if (newOpacity > 1) {
      newOpacity = 1
    }

    setopacity(newOpacity);
  }, [text]);
  useEffect(() => {
    const opacitiHiderInt = setInterval(() => {
      setopacity((prevOpacity) => {
        if (prevOpacity > 0) {
          const newOpacity = prevOpacity - 0.1;
          return newOpacity;
        }
        return prevOpacity;
      });
    }, 100);

    return () => {
      clearInterval(opacitiHiderInt);
    };
  }, [])

  useEffect(() => {
    console.log(chat);

  }, [chat])

  const [loadingType, setloadingType] = useState(0);

  const sendMessage = async (e) => {
    e.preventDefault()
    const sentText = text.slice(0, text.length);
    console.log(sentText);

    settext('')
    setblockedInput(true)
    let chatOld = JSON.parse(JSON.stringify(chat));
    let newChat = [...chatOld, {
      toMe: false,
      message: sentText
    }];
    setchat(newChat)


    const response = await fetch('https://api.gigai.co/quest/answer/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json' // Исправленный заголовок
      },
      body: JSON.stringify({
        answer: sentText,
        id: getId()
      }),
    });
    const data = await response.json();
    if (data === "What's up degen! Welcome to Giga Terminal. Giga Chad, diamond hands, gay, rugger or nigger? Answer a few questions and you will figure it out. Ready to start?") {
      setblockedInput(true)
      setchat([...chat, {
        toMe: true,
        message: "What's up degen! Welcome to Giga Terminal."
      }])
      setTimeout(() => {
        setchat([...chat, {
          toMe: true,
          message: "What's up degen! Welcome to Giga Terminal."
        }, {
          toMe: true,
          message: "Giga Chad, diamond hands, gay, rugger or nigger? Answer a few questions and you will figure it out."
        }])
      }, 2000);
      setTimeout(() => {
        setchat([...chat, {
          toMe: true,
          message: "What's up degen! Welcome to Giga Terminal."
        }, {
          toMe: true,
          message: "Giga Chad, diamond hands, gay, rugger or nigger? Answer a few questions and you will figure it out."
        }, {
          toMe: true,
          message: "Ready to start?"
        }])
        setblockedInput(false)
      }, 4000);

    } else if ([
      "Rugger",
      "Nigger",
      "Gay",
      "Diamond Hands",
      "Giga Chad"
    ].includes(data)) {

      setloadingType(1)

      setTimeout(() => {
        setloadingType(2)
      }, 2000);
      setTimeout(() => {
        setloadingType(3)
        newChat.push({
          toMe: true,
          message: `Congratulations, you are "${data}"!`
        })
        setrank(data)
        setchat(newChat)
      }, 4000);


    } else {
      newChat.push({
        toMe: true,
        message: data
      })
      setchat(newChat)

      setblockedInput(false)
    }

  }
  // 


  return (
    <div className='App_andNoise'>
      <div className="free_img App_noise">
        <video autoPlay loop muted playsInline >
          <source src="/img/noise.mp4" type="video/mp4" />
        </video>
      </div>
      <div className='App'>

        <div className='App_bgs'>
          <div className="App_bg free_img">
            <div className='App_bg_inner'></div>
          </div>
          <div className="App_bgLight free_img" style={{
            opacity: opacity
          }}>
            <div className='App_bgLight_inner'></div>
          </div>
        </div>
        <div className='App_terminalAndDeco'>
          <form className="free_img" onSubmit={sendMessage}>
            <input type="text" ref={inputRef}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)} onChange={(e) => { !blockedInput && settext(e.target.value) }} value={text} />
          </form>
          <div className='free_img App_mediaEl App_mediaEl_0'>
            GIGA_TERMINAL
          </div>
          <div className='free_img App_mediaEl App_mediaEl_1'>
            <img src="/img/dex.svg" alt="" />
          </div>
          <div className='App_terminal' onClick={() => {
            handleFocus()
          }}>

            {
              chat.map((message, index) => {
                return <div className='App_terminal_element' key={`message-${index}`}>
                  <div className='App_terminal_element_from'>
                    {message.toMe ? <>G &gt;</> : <>Y &gt;</>}
                  </div>
                  <div className='App_terminal_element_text'>
                    {message.message}
                  </div>
                </div>
              })
            }
            {
              !blockedInput ?
                <div className='App_terminal_element'>
                  <div className='App_terminal_element_from'>
                    Y &gt;
                    {/* &lt; */}
                  </div>
                  <div className='App_terminal_element_text'>
                    {text}
                    {
                      IsFocused && <div className="free_img App_terminal_element_text_caret_wrapper">
                        <span className='App_terminal_element_text_caret'></span>
                      </div>
                    }
                  </div>
                </div>
                :
                <div className='App_terminal_element'>
                  <div className='App_terminal_element_from'>
                    G &gt;
                    {/* &lt; */}
                  </div>
                  {loadingType < 3 ? <div className={`App_terminal_element_text `}>
                    {loadingType === 0 && "Thinking..."}
                    {loadingType === 1 && "The test is done and you are..."}
                    {loadingType === 2 && "Loading..."}
                  </div> : <a className='App_terminal_element_text_link App_terminal_element_text' target='_blank' href={`https://x.com/intent/post?hashtags=GIGAI&text=I+REACHED+RANK+'${rank}'+ON+GIGAI.CO%0D%0A&url=https://gigai.co%0D%0A`}>
                    Share to your frens!
                  </a>}

                </div>
            }
          </div>
          <div className='free_img App_mediaEl App_mediaEl_2'>
            <img src="/img/tg.svg" alt="" />
          </div>
          <a href="https://google.com" target='_blank' className='free_img App_mediaEl App_mediaEl_3'>
            <img src="/img/x.svg" alt="" />
          </a>
        </div>
        <div className='App_decor'>
          <div className="free_img">
            <img src="/img/gigaSer.png" alt="" />
          </div>
          <div className="free_img App_decor_light" style={{
            opacity: opacity
          }}>
            <img src="/img/gigaSerLight.png" alt="" />
          </div>
        </div>
      </div>
    </div>

  )
}

export default App
