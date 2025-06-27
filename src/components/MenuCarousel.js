import React, { useState, useEffect, useRef } from 'react';

// 에반게리온 설정으로 메뉴 데이터 업데이트
const menuItemsData = [
    { id: 1, title: 'PILOTS', content: 'The designated pilots of the Evangelion units.' },
    { id: 2, title: 'EVANGELION', content: 'The synthetic humanoid entities known as Evangelion.' },
    { id: 3, title: 'ANGELS', content: 'The mysterious beings that threaten humanity.' },
    { id: 4, title: 'NERV', content: 'The special agency created to combat the Angels.' },
    { id: 5, title: 'SEELE', content: 'The secret committee behind NERV.' },
    { id: 6, title: 'IMPACTS', content: 'Cataclysmic events that have reshaped the Earth.' },
    { id: 7, title: 'GEOFRONT', content: 'The massive underground cavern housing NERV headquarters.' },
    { id: 8, title: 'MAGI SYSTEM', content: 'A trio of supercomputers forming the core of NERV.' },
    { id: 9, title: 'LCL', content: 'The breathable, amber-colored liquid that fills an Evangelion\'s entry plug.' }
];

const ITEM_WIDTH = 200; // ITEM_HEIGHT -> ITEM_WIDTH
const VIEWPORT_WIDTH = 800; // VIEWPORT_HEIGHT -> VIEWPORT_WIDTH
const REAL_ITEM_COUNT = menuItemsData.length;
const displayItems = [...menuItemsData, ...menuItemsData, ...menuItemsData];

const MenuCarousel = ({ onMenuSelect, onActiveItemClick, initialDelay }) => {
    const [virtualIndex, setVirtualIndex] = useState(REAL_ITEM_COUNT);
    const listRef = useRef(null);
    const viewportRef = useRef(null);
    const isAnimating = useRef(false);
    const gsap = window.gsap;

    const xOffset = (VIEWPORT_WIDTH / 2) - (ITEM_WIDTH / 2); // yOffset -> xOffset

    useEffect(() => {
        if (!listRef.current) return;
        
        if(isAnimating.current) {
            gsap.to(listRef.current, {
                x: xOffset - (virtualIndex * ITEM_WIDTH), // y -> x
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    isAnimating.current = false;
                    let newIndex = virtualIndex;
                    if (virtualIndex < REAL_ITEM_COUNT) {
                        newIndex += REAL_ITEM_COUNT;
                        setVirtualIndex(newIndex);
                        gsap.set(listRef.current, { x: xOffset - (newIndex * ITEM_WIDTH) }); // y -> x
                    } else if (virtualIndex >= REAL_ITEM_COUNT * 2) {
                        newIndex -= REAL_ITEM_COUNT;
                        setVirtualIndex(newIndex);
                        gsap.set(listRef.current, { x: xOffset - (newIndex * ITEM_WIDTH) }); // y -> x
                    }
                },
            });
        }
    }, [virtualIndex, xOffset, gsap]); // yOffset -> xOffset

    useEffect(() => {
        const activeOriginalIndex = virtualIndex % REAL_ITEM_COUNT;
        const selectedItem = menuItemsData[activeOriginalIndex];
        if (selectedItem) {
            onMenuSelect(selectedItem);
        }
    }, [virtualIndex, onMenuSelect]);

    useEffect(() => {
        gsap.set(listRef.current, { x: xOffset - (REAL_ITEM_COUNT * ITEM_WIDTH) }); // y -> x
        gsap.fromTo(viewportRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: initialDelay });
    }, [initialDelay, xOffset, gsap]); // yOffset -> xOffset

    const handleNavigation = (steps) => {
        if (isAnimating.current) return;
        isAnimating.current = true;
        setVirtualIndex(prevIndex => prevIndex + steps);
    };

    const handleItemClick = (clickedItemIndex) => {
        const currentActiveIndex = virtualIndex % REAL_ITEM_COUNT;
        if (clickedItemIndex === currentActiveIndex) {
            onActiveItemClick(menuItemsData[currentActiveIndex]);
            return;
        }
        let diff = clickedItemIndex - currentActiveIndex;
        if (diff > REAL_ITEM_COUNT / 2) diff -= REAL_ITEM_COUNT;
        if (diff < -REAL_ITEM_COUNT / 2) diff += REAL_ITEM_COUNT;
        
        if (diff !== 0) {
            handleNavigation(diff);
        }
    };

    return (
        <div className="carousel-container-horizontal">
            <div className="carousel-nav-horizontal left">
                <button className="nav-button-horizontal" onClick={() => handleNavigation(-1)}>◄</button>
            </div>
            <div className="carousel-viewport" ref={viewportRef}>
                <div className="carousel-list" ref={listRef}>
                    {displayItems.map((item, index) => (
                        <div
                            key={`${item.id}-${index}`}
                            className={`menu-item ${ (index % REAL_ITEM_COUNT) === (virtualIndex % REAL_ITEM_COUNT) ? 'active' : ''}`}
                            onClick={() => handleItemClick(index % REAL_ITEM_COUNT)}
                        >
                            {item.title}
                        </div>
                    ))}
                </div>
            </div>
             <div className="carousel-nav-horizontal right">
                <button className="nav-button-horizontal" onClick={() => handleNavigation(1)}>►</button>
            </div>
        </div>
    );
};

export default MenuCarousel;