import React, { useState, useEffect, useRef } from 'react';

// --- 메뉴 데이터 (기존과 동일) ---
const menuItemsData = [
    { id: 1, title: 'PILOTS', content: 'The designated pilots of the Evangelion units, chosen to synchronize with the giant bio-machines.' },
    { id: 2, title: 'EVANGELION', content: 'The synthetic humanoid entities created by NERV to defend against the Angels.' },
    { id: 3, title: 'ANGELS', content: 'The mysterious, alien beings that threaten humanity, triggering the Second Impact.' },
    { id: 4, title: 'NERV', content: 'A special UN agency created to lead the defense of humanity against the Angels.' },
    { id: 5, title: 'SEELE', content: 'The secret and powerful committee that manipulates global events from the shadows, funding NERV.' },
    { id: 6, title: 'SECOND IMPACT', content: 'A global cataclysm that occurred on September 13, 2000, caused by contact with the first Angel, Adam.'},
    { id: 7, title: 'LCL', content: 'An orange, translucent liquid that fills the Evangelion entry plugs, allowing pilots to mentally link with their units.'},
    { id: 8, title: 'S² ENGINE', content: 'A perpetual power organ possessed by the Angels, providing them with a limitless energy supply.'},
    { id: 9, title: 'HUMAN INSTRUMENTALITY', content: 'SEELE\'s clandestine goal: the forced evolution of humanity by merging all individual souls into a single entity.' }
];

const REAL_ITEM_COUNT = menuItemsData.length;
const displayItems = [...menuItemsData, ...menuItemsData, ...menuItemsData];

const MenuCarousel = ({ onActiveItemClick, initialDelay }) => {
    // ▼▼▼ [수정] 너비 관련 값들을 state로 관리 ▼▼▼
    const [itemWidth, setItemWidth] = useState(0);
    const [viewportWidth, setViewportWidth] = useState(0);
    // ▲▲▲ [수정] 여기까지 ▲▲▲

    const [virtualIndex, setVirtualIndex] = useState(REAL_ITEM_COUNT);
    const listRef = useRef(null);
    const viewportRef = useRef(null);
    const isAnimating = useRef(false);
    const gsap = window.gsap;
    
    // ▼▼▼ [추가] 브라우저 리사이즈를 감지하여 너비 state를 업데이트하는 useEffect ▼▼▼
    useEffect(() => {
        const calculateWidths = () => {
            const currentWidth = window.innerWidth;
            if (currentWidth <= 768) {
                setItemWidth(156);
                setViewportWidth(currentWidth);
            } else if (currentWidth <= 1024) {
                setItemWidth(220);
                setViewportWidth(660); // App.css에 정의된 tablet 사이즈
            } else {
                setItemWidth(220);
                setViewportWidth(880); // App.css에 정의된 desktop 사이즈
            }
        };

        // 첫 로드 시 한번 실행
        calculateWidths();

        // resize 이벤트 리스너 추가
        window.addEventListener('resize', calculateWidths);

        // 컴포넌트가 언마운트될 때 이벤트 리스너 제거 (메모리 누수 방지)
        return () => window.removeEventListener('resize', calculateWidths);
    }, []); // 빈 배열을 전달하여 컴포넌트 마운트 시 한번만 실행되도록 설정
    // ▲▲▲ [추가] 여기까지 ▲▲▲

    // 화면 중앙에 아이템을 위치시키기 위한 X축 오프셋 계산 (state 값 사용)
    const xOffset = (viewportWidth / 2) - (itemWidth / 2);

    useEffect(() => {
        if (!listRef.current || itemWidth === 0) return; // itemWidth가 설정되기 전에는 실행 방지
        
        if (isAnimating.current) {
            gsap.to(listRef.current, {
                x: xOffset - (virtualIndex * itemWidth), // state 값 사용
                duration: 0.5,
                ease: 'power2.out',
                onComplete: () => {
                    isAnimating.current = false;
                    let newIndex = virtualIndex;
                    if (virtualIndex < REAL_ITEM_COUNT) {
                        newIndex += REAL_ITEM_COUNT;
                        setVirtualIndex(newIndex);
                        gsap.set(listRef.current, { x: xOffset - (newIndex * itemWidth) }); // state 값 사용
                    } else if (virtualIndex >= REAL_ITEM_COUNT * 2) {
                        newIndex -= REAL_ITEM_COUNT;
                        setVirtualIndex(newIndex);
                        gsap.set(listRef.current, { x: xOffset - (newIndex * itemWidth) }); // state 값 사용
                    }
                },
            });
        } else {
            // 애니메이션 중이 아닐 때 (리사이즈 시) 즉시 위치 업데이트
            gsap.set(listRef.current, { x: xOffset - (virtualIndex * itemWidth) });
        }
    }, [virtualIndex, xOffset, itemWidth, gsap]); // xOffset, itemWidth 의존성 추가
    
    // 초기 설정
    useEffect(() => {
        if (itemWidth === 0) return; // itemWidth가 설정되기 전에는 실행 방지
        gsap.set(listRef.current, { x: xOffset - (REAL_ITEM_COUNT * itemWidth) }); // state 값 사용
        gsap.fromTo(viewportRef.current, { autoAlpha: 0 }, { autoAlpha: 1, duration: 1, delay: initialDelay });
    }, [initialDelay, xOffset, itemWidth, gsap]); // xOffset, itemWidth 의존성 추가
    
    // 네비게이션 버튼 핸들러 (기존과 동일)
    const handleNavigation = (steps) => {
        if (isAnimating.current) return;
        isAnimating.current = true;
        setVirtualIndex(prevIndex => prevIndex + steps);
    };
    
    // 메뉴 아이템 클릭 핸들러 (기존과 동일)
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
        <div className="carousel-container">
            <div className="carousel-nav left">
                <button className="nav-button" onClick={() => handleNavigation(-1)}>ᐊ</button>
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
            <div className="carousel-nav right">
                <button className="nav-button" onClick={() => handleNavigation(1)}>ᐅ</button>
            </div>
        </div>
    );
};

export default MenuCarousel;