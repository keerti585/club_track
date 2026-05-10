import React from 'react';

const LoadingSpinner = ({ size = 16 }) => {
    return (
        <span
            className="inline-block animate-spin rounded-full border-2 border-blue-500 border-t-transparent"
            style={{ width: size, height: size }}
        />
    );
};

export default LoadingSpinner;
