import React, { useEffect, useState } from 'react';
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { Audio } from 'react-loader-spinner';

// Helper function to convert bytes to gigabytes
const bytesToGB = (bytes) => (bytes / (1024 ** 3)).toFixed(2);

// Modal component
const Modal = ({ show, onClose, title, content }) => {
    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-white rounded-lg p-5 w-11/12 max-w-md max-h-[80vh] overflow-auto relative shadow-lg transform transition-transform duration-300 scale-100 hover:scale-105">
                <button
                    className="absolute top-2 right-2 text-gray-600 hover:text-gray-800 text-2xl"
                    onClick={onClose}
                >
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                <div className="overflow-y-auto">{content}</div>
            </div>
        </div>
    );
};

const Home = () => {
    const [memoryData, setMemoryData] = useState(null);
    const [diskData, setDiskData] = useState(null);
    const [processData, setProcessData] = useState(null);
    const [cpuUsageData, setCpuUsageData] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [modalContent, setModalContent] = useState({ title: '', content: '' });

    useEffect(() => {
        // Fetching memory, disk, and process data from the API
        fetch('http://localhost:8080/api/v1/details/memory')
            .then((response) => response.json())
            .then((data) => setMemoryData(data))
            .catch((error) => console.error('Error fetching memory data:', error));

        fetch('http://localhost:8080/api/v1/details/disk')
            .then((response) => response.json())
            .then((data) => setDiskData(data))
            .catch((error) => console.error('Error fetching disk data:', error));

        fetch('http://localhost:8080/api/v1/details/processes')
            .then((response) => response.json())
            .then((data) => setProcessData(data))
            .catch((error) => console.error('Error fetching process data:', error));
    }, []);

    // Function to handle opening the modal with specific content
    const handleOpenModal = (title, content) => {
        setModalContent({ title, content });
        setShowModal(true);
    };

    // Function to fetch CPU usage per process data
    const handleFetchCpuUsage = () => {
        fetch('http://localhost:8080/api/v1/details/cpu/usage/per-process')
            .then((response) => response.json())
            .then((data) => {
                setCpuUsageData(data);
                const formattedContent = (
                    <div className="space-y-2">
                        {Object.entries(data).map(([process, usage]) => (
                            <div key={process} className="flex justify-between items-center py-2">
                                <p className="font-medium">{process}</p>
                                <p className="font-medium text-right">{usage.toFixed(2)}%</p>
                            </div>
                        ))}
                    </div>
                );
                handleOpenModal('CPU Usage Per Process', formattedContent);
            })
            .catch((error) => console.error('Error fetching CPU usage data:', error));
    };

    // Display loader until data is fetched
    if (!memoryData || !diskData || !processData) {
        return (
            <div className="flex items-center justify-center h-screen">
                <Audio height="80" width="80" radius="9" color="green" ariaLabel="loading" />
            </div>
        );
    }

    return (
        <div className="p-4 sm:p-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Memory Usage Section */}
                <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() =>
                        handleOpenModal('Memory Usage Details', (
                            <div className="space-y-2">
                                <p><strong>Total Memory:</strong> {bytesToGB(memoryData['Total Memory'])} GB</p>
                                <p><strong>Available Memory:</strong> {bytesToGB(memoryData['Available Memory'])} GB</p>
                                <p><strong>Usage:</strong> {memoryData.memoryUsagePercentage.toFixed(1)}%</p>
                            </div>
                        ))
                    }
                >
                    <h2 className="text-lg font-semibold mb-2">Memory Usage</h2>
                    <div className="w-32 h-32">
                        <CircularProgressbar
                            value={memoryData.memoryUsagePercentage}
                            text={`${memoryData.memoryUsagePercentage.toFixed(1)}%`}
                            styles={{
                                path: {
                                    stroke: `rgba(0, 0, 255, ${memoryData.memoryUsagePercentage / 100})`,
                                },
                                text: {
                                    fill: '#008000',
                                    fontSize: '14px',
                                },
                                trail: {
                                    stroke: '#d6d6d6',
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Disk Usage Section */}
                <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={() =>
                        handleOpenModal('Disk Usage Details', (
                            <div className="space-y-2">
                                <p><strong>Total Disk Space:</strong> {bytesToGB(diskData['Total Disk Space'])} GB</p>
                                <p><strong>Available Disk Space:</strong> {bytesToGB(diskData['Available Disk Space'])} GB</p>
                                <p><strong>Usage:</strong> {diskData.diskUsagePercentage.toFixed(1)}%</p>
                            </div>
                        ))
                    }
                >
                    <h2 className="text-lg font-semibold mb-2">Disk Usage</h2>
                    <div className="w-32 h-32">
                        <CircularProgressbar
                            value={diskData.diskUsagePercentage}
                            text={`${diskData.diskUsagePercentage.toFixed(1)}%`}
                            styles={{
                                path: {
                                    stroke: `rgba(0, 0, 255, ${diskData.diskUsagePercentage / 100})`,
                                },
                                text: {
                                    fill: '#FF0000',
                                    fontSize: '14px',
                                },
                                trail: {
                                    stroke: '#d6d6d6',
                                },
                            }}
                        />
                    </div>
                </div>

                {/* Running Processes Section */}
                <div
                    className="flex flex-col items-center cursor-pointer"
                    onClick={handleFetchCpuUsage}
                >
                    <h2 className="text-lg font-semibold mb-2">Running Processes</h2>
                    <div className="w-32 h-32">
                        <CircularProgressbar
                            value={processData['Running Process Count']}
                            maxValue={1000}
                            text={`${processData['Running Process Count']}`}
                            styles={{
                                path: {
                                    stroke: `rgba(0, 255, 0, ${processData['Running Process Count'] / 1000})`,
                                },
                                text: {
                                    fill: '#0000FF',
                                    fontSize: '14px',
                                },
                                trail: {
                                    stroke: '#d6d6d6',
                                },
                            }}
                        />
                    </div>
                </div>
            </div>

            {/* Modal Component */}
            <Modal
                show={showModal}
                onClose={() => setShowModal(false)}
                title={modalContent.title}
                content={modalContent.content}
            />
        </div>
    );
};

export default Home;