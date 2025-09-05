import React from 'react';
import { DragDropContext, Droppable, Draggable } from '@hello-pangea/dnd';
import { GripVertical } from 'lucide-react';
import { cn } from '../../../lib/utils';
import './DragDropList.css';

const DragDropList = ({ 
  items, 
  onReorder, 
  renderItem, 
  className,
  itemClassName,
  disabled = false 
}) => {
  const handleDragEnd = (result) => {
    if (!result.destination || disabled) return;
    
    const { source, destination } = result;
    if (source.index === destination.index) return;

    const newItems = Array.from(items);
    const [reorderedItem] = newItems.splice(source.index, 1);
    newItems.splice(destination.index, 0, reorderedItem);
    
    onReorder(newItems);
  };

  if (disabled) {
    return (
      <div className={cn('drag-drop-list', className)}>
        {items.map((item, index) => (
          <div 
            key={item.id || index}
            className={cn('drag-item drag-item-disabled', itemClassName)}
          >
            <div className="drag-handle drag-handle-disabled">
              <GripVertical className="w-4 h-4" />
            </div>
            <div className="drag-content">
              {renderItem(item, index)}
            </div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <DragDropContext onDragEnd={handleDragEnd}>
      <Droppable droppableId="drag-drop-list">
        {(provided, snapshot) => (
          <div
            ref={provided.innerRef}
            {...provided.droppableProps}
            className={cn(
              'drag-drop-list',
              {
                'drag-drop-list-dragging': snapshot.isDraggingOver
              },
              className
            )}
          >
            {items.map((item, index) => (
              <Draggable 
                key={item.id || index} 
                draggableId={String(item.id || index)} 
                index={index}
              >
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    className={cn(
                      'drag-item',
                      {
                        'drag-item-dragging': snapshot.isDragging,
                        'drag-item-over': snapshot.isDraggingOver
                      },
                      itemClassName
                    )}
                  >
                    <div 
                      {...provided.dragHandleProps}
                      className="drag-handle"
                      aria-label="Drag to reorder"
                    >
                      <GripVertical className="w-4 h-4" />
                    </div>
                    <div className="drag-content">
                      {renderItem(item, index)}
                    </div>
                  </div>
                )}
              </Draggable>
            ))}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </DragDropContext>
  );
};

export default DragDropList;