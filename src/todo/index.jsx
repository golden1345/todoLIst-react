import React, { useState, useEffect } from "react";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { v4 as uuidv4 } from "uuid";
import tw from "tailwind-styled-components";

const Container = tw.div`
  max-w-md mx-auto mt-10
`;

const Card = tw.div`
  bg-white rounded-lg shadow-lg p-4 mb-4
`;

const Input = tw.input`
  w-full border border-gray-400 rounded-lg px-3 py-2 mb-4
`;

const Button = tw.button`
  bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 mb-3 px-4 rounded
`;

const Delete = tw.button`
  bg-red-500 hover:bg-red-700 text-white text-xs mt-3 font-bold py-2 px-4 rounded
`

const TodoList = () => {
  const [items, setItems] = useState([]);

  useEffect(() => {
    const storedItems = JSON.parse(localStorage.getItem("items"));
    if (storedItems) {
      setItems(storedItems);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("items", JSON.stringify(items));
  }, [items]);

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, reorderedItem);
    setItems(newItems);
  };

  const handleAddItem = (e) => {
    e.preventDefault();
    const newItem = {
      id: uuidv4(),
      text: e.target.item.value,
    };
    setItems([...items, newItem]);
    e.target.item.value = "";
  };

  const handleDeleteItem = (id) => {
    const newItems = items.filter((item) => item.id !== id);
    setItems(newItems);
  };

  return (
    <Container>
      <form onSubmit={handleAddItem}>
        <Input type="text" name="item" placeholder="Новая задача" />
        <Button type="submit">Добавить</Button>
      </form>
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="items">
          {(provided) => (
            <div {...provided.droppableProps} ref={provided.innerRef}>
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <Card
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      ref={provided.innerRef}
                    >
                      <p>{item.text}</p>
                      <Delete onClick={() => handleDeleteItem(item.id)}>
                        Удалить
                      </Delete>
                    </Card>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
    </Container>
  );
};

export default TodoList;