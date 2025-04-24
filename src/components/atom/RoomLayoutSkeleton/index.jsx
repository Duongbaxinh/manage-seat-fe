import React from 'react';

const RoomLayoutSkeleton = () => {
    return (
        <div className="p-4 bg-gray-200 w-full h-full flex justify-center items-center animate-pulse">
            <div className="border-4 border-gray-300 w-full h-full relative bg-white grid grid-rows-5 gap-4 p-6">
                {/* Cổng (doors) - left side */}
                <div className="absolute left-0 top-1/4 w-4 h-10 bg-gray-300 rounded-sm" />
                <div className="absolute left-0 bottom-1/4 w-4 h-10 bg-gray-300 rounded-sm" />

                {/* Wall placeholders (top, bottom, left, right) */}
                <div className="absolute top-0 left-0 w-full h-4 bg-gray-300" />
                <div className="absolute bottom-0 left-0 w-full h-4 bg-gray-300" />
                <div className="absolute top-0 left-0 h-full w-4 bg-gray-300" />
                <div className="absolute top-0 right-0 h-full w-4 bg-gray-300" />

                {/* Room layout skeleton */}
                {[...Array(5)].map((_, rowIndex) => (
                    <div key={rowIndex} className="flex justify-between items-center gap-4">
                        {[...Array(5)].map((_, colIndex) => {
                            const isTable = colIndex % 2 === 0;
                            if (isTable) {
                                return (
                                    <div key={colIndex} className="w-36 h-10 bg-gray-300 rounded-sm" />
                                );
                            } else {
                                return (
                                    <div key={colIndex} className="w-8 h-8 bg-gray-300 rounded-sm" />
                                );
                            }
                        })}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default RoomLayoutSkeleton;
