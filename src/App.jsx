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

      setchat([...chat, {
        toMe: true,
        message: data
      }])
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
    console.log(data);

    // 5 баллов - Giga Chad, 4 - Diamond Hands, 3 - Gay, 2 - Nigger, 1 и 0 - Rugger

    // The test is done and you are…

    // Loading…

    // Congratulations, you are «роль»!

    // Now…gtfo of here


    newChat.push({
      toMe: true,
      message: data
    })
    setchat(newChat)

    setblockedInput(false)


  }



  return (
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
                <div className='App_terminal_element_text'>
                  Thinking...
                </div>
              </div>
          }
        </div>
      </div>
      <div className='App_decor'>
        <div className="free_img">
          <img src="/img/gigaSer.png" alt="" />
        </div>
        <div className="free_img" style={{
          opacity: opacity
        }}>
          <img src="/img/gigaSerLight.png" alt="" />
        </div>
      </div>
    </div>
  )
}

export default App
