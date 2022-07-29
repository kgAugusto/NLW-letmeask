import { useNavigate, useParams } from 'react-router-dom';

import logoImg from '../assets/images/logo.svg'
import deleteImg from '../assets/images/delete.svg';
import checkImg from '../assets/images/check.svg';
import answerImg from '../assets/images/answer.svg';

import { Button } from '../components/Button'
import { Question } from '../components/Question';
import { RoomCode } from '../components/RoomCode';
//import { useAuth } from '../hooks/useAuth';
import { useRoom } from '../hooks/useRoom';
import { database } from '../services/firebase';


import '../styles/room.scss';


type RoomParamsProps = {
    id: any;
}

export function AdminRoom() {
    //const { user } = useAuth();
    const params = useParams<RoomParamsProps>();
    const roomId = params.id

    const { title, questions } = useRoom(roomId);
    const history = useNavigate();

    async function handleEndRoom() {
        await database.ref(`rooms/${roomId}`).update({
            endeAt: new Date()
        })

        history('/');
    }

    async function handleCheckQuestionAsAnswered(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isAnswered: true
        });
    }

    async function handleHighlightQuestion(questionId: string) {
        await database.ref(`rooms/${roomId}/questions/${questionId}`).update({
            isHighlighted: true
        });
    }

    async function handleDeleteQuestion(questionId: string) {
        if (window.confirm('Tem certeza que você deseja excluir essa pergunta')) {
            await database.ref(`rooms/${roomId}/questions/${questionId}`).remove();
        }
    }

    return (
        <div className='page-room'>
            <header>
                <div className="content">
                    <img src={logoImg} alt="Letmeask" />
                    <div>
                        <RoomCode code={roomId} />
                        <Button isOutlined onClick={handleEndRoom}>Encerrear Sala</Button>
                    </div>
                </div>
            </header>

            <main>
                <div className='room-title'>
                    <h1>Sala {title}</h1>
                    {questions.length > 0 && <span>{questions.length} Pergunta(s)</span>}
                </div>

                <div className='question-list'>
                    {questions.map(question => {
                        return (
                            <Question
                                key={question.id}
                                content={question.content}
                                author={question.author}
                                isAnswered={question.isAnswered}
                                isHighlighted={question.isHighlighted}
                            >
                                {
                                    !question.isAnswered && (
                                        <>
                                            <button
                                                type='button'
                                                onClick={() => handleCheckQuestionAsAnswered(question.id)}>
                                                <img src={checkImg} alt="Marcar pergunta como respondida" />
                                            </button>
                                            <button
                                                type='button'
                                                onClick={() => handleHighlightQuestion(question.id)}>
                                                <img src={answerImg} alt="Dar destaque a pergunta" />
                                            </button>
                                        </>
                                    )
                                }
                                <button
                                    type='button'
                                    onClick={() => handleDeleteQuestion(question.id)}>
                                    <img src={deleteImg} alt="Remover Pergunta" />
                                </button>
                            </Question>
                        )
                    })}
                </div>

            </main>
        </div>
    )
}