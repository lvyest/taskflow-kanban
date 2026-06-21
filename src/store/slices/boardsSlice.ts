import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import type { IBoard, IList, ITask } from "../../types";

type TBoardsState = {
    modalActive: boolean;
    boardArray: IBoard[]
}

type TAddBoardAction = {
    board: IBoard;
}

type TDeleteListAction = {
    boardId: string;
    listId: string;
}

type TAddListAction = {
    boardId: string;
    list: IList;
}

type TAddTaskAction = {
    boardId: string;
    listId: string;
    task: ITask;
}

type TDeleteTaskAction = {
    boardId: string,
    listId: string,
    taskId: string
}

type TDeleteBoardAction = {
    boardId: string;
}

type TSortAction = {
    boardId: string;
    droppableIdStart: string;
    droppableIdEnd: string;
    droppableIndexStart: number;
    droppableIndexEnd: number;
    draggableId: string;
}


const initialState : TBoardsState = {
    modalActive: false,
    boardArray: [
        {
            boardId: 'board-0',
            boardName: "첫 번째 게시물",
            lists: [
                {
                    listId: "list-0",  
                    listName: "List 1",
                    tasks: [
                        {
                            taskId: "task-0",
                            taskName: "Task 1",
                            taskDescription: "Description",
                            taskOwner: "John",
                        },
                        {
                            taskId: "task-1",
                            taskName: "Task 2",
                            taskDescription: "Description",
                            taskOwner: "John",
                        }
                    ]
                },
                {
                    listId: "list-1",
                    listName: "List 2",
                    tasks: [
                        {
                            taskId: "task-3",
                            taskName: "Task 3",
                            taskDescription: "Description",
                            taskOwner: "John",
                        }
                    ]
                }
            ]
        }
    ]
}

const boardsSlice = createSlice({
    name: "board",
    initialState,
    reducers: {
        addBoard: (state, {payload} : PayloadAction<TAddBoardAction>) => {
            state.boardArray.push(payload.board);
        },

        deleteBoard: (state, {payload}: PayloadAction<TDeleteBoardAction>) => {
            state.boardArray = state.boardArray.filter(
                board => board.boardId !== payload.boardId
            )
        },

        addList: (state, {payload} : PayloadAction<TAddListAction>) => {
            const board = state.boardArray.find(
                board => board.boardId === payload.boardId
            )
            board?.lists.push(payload.list);
        },

        addTask: (state, {payload} : PayloadAction<TAddTaskAction>) => {
            const board = state.boardArray.find(
                board => board.boardId === payload.boardId
            )
            const list = board?.lists.find(
                list => list.listId === payload.listId
            )
            list?.tasks.push(payload.task);
        },

        updateTask: (state, {payload}: PayloadAction<TAddTaskAction>) => {
            state.boardArray = state.boardArray.map(board =>
                board.boardId === payload.boardId
                ?
                {
                    ...board,
                    lists: board.lists.map(list =>
                        list.listId === payload.listId
                        ?
                        {
                            ...list,
                            tasks: list.tasks.map(task =>
                                task.taskId === payload.task.taskId
                                ? payload.task
                                : task
                            )
                        }
                        :
                        list
                    )
                }
                :
                board
            )
        },
        
        deleteTask: (state, {payload} : PayloadAction<TDeleteTaskAction>)=> {
            state.boardArray = state.boardArray.map(board =>
                board.boardId === payload.boardId
                ?
                {
                    ...board,
                    lists: board.lists.map(list =>
                        list.listId === payload.listId
                        ? {
                            ...list,
                            tasks: list.tasks.filter(
                                task => task.taskId !== payload.taskId
                            )
                        }
                        : list
                    )
                }
                : board
            )
        },

        deleteList: (state, {payload} : PayloadAction<TDeleteListAction>) => {
            state.boardArray = state.boardArray.map(
                board => 
                    board.boardId === payload.boardId
                    ?
                    {
                        ...board,
                        lists: board.lists.filter(
                            list => list.listId !== payload.listId
                        )
                    }
                    :
                    board
            )
        },

        setModalActive: (state, {payload}: PayloadAction<boolean>) => {
            state.modalActive = payload;
        },

        sort: (state, {payload}: PayloadAction<TSortAction>) => {
            const board = state.boardArray.find(
                board => board.boardId === payload.boardId
            )
            if(!board) return;

            // 같은 리스트 내에서 순서만 변경
            if(payload.droppableIdStart === payload.droppableIdEnd){
                const list = board.lists.find(
                    list => list.listId === payload.droppableIdStart
                )
                if(!list) return;
                const [movedTask] = list.tasks.splice(payload.droppableIndexStart, 1);
                list.tasks.splice(payload.droppableIndexEnd, 0, movedTask);
                return;
            }

            // 다른 리스트로 이동
            const listStart = board.lists.find(
                list => list.listId === payload.droppableIdStart
            )
            const listEnd = board.lists.find(
                list => list.listId === payload.droppableIdEnd
            )
            if(!listStart || !listEnd) return;

            const [movedTask] = listStart.tasks.splice(payload.droppableIndexStart, 1);
            listEnd.tasks.splice(payload.droppableIndexEnd, 0, movedTask);
        }


    }
})

export const {addBoard, deleteBoard, deleteList, deleteTask, updateTask, setModalActive, addTask, addList, sort} = boardsSlice.actions;
export const boardsReducer = boardsSlice.reducer;