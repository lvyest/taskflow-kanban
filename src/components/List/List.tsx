import { type FC } from 'react'
import { Droppable, Draggable } from '@hello-pangea/dnd'
import { GrSubtract } from 'react-icons/gr'
import Task from '../Task/Task'
import ActionButton from '../ActionButton/ActionButton'
import type { IList, ITask } from '../../types'
import { useTypedDispatch } from '../../hooks/redux'
import { deleteList, setModalActive } from '../../store/slices/boardsSlice'
import { addLog } from '../../store/slices/loggerSlice'
import { v4 } from 'uuid'
import { setModalData } from '../../store/slices/modalSlice'
import { deleteButton, header, listWrapper, name } from './List.css'

type TListProps = {
  boardId: string;
  list: IList;
}
const List: FC<TListProps> = ({
  list,
  boardId
}) => {

  const dispatch = useTypedDispatch();
  
  const handleListDelete = (listId: string) => {
    dispatch(deleteList({ boardId, listId }));
    dispatch(
      addLog({
        logId: v4(),
        logMessage: `리스트 삭제하기: ${list.listName}`,
        logAuthor: "user",
        logTimestamp: String(Date.now())
      })
    )
  }

  const handleTaskChange = (
    boardId: string,
    listId: string,
    task: ITask
  ) => {
    dispatch(setModalData({boardId, listId, task}));
    dispatch(setModalActive(true));
  }

  return (
    <div
      className={listWrapper}
    >
      <div className={header}>
        <div className={name}>{list.listName}</div>
        <GrSubtract 
          className={deleteButton}
          onClick={() => handleListDelete(list.listId)}
        />
      </div>
      <Droppable droppableId={list.listId}>
        {(provided) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
          >
            {list.tasks.map((task, index) => (
              <Draggable
                draggableId={task.taskId}
                index={index}
                key={task.taskId}
              >
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                    onClick={() => handleTaskChange(boardId, list.listId, task)}
                  >
                    <Task
                      taskName={task.taskName}
                      taskDescription={task.taskDescription}
                      boardId={boardId}
                      id={task.taskId}
                      index={index}
                    />
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
      <ActionButton
        boardId={boardId} 
        listId={list.listId}
      />
    
    </div>
  )
}

export default List