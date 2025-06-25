import React, { useState, useEffect, useRef } from 'react';

const menuItemsData = [
    { id: 1, title: 'PILOTS', content: 'The designated pilots of the Evangelion units.', theme: 'eva' },
    { id: 2, title: 'EVANGELION', content: 'The synthetic humanoid entities known as Evangelion.', theme: 'eva' },
    { id: 3, title: 'ANGELS', content: 'The mysterious beings that threaten humanity.', theme: 'eva' },
    { id: 4, title: 'NERV', content: 'The special agency created to combat the Angels.', theme: 'eva' },
    { id: 5, title: 'SEELE', content: 'The secret committee behind NERV.', theme: 'eva' },
    { id: 6, title: 'PACT', content: 'The binding contracts made between humans and beasts.', theme: 'dod' },
    { id: 7, title: 'CAIM', content: 'A prince whose kingdom was destroyed, bound by a pact with the red dragon.', theme: 'dod' },
    { id: 8, title: 'ANGELUS', content: 'The ancient and proud red dragon, cynical of humanity.', theme: 'dod' },
    { id: 9, 'title': 'GODDESS', content: 'The key to the seals that hold the world together, a role borne by Furiae.', theme: 'dod' },
    { id: 10, title: 'THE WATCHERS', content: 'Grotesque beings from another world, also known as "gods".', theme: 'dod' }
];

const ITEM_HEIGHT = 60;
const VIEWPORT_HEIGHT = 400;
const REAL_ITEM_COUNT = menuItemsData.length;
const displayItems = [...menuItemsData, ...menuItemsData, ...menuItemsData];

const MenuCarousel = ({ onMenuSelect, onActiveItemClick, initialDelay }) => {
    const [virtualIndex, setVirtualIndex] = useState(REAL_ITEM_COUNT);
    const listRef = useRef(null);
    const viewportRef = useRef(null);
    const isAnimating = useRef(false);
    const gsap = window.gsap;

    const yOffset = (VIEWPORT_HEIGHT / 2) - (ITEM_HEIGHT / 2);

    useEffect(() => {
        if (!listRef.current) return;
        
        if(isAnimating.current) {
            gsap.to(listRef.current, {
                y: yOffset - (virtualIndex * ITEM_HEIGHT),
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    isAnimating.current = false;
                    let newIndex = virtualIndex;
                    if (virtualIndex < REAL_ITEM_COUNT) {
                        newIndex += REAL_ITEM_COUNT;
                        setVirtualIndex(newIndex);
                        gsap.set(listRef.current, { y: yOffset - (newIndex * ITEM_HEIGHT) });
                    } else if (virtualIndex >= REAL_ITEM_COUNT * 2) {
                        newIndex -= REAL_ITEM_COUNT;
                        setVirtualIndex(newIndex);
                        gsap.set(listRef.current, { y: yOffset - (newIndex * ITEM_HEIGHT) });
                    }
                },
            });
        }
    }, [virtualIndex, yOffset, gsap]);
    useEffect(() => {
        const activeOriginalIndex = virtualIndex % REAL_ITEM_COUNT;
        const selectedItem = menuItemsData[activeOriginalIndex];
        if (selectedItem) {
            onMenuSelect(selectedItem);
        }
    }, [virtualIndex, onMenuSelect]);
    useEffect(() => {
        gsap.set(listRef.current, { y: yOffset - (REAL_ITEM_COUNT * ITEM_HEIGHT) });
        gsap.fromTo(viewportRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: initialDelay });
    }, [initialDelay, yOffset, gsap]);
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
        <div style={{ position: 'relative' }}>
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
            <div className="nav-wrapper">
                <div className="carousel-nav top">
                    <button className="nav-button" onClick={() => handleNavigation(-1)}>▲</button>
                </div>
                <div className="carousel-nav bottom">
                    <button className="nav-button" onClick={() => handleNavigation(1)}>▼</button>
                </div>
            </div>
        </div>
    );
};

export default MenuCarousel;