// ProcessModal.js
import React from 'react';
import { Modal, Button, Table } from 'react-bootstrap';

const ProcessModal = ({ show, handleClose, processDetails }) => {
    return (
        <Modal show={show} onHide={handleClose}>
            <Modal.Header closeButton>
                <Modal.Title>CPU Usage per Process</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Table striped bordered hover>
                    <thead>
                        <tr>
                            <th>Process Name</th>
                            <th>CPU Usage (%)</th>
                        </tr>
                    </thead>
                    <tbody>
                        {Object.entries(processDetails).map(([processName, cpuUsage]) => (
                            <tr key={processName}>
                                <td>{processName}</td>
                                <td>{cpuUsage.toFixed(2)}</td>
                            </tr>
                        ))}
                    </tbody>
                </Table>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={handleClose}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
};

export default ProcessModal;
