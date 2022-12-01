import styled from "styled-components";
import { Droppable } from "react-beautiful-dnd";
import CardComponent from "./CardComponent";
import { useForm } from "react-hook-form";
import { boardState, ITodo, todoState } from "./atoms";
import { useRecoilState, useSetRecoilState } from "recoil";

const Wrapper = styled.div`
    width: 300px;
    padding-top: 10px;
    background-color: ${(prop) => prop.theme.boardColor};
    border-radius: 5px;
    min-height: 200px;
    display: flex;
    flex-direction: column;
    overflow: hidden;
`;
const Title = styled.h2`
    text-align: center;
    font-weight: 600;
    margin-bottom: 10px;
    font-size: 18px;
`;
const Area = styled.div<IAreaProps>`
    background-color: ${(props) =>
        props.isDraggingOver
            ? "#dfe6e9"
            : props.isDraggingFromThis
            ? "#b2bec3"
            : "transparent"};
    flex-grow: 1;
    transition: background-color 0.3s ease-in-out;
    padding: 20px;
`;
const Form = styled.form`
    width: 100%;
    input {
        width: 100%;
    }
`;

interface IAreaProps {
    isDraggingFromThis: boolean;
    isDraggingOver: boolean;
}

interface IForm {
    todo: string;
}

interface IBoardProps {
    todos: ITodo[];
    boardId: string;
}

const Board = ({ todos, boardId }: IBoardProps) => {
    const { register, setValue, handleSubmit } = useForm<IForm>();
    const [todoAtom, setTodo] = useRecoilState(todoState);
    const setBoard = useSetRecoilState(boardState);
    const onVaild = ({ todo }: IForm) => {
        const newTodo = {
            id: Date.now(),
            text: todo,
        };
        setTodo((allBoards) => {
            return {
                ...allBoards,
                [boardId]: [newTodo, ...allBoards[boardId]],
            };
        });
        setValue("todo", "");
    };
    const handleDeleteBoards = (e: React.FormEvent<HTMLButtonElement>) => {
        const temp = { ...todoAtom };
        delete temp[boardId];
        setTodo(temp);
        setBoard((props) => props.filter((name) => name !== boardId));
    };
    return (
        <Wrapper>
            <Form onSubmit={handleSubmit(onVaild)}>
                <input
                    {...register("todo", { required: "값을 입력하세요" })}
                    type="text"
                    placeholder={`Add task on ${boardId}`}
                />
            </Form>
            <button onClick={handleDeleteBoards}>Delete</button>
            <Title>{boardId}</Title>
            <Droppable droppableId={boardId}>
                {(magic, info) => (
                    <Area
                        isDraggingOver={info.isDraggingOver}
                        isDraggingFromThis={Boolean(info.draggingFromThisWith)}
                        ref={magic.innerRef}
                        {...magic.droppableProps}
                    >
                        {todos.map((todo, index) => (
                            <CardComponent
                                key={todo.id}
                                boardId={boardId}
                                index={index}
                                todoId={todo.id}
                                todoText={todo.text}
                            />
                        ))}
                        {magic.placeholder}
                    </Area>
                )}
            </Droppable>
        </Wrapper>
    );
};

export default Board;
