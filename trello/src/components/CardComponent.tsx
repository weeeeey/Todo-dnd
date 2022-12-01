import { Draggable } from "react-beautiful-dnd";
import styled from "styled-components";
import React from "react";
import { AiOutlineDelete } from "react-icons/ai";
import { useRecoilState } from "recoil";
import { todoState, ITodoState } from "./atoms";
import { RiDragMove2Line } from "react-icons/ri";

const Card = styled.div<{ isDragging: boolean }>`
    border-radius: 5px;
    /* 맨 오른쪽으로 보내는 법 flex, justify-content */
    margin-bottom: 5px;
    padding: 5px 0;
    display: flex;
    justify-content: space-between;
    background-color: ${(props) =>
        props.isDragging ? "#e4f2ff" : props.theme.cardColor};
    box-shadow: ${(props) =>
        props.isDragging ? "0px 2px 5px rgba(0,0,0,0.5)" : "none"};
`;

interface IDraggableProps {
    todoId: number;
    todoText: string;
    index: number;
    boardId: string;
}

// AiOutlineDelete
const CardComponent = ({
    boardId,
    todoId,
    todoText,
    index,
}: IDraggableProps) => {
    const [todos, setTodo] = useRecoilState<ITodoState>(todoState);
    const handleDeleteCard = (e: React.FormEvent<HTMLButtonElement>) => {
        // todos[boardId].map((a) => {
        //     console.log(a.id);
        // });
        // console.log(todoId);
        // setTodo(todos[boardId].filter(id => id !== todoId + ""));
        // [헤맸던 포인트]
        // 1. setTodo를 할때 Obj 생각을 안해서 {}를 안감싸줌
        // 2. 위 문장엔 쓴 것처럼 각 객체는 id와 text가 있는 덩어리 들인데 바로 id라고 표기함
        // 3. 해당 보드를 고치는 것이므로
        // 4. {...todos, todos[boardId]= todos[].filter} 가 아닌 밑에처럼 해줬어야함
        setTodo({
            ...todos,
            [boardId]: todos[boardId].filter((a) => a.id !== todoId),
        });
    };
    return (
        // number + "" => string,   draggabledId 는 string 형식
        <Draggable draggableId={todoId + ""} index={index}>
            {(magic, snapshot) => (
                <Card
                    isDragging={snapshot.isDragging}
                    ref={magic.innerRef}
                    {...magic.draggableProps}
                >
                    <div>
                        <span {...magic.dragHandleProps}>
                            <RiDragMove2Line style={{ fontSize: "15px" }} />
                        </span>
                        <span style={{ fontSize: "1rem" }}> {todoText}</span>
                    </div>
                    <button onClick={handleDeleteCard}>
                        <AiOutlineDelete />
                    </button>
                </Card>
            )}
        </Draggable>
    );
};

export default React.memo(CardComponent);
// React.memo로 감싸주면서 변화가 일어나는 컴포넌트만 리렌더링 해줌
// 해주지 않을시 대용량 데이터를 dnd 하면서 버벅임 발생(모든걸 다 리렌더링 해줘서)
