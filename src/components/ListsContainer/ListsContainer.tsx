import { type FC } from 'react'
import { DragDropContext, type DropResult } from '@hello-pangea/dnd';
import List from '../List/List';
import ActionButton from '../ActionButton/ActionButton';
import type { IList } from '../../types';
import { useTypedDispatch } from '../../hooks/redux';
import { sort } from '../../store/slices/boardsSlice';
import { addLog } from '../../store/slices/loggerSlice';
import { v4 } from 'uuid';
import { listsContainer } from './ListsContainer.css';

type TListsContainerProps = {
  boardId: string;
  lists: IList[];
}
const ListsContainer:FC<TListsContainerProps> = ({
  lists,
  boardId
}) => {
  const dispatch = useTypedDispatch();

  const handleDragEnd = (result: DropResult) => {
    const { destination, source, draggableId } = result;

    // 보드 밖으로 드롭했거나 위치가 동일하면 무시
    if (!destination) return;
    if (
      destination.droppableId === source.droppableId &&
      destination.index === source.index
    ) {
      return;
    }

    dispatch(
      sort({
        boardId,
        droppableIdStart: source.droppableId,
        droppableIdEnd: destination.droppableId,
        droppableIndexStart: source.index,
        droppableIndexEnd: destination.index,
        draggableId,
      })
    )

    dispatch(
      addLog({
        logId: v4(),
        logMessage: `일 이동하기`,
        logAuthor: "User",
        logTimestamp: String(Date.now()),
      })
    )
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <div className={listsContainer}>
        {
          lists.map(list => (
            <List
              key={list.listId}
              list={list}
              boardId={boardId}
            />
          ))
        }
      <ActionButton
        boardId={boardId}
        listId={""}
        list
      />
      </div>
    </DragDropContext>
  )
}

export default ListsContainer