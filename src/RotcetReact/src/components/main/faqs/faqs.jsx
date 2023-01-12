import React, {useState} from 'react'

const Faqs = () => {

    const [active, setActive] = useState([]);
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

    const questions = [
                {
                    question: 'When do you stop selling tickets?',
                    answer: 'Abilities forfeited situation extremely my to he resembled. Old had conviction discretion understood put principles you. Match means keeps round one her quick. She forming two comfort invited. Yet she income effect edward. Entire desire way design few. Mrs sentiments led solicitude estimating friendship fat. Meant those event is weeks state it to or. Boy but has folly charm there its. Its fact ten spot drew.'
                },
                {
                    question: 'When does the cinema open?',
                    answer: 'Style never met and those among great. At no or september sportsmen he perfectly happiness attending. Depending listening delivered off new she procuring satisfied existence. Person plenty answer to exeter it if.'
                },
                {
                    question: 'What forms of ID do you accept?',
                    answer: 'May indulgence difficulty ham can put especially. Bringing remember for supplied her why was confined. Middleton principle did she procuring extensive believing add. Weather adapted prepare oh is calling. These wrong of he which there smile to my front. He fruit oh enjoy it of whose table. Cultivated occasional old her unpleasing unpleasant. At as do be against pasture covered viewing started. Enjoyed me settled mr respect no spirits civilly.'
                },
                {
                    question: 'Can I change my seat?',
                    answer: 'Lose eyes get fat shew. Winter can indeed letter oppose way change tended now. So is improve my charmed picture exposed adapted demands. Received had end produced prepared diverted strictly off man branched. Known ye money so large decay voice there to. Preserved be mr cordially incommode as an. He doors quick child an point at. Had share vexed front least style off why him.'
                },
                {
                    question: 'What happens if I am late?',
                    answer: 'Scarcely on striking packages by so property in delicate. Up or well must less rent read walk so be. Easy sold at do hour sing spot. Any meant has cease too the decay. Since party burst am it match. By or blushes between besides offices noisier as. Sending do brought winding compass in. Paid day till shed only fact age its end. Carriage quitting securing be appetite it declared. High eyes kept so busy feel call in. Would day nor ask walls known. But preserved advantage are but and certainty earnestly enjoyment.'
                }
    ]

    return (
        <div className='faqs'>
            <div className='misc-header'>
                <img src="/static/images/logo.png" alt="Logo"/>
                <h1>FAQs</h1>
            </div>
            <ul>
                {questions.map((question) => {
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
                })}
            </ul>
        </div>
  )
}

export default Faqs