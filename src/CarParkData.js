// Updated CarParkData.js
import React, { useEffect } from 'react';


function CarParkData({ carParkId }) {
    useEffect(() => {
        async function fetchData() {
            try {
                const response = await fetch(`/carpark`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log(data);
            } catch (error) {
                console.error('Error fetching car park data:', error);
            }
        }

        fetchData();
    }, [carParkId]);

    return (
        <div>
            {/* UI components here */}
        </div>
    );
}

export default CarParkData;
