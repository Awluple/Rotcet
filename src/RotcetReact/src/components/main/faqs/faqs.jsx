import React, {useState, useEffect} from 'react'
import axios from 'axios'

import LoadingGif from 'media/gifs/loading.jsx'

const Faqs = () => {

    const [active, setActive] = useState([]);
    const [questions, setQuestions] = useState([]);
    const [initialLoad, setInitialLoad] = useState([]);

    const arrow = <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M0 7.33l2.829-2.83 9.175 9.339 9.167-9.339 2.829 2.83-11.996 12.17z"/></svg>

    const changeActive = (question) => {
        if(!active.includes(question)) {
            setActive(active.concat([question]))
        } else {
            setActive(active.map(e => {if(e !== question) return e}))
        }
        setInitialLoad(false);
    }

    const getClassName = (question) => {
        if(initialLoad) return "-hidden faqs__answer-initial"
        if(!active.includes(question)) {
            return "-hidden"
        } else {
            return "-active"
        }
    }

    useEffect(() => {
      axios.get('/api/faqs')
      .then(res => {
        setQuestions(res.data)
      })

    }, [])

    return (
        <div className='faqs'>
            <div className='misc-header'>
                <img src="/static/images/logo.png" alt="Logo"/>
                <h1>FAQs</h1>
            </div>
            <ul>
                {questions != null ? questions.map((question) => {
                    return (
                        <li key={question.question}>
                            <div onClick={() => {changeActive(question.question)}} className={`faqs__question faqs__question${getClassName(question.question)}`}>
                                <h3>{question.question}</h3>
                                {arrow}
                            </div>
                            <div className={`faqs__answer faqs__answer${getClassName(question.question)}`}>
                                <p>{question.answer}</p>
                            </div>
                        </li>
                    )
                })
                :
                <LoadingGif />

            }
            </ul>
        </div>
  )
}

export default Faqs